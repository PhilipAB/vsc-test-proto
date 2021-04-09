import * as vscode from "vscode";
import { getNonce } from "./getNonce";

export class SidebarProvider implements vscode.WebviewViewProvider {
    _view?: vscode.WebviewView;
    _doc?: vscode.TextDocument;

    constructor(private readonly _extensionUri: vscode.Uri) { }

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
                    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
                    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
                    <script nonce="${nonce}">
                        vscode=acquireVsCodeApi();
                    </script>
			    </head>
                <body>
                    <div id="root"></div>
				    <script nonce="${nonce}" src="${scriptUri}"></script>
			    </body>
			</html>`;
    }
}