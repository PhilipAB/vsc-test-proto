import * as vscode from "vscode";
import { getNonce } from "./getNonce";
import { TokenManager } from "./TokenManager";

export class CoursePanel {
  /**
   * Track the currently panel. Only allow a single panel to exist at a time.
   */
  public static currentPanel: CoursePanel | undefined;

  public static readonly viewType = "first-proto";

  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    // If we already have a panel, show it.
    if (CoursePanel.currentPanel) {
      CoursePanel.currentPanel._panel.reveal(column);
      CoursePanel.currentPanel._update();
      return;
    }

    // Otherwise, create a new panel.
    const panel = vscode.window.createWebviewPanel(
      CoursePanel.viewType,
      "CoursePanel",
      column || vscode.ViewColumn.One,
      {
        // Enable javascript in the webview
        enableScripts: true,

        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
          vscode.Uri.joinPath(extensionUri, "media"),
          vscode.Uri.joinPath(extensionUri, "dist/panel")
        ]
      }
    );

    CoursePanel.currentPanel = new CoursePanel(panel, extensionUri);
  }

  public static kill() {
    CoursePanel.currentPanel?.dispose();
    CoursePanel.currentPanel = undefined;
  }

  public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    CoursePanel.currentPanel = new CoursePanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
  }

  public dispose() {
    CoursePanel.currentPanel = undefined;

    // Clean up our resources
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    const webview = this._panel.webview;

    this._panel.webview.html = this._getHtmlForWebview(webview);
    webview.onDidReceiveMessage(async (data) => {
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

  private _getHtmlForWebview(webview: vscode.Webview) {

    const reactAppUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "dist/panel", "panel.js")
    );

    // Local path to css styles
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const stylesMainUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );

    // Use a nonce to only allow specific scripts to be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
        <link href="${stylesMainUri}" rel="stylesheet">
        <script nonce="${nonce}">
          vscode=acquireVsCodeApi();
          const initialAccessToken = ${JSON.stringify(TokenManager.getToken("accessToken"))};
          const isSideBar = false;
          const initCourseId = ${JSON.stringify(TokenManager.getCourseId())};
          const courseName = ${JSON.stringify(TokenManager.getCourseProp("courseName"))};
          const courseUserRole = ${JSON.stringify(TokenManager.getCourseProp("courseUserRole"))};
        </script>
			</head>
      <body>
        <div id="root"></div>

        <script src="${reactAppUri}" nonce="${nonce}"></script>
			</body>
			</html>`;
  }
}