import * as vscode from "vscode";
import { apiBaseUrl } from "./constants";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";
import fetch from "node-fetch";
import { isAccessToken } from "./predicates/isAccessToken";
import { isCourseProps } from "./predicates/isCourseProps";
import { CourseProps } from "./models/CourseProps";
import { CoursePanel } from "./CoursePanel";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) {
    }

    public resolveWebviewView(webviewView: vscode.WebviewView) {
        this._view = webviewView;

        webviewView.webview.options = {
            // Allow scripts in the webview
            enableScripts: true,

            localResourceRoots: [
                vscode.Uri.joinPath(this._extensionUri, "media"),
                vscode.Uri.joinPath(this._extensionUri, "dist/sidebar")
            ],

            // Allow command URIs in the webview
            enableCommandUris: true
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        // Just in case we need to do something if sidebar is opened/closed

        // webviewView.onDidChangeVisibility(() => {
        // });

        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
                case "executeCommand": {
                    if (!data.value) {
                        return;
                    }
                    vscode.commands.executeCommand('vscprototype.' + data.value);
                    break;
                }
                case "cloneRepository": {
                    if (!data.value) {
                        return;
                    }
                    vscode.commands.executeCommand('git.clone', data.value);
                    break;
                }
                case "getAccessToken": {
                    webviewView.webview.postMessage({
                        type: "accessToken",
                        value: TokenManager.getToken("accessToken")
                    });
                    break;
                }
                case "refresh": {
                    const body = { token: TokenManager.getToken("refreshToken") };
                    const response = await fetch(`${apiBaseUrl}/authenticate/refresh`, {
                        method: 'POST',
                        headers: {
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Accept': 'application/json',
                            // eslint-disable-next-line @typescript-eslint/naming-convention
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(body)
                    }).then(response => response.json());
                    type ResponseError = { error: string };
                    type AccessToken = { accessToken: string };
                    const data: AccessToken | ResponseError = response;
                    if (isAccessToken(data)) {
                        const newAccessToken: string = data.accessToken;
                        await TokenManager.setToken("accessToken", newAccessToken);
                        webviewView.webview.postMessage({
                            type: "accessToken",
                            value: newAccessToken
                        });
                        if(CoursePanel.currentPanel) {
                            CoursePanel.createOrShow(this._extensionUri);
                        }
                    } else {
                        vscode.window.showInformationMessage("Could not refresh session. Please sign back in upon expiration!");
                    }
                    break;
                }
                case "signOut": {
                    await TokenManager.setToken("accessToken", "");
                    await TokenManager.setToken("refreshToken", "");
                    await TokenManager.setCourseId(-1);
                    await TokenManager.setCourseProp("courseName", "");
                    await TokenManager.setCourseProp("courseUserRole", "");
                    CoursePanel.kill();
                    webviewView.webview.postMessage({
                        type: "accessToken",
                        value: TokenManager.getToken("accessToken")
                    });
                    break;
                }
                case "openCourseInNewTab": {
                    if (!data.value || !isCourseProps(data.value)) {
                        return;
                    }
                    const courseProps: CourseProps = data.value;
                    await TokenManager.setCourseId(courseProps.id);
                    await TokenManager.setCourseProp("courseName", courseProps.name);
                    await TokenManager.setCourseProp("courseUserRole", courseProps.role);
                    await TokenManager.setCourseProp("courseDescription", courseProps.description);
                    vscode.commands.executeCommand('vscprototype.coursePanel');
                    break;
                }
            }
        });
    }

    public revive(panel: vscode.WebviewView) {
        this._view = panel;
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const styleResetUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
        );
        const styleVSCodeUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
        );
        const scriptUri = webview.asWebviewUri(
            vscode.Uri.joinPath(this._extensionUri, "dist/sidebar", "sidebar.js")
        );

        // Use a nonce to only allow a specific script to be run.
        const nonce = getNonce();

        return `<!DOCTYPE html>
			<html lang="en">
			    <head>
				    <meta charset="UTF-8">
				    <!--
					    Use a content security policy to only allow loading images from https or from our extension directory,
					    and only allow scripts that have a specific nonce.
                    -->
                    <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource} https://fonts.googleapis.com; script-src 'nonce-${nonce}';">
				    <meta name="viewport" content="width=device-width, initial-scale=1.0">
				    <link href="${styleResetUri}" rel="stylesheet">
				    <link href="${styleVSCodeUri}" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
                    <script nonce="${nonce}">
                        const vscode = acquireVsCodeApi();
                        const initialAccessToken = ${JSON.stringify(TokenManager.getToken("accessToken"))};
                    </script>
			    </head>
                <body>
                    <div id="root"></div>
				    <script nonce="${nonce}" src="${scriptUri}"></script>
			    </body>
			</html>`;
    }
}