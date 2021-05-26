import * as vscode from "vscode";
import { apiBaseUrl } from './constants';
import polka, { Polka } from 'polka';
import { Request } from 'express';
import { Response } from 'express-serve-static-core';
import { TokenManager } from "./TokenManager";

export const authenticate = async (sidebarWebview: vscode.Webview | undefined) => {

    const app: Polka = polka();
    let PORT: number = 37658;

    app.get('/authenticate', async (req: Request, res: Response) => {
        const accessToken = req.query.access;
        const refreshToken = req.query.refresh;
        if (!accessToken || !refreshToken || typeof accessToken !== 'string' || typeof refreshToken !== 'string') {
            res.end('<h1>Could not obtain token!<h1>');
        }
        else {
            await TokenManager.setToken("accessToken", accessToken);
            await TokenManager.setToken("refreshToken", refreshToken);
            if (sidebarWebview) {
                sidebarWebview.postMessage({
                    type: "accessToken",
                    value: TokenManager.getToken("accessToken")
                });
            } else {
                vscode.window.showErrorMessage("Sidebar webview is not defined!");
            }
            res.end('<h1>Authentication was successful <h1>');
            app.server?.close();
        }
    });

    app.listen(PORT, (err: Error) => {
        if (err) {
            vscode.window.showErrorMessage(err.message);
        } else {
            vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(`${apiBaseUrl}/authenticate/provider`));
        }
    });
};