import * as vscode from "vscode";

export class TokenManager {
  static globalState: vscode.Memento;

  static setCourseId(id: number) {
    return this.globalState.update("courseId", id);
  }

  static getCourseId(): number {
    return this.globalState.get<number>("courseId", -1);
  }

  static setCourseProp(propKey: "courseName" | "courseUserRole" | "courseDescription", propValue: string) {
    return this.globalState.update(propKey, propValue);
  }

  static getCourseProp(propKey: "courseName" | "courseUserRole" | "courseDescription"): string {
    return this.globalState.get<string>(propKey, "");
  }

  static setToken(tokenKey: "accessToken" | "refreshToken", token: string) {
    return this.globalState.update(tokenKey, token);
  }

  static getToken(tokenKey: "accessToken" | "refreshToken"): string {
    return this.globalState.get<string>(tokenKey, "");
  }
}