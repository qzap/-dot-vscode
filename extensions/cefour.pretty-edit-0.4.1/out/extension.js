"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const command_builder_1 = require("./command.builder");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "pretty-edit" v0.4.1 is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.prettyedit', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        let editor = vscode.window.activeTextEditor;
        if (editor) {
            let selections = editor.selections;
            if (editor) {
                let options = {
                    prompt: "Enter start;increment",
                    value: "",
                    placeHolder: "start;increment" // <- An optional string to show as place holder in the input box to guide the user what to type.
                };
                vscode.window.showInputBox(options).then((command) => {
                    if (command) {
                        let builder = new command_builder_1.CommandBuilder(command);
                        if (editor) {
                            builder.build(editor);
                        }
                    }
                });
            }
        }
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
/*

if(editor){
                        editor.edit(editBuilder =>{
                            let splittedCmd = command?.split(";");
                            if(splittedCmd){
                                let startIndex : number = +splittedCmd[0];
                                let inc : number = 1;
                                if(splittedCmd.length > 1){
                                    inc = +splittedCmd[1];
                                }
                                for (let index = 0; index < selections.length; index++) {
                                    const selection = selections[index];
                                    editBuilder.insert(selection.active,startIndex.toString());
                                    startIndex += inc;
                                    
                                }
                            }
                                
                        });
                    }
                    */ 
//# sourceMappingURL=extension.js.map