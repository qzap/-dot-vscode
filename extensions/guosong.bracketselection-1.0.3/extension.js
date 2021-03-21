// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    var disposable = vscode.commands.registerTextEditorCommand('extension.selectTextInBracket', function (textEditor, edit) {
        // The code you place here will be executed every time your command is executed
        const leftBrakets = ['{', '[', '(', '<', "'", '"', '`'];
        const rightBrakets = ['}', ']', ')', '>', "'", '"', '`'];
        var { document, selection } = textEditor;
        let posStack = [], startCharater = -1, endCharater = -1;
        var curPos = textEditor.selection.active;
        if (!curPos)
            return;
        const lineText = document.lineAt(curPos.line).text;
        for (let i = 0; i < lineText.length; i++) {
            let currentCharter = lineText[i];
            let leftType = leftBrakets.indexOf(currentCharter);
            if(leftType === 4){
                leftBrakets[4] = 'LSQ';
            } else if(leftType === 5){
                leftBrakets[5] = 'LQ';
            } else if(leftType === 6){
                leftBrakets[6] = 'DQ';
            }

            if (leftType >= 0) {
                posStack.push({
                    type: leftType,
                    pos: i
                })
                continue;
            }

            let rightType = rightBrakets.indexOf(currentCharter);
            if (rightType >= 0) {
                if (!posStack.length)
                    continue;
                if (posStack[posStack.length - 1].type != rightType)
                    continue;
                var start = posStack.pop();
                if (start.pos < curPos.character && curPos.character <= i) {
                    startCharater = start.pos;
                    endCharater = i;
                    break;
                }
            }
        }

        if (startCharater >= 0 && endCharater >= 0) {
            var selectStart = new vscode.Position(curPos.line, startCharater + 1);
            var selectEnd = new vscode.Position(curPos.line, endCharater);
            var newSelection = new vscode.Selection(selectStart, selectEnd);
            textEditor.selection = newSelection;
        }
    });

    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;