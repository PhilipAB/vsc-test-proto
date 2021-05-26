// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { authenticate } from './authenticate';
import { FirstProtoPanel } from './FirstProtoPanel';
import { SidebarProvider } from './SidebarProvider';
import { TokenManager } from './TokenManager';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscprototype" is now active!');

	TokenManager.globalState = context.globalState;
	const sidebarProvider = new SidebarProvider(context.extensionUri);
	const sidebarProviderDisposable = vscode.window.registerWebviewViewProvider("sidebar", sidebarProvider, {
		// Needs to be true -> otherwise authentication state can not be maintained when sidebar gets closed 
		webviewOptions: {
			retainContextWhenHidden: true
		}
	});
	context.subscriptions.push(sidebarProviderDisposable);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('vscprototype.helloWorld', () => {
			// The code you place here will be executed every time your command is executed

			// Display a message box to the user
			vscode.window.showInformationMessage('Hello World from VSCprototype!');
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscprototype.protoPanel', () => {
			FirstProtoPanel.createOrShow(context.extensionUri);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscprototype.authenticate', () => {
			authenticate(sidebarProvider._view?.webview);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('vscprototype.askQuestion', async () => {
			const answer = await vscode.window.showInformationMessage(
				'How was your day?',
				'good',
				'bad'
			);
			if (answer === 'bad') {
				vscode.window.showInformationMessage('Oh no, Sorry to hear that!');
			} else {
				console.log({ answer });
			}
		})
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
