declare const vscode: {
  postMessage: (param: {type: string} | {type: string, value: string}) => void;
};

declare const initialAccessToken: string;

declare module "*.svg" {
  const content: any;
  export default content;
}