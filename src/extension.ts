// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { VscodeSettings } from './ssh/ssh';

const tempKey = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    MY_DEFAULT_VCLOUD: "ivi.cloudList"
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ivi-essential" is now active!');
    const vscodeSettings = VscodeSettings.getInstance();
    console.log("Default vcloud: " + vscodeSettings.defaultVcloud);
    vscodeSettings.defaultVcloudConfig(tempKey.MY_DEFAULT_VCLOUD + '.' + vscodeSettings.defaultVcloud);
    vscodeSettings.startSSHConnection();

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('ivi-essential.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from ivi-essential!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
