# VSC Prototype

The VSC Prototype is a Visual Studio Code extension written in Typescript using React for the webview.
The aim of this prototype is to simulate the lecturer component for the [HAW-OPPSEE platform](https://oppsee.informatik.haw-hamburg.de/) 
of [Hamburg University of Applied Sciences](https://www.haw-hamburg.de/en) in a demonstrative way.

Der VSC Prototyp ist eine in Typescript geschriebene Visual Studio Code Extension, unter der Verwendung von React im Webview. 
Ziel dieses Prototyps ist es, die Lehrendenkomponente für die [Oppsee-Plattform](https://oppsee.informatik.haw-hamburg.de/) 
der [HAW Hamburg](https://www.haw-hamburg.de) anschaulich zu simulieren.

## Basic setup

To build the basic setup of this project on your own make sure that you have installed [Git](https://git-scm.com/) in addition to [Node.js](https://nodejs.org/en/). 

Then follow the [Hello World example] for Visual Studio Code and install [Yeoman](https://yeoman.io/) and [VS Code Extension Generator](https://www.npmjs.com/package/generator-code) with:\
`npm install -g yo generator-code`

Run the generator and fill out the following fields for our project:

`yo code`

`? What type of extension do you want to create? New Extension (TypeScript)`\
`? What's the name of your extension? VSCPrototype`\
`Press <Enter> to choose default for all options below ###`

`? What's the identifier of your extension? vscprototype`\
`? What's the description of your extension?` `Prototype for lecturer component`
*`(You may want to add your own description here)`*\
`? Initialize a git repository? Yes`\
`? Bundle the source code with webpack? Yes`\
`? Which package manager to use? npm`

`code ./vscprototype`

Now within this directory create a new React project with:\
`npx create-react-app app --template typescript`

Now we have generated the boilerplate code for a Visual Studio Code extension and React. In order for the React project to run in a webview of the extension, we need to configure the project accordingly. To accomplish this we will use Webpack.

To do this, install the React application's dependencies in the root folder of your extension:\
`npm install react`\
`npm install react-dom`\
`npm install @types/react`\
`npm install @types/react-dom`\
`npm install @testing-library/react`\
`npm install web-vitals`\
`npm install @testing-library/jest-dom`

Now you can delete the following folders and files within your **React** project:
* node_modules
* public
* package-lock.json
* package.json

The dependencies are now automatically loaded from the extension's node_modules folder within the root directory.

To recognize the .svg file within [App.tsx](first-react-app-ts/src/App.tsx) refactor the react-app-env.d.ts file to custom.d.ts and replace the code with the following lines to declare a basic .svg module:
```
declare module "*.svg" {
    const content: any;
    export default content;
}
```

Create a new folder in your root directory called **extension**. In this folder create a new file called **ProtoPanel.ts**. Move your extension's src directory into the newly created folder **extension**.

Install some dev-dependencies (loaders) for webpack:

`npm install --save-dev style-loader`\
`npm install --save-dev css-loader`\
`npm install --save-dev svg-url-loader`

Apply the following configuration files to configure Webpack and Typescript for the Visual Studio Code extension and React:
* [tsconfig.json file within your React project](first-react-app-ts/tsconfig.json)
* [tsconfig.json file within your extension project](tsconfig.json)
* [node-extension.webpack.config.js file to bundle the react and extension project](build/node-extension.webpack.config.js) (seperately)

Make sure to change the primary entry point "**main**" in your [package.json](package.json) to:

`"./dist/extension/extension.js"`

Then we create a new folder media inside the root directory, and there we create the two files reset.css and vscode.css. We can copy the source code for these files from a [sample project](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-sample/media) for VS Code Extensions from Microsoft. The css files are useful to adapt the webviews to the style of VS Code. 

The [ProtoPanel.ts](src/FirstProtoPanel.ts) file is also largely derived from this project and adapted to our needs. The use of content and the management of webviews is implemented exemplarily in the [extension.js](https://github.com/microsoft/vscode-extension-samples/blob/main/webview-sample/src/extension.ts) file. We use this code in our newly created file and not in extension.ts, because our project was created object-oriented with Typescript. The focus is therefore also on breaking down the source code logically into classes. Thereby the task of our [extension.ts](src/extension.ts) file is mainly the registration and administration of commands for VS Code extension execution.

When transferring the source code from the [ProtoPanel.ts](src/FirstProtoPanel.ts) file, you may probably notice that there is still an error here. To fix this issue, we need to create another class called **getNonce.ts** in the extension folder. For this we use the following code:
```
export function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}
```
This class does nothing but generate us a random 32 character string that can be used as a nonce attribute in html. This is useful to whitelist our script and style files.

In order to display our React app in the webview, we first have to modify the extension.ts file accordingly. To do this, we first need to import the ProtoPanel into our extension.ts:

`import { FirstProtoPanel } from './FirstProtoPanel';`

Then we rename the command from *vscprototype.helloWorld* to *vscprototype.protoPanel*. Now, instead of displaying the information message, we replace the code and create our ProtoPanel:\
~~`vscode.window.showInformationMessage('Hello World from VSCPrototype!');`~~\
`ProtoPanel.createOrShow(context.extensionUri);`

In order for our command to be recognized, it must be configured in the **package.json**. Under activationEvents replace\
~~`onCommand:vscprototype.helloWorld`~~\
by\
`onCommand:vscprototype.protoPanel`.

In the Commands section, replace the command\
~~`vscprototype.helloWorld`~~\
by\
`vscprototype.protoPanel`,\
\
replace the title\
~~`Hello World`~~\
by\
`Proto Panel`\
\
and add the following line:\
`"category": "VSC prototype"`

Finally go to your .eslintrc.json file and add the following line:\
`"ignorePatterns": ["dist/**/*.js"]`\
to ignore linting within generated files.

Press f5 to debug your VS Code extension. For some reason the generation of **dist/react.js** might fail. To solve this, restart Visual Studio Code and press f5 again. 

## Features

**TODO**: Describing features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

To use this project, make sure you have [Node.js](https://nodejs.org/en/) installed.

## Extension Settings

No additional settings needed.

This extension contributes the following settings:

* `myExtension.enable`: enable/disable this extension
* `myExtension.thing`: set to `blah` to do something

## Commit Log

A set of all commits with a brief description in this project

### Commit 1 – C1

Initial commit. Basic setup of a typescript react app running in a VS Code extension. 

### Commit 2 – C2

Updated README.md: Fixed some relative links. 

### Commit 3 – C3

Updated README.md: Improved explanation on how to start the extension.

### Commit 4 – C4

Fixed and closed [issue 1](issues/1) and [issue 2](issues/2).

### Commit 5 – C5

Updated README.md: Extended commit log and removed explanation on how to handle the by now fixed Issues.

## Known Issues

A set of all known issues in this project.

### Issue 1 – I1

After launching the extension with webpack, there is an <span style="color:red">*Uncaught ReferenceError: module is not defined*</span> within the generated file *react.js*. The error does not affect the functionality of the extension. However, a fix would still be welcome. 

### Issue 2 – I2

The generation of dist/react.js might fail. To solve this, a rebuild of the application is needed. 

## Release Notes

No official release yet.

### 1.0.0

No official release yet ...