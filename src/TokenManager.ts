import * as vscode from "vscode";

export class TokenManager {
  static globalState: vscode.Memento;

  static setToken(tokenKey: "accessToken" | "refreshToken", token: string) {
    return this.globalState.update(tokenKey, token);
  }

  static getToken(tokenKey: "accessToken" | "refreshToken"): string {
    return this.globalState.get(tokenKey, "");
  }
}