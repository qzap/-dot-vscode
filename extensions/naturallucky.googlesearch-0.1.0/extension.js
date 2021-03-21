const vscode = require('vscode');
function activate(context) {
  //console.log('Congratulations, your extension "googlesearch" is now active!');
    let disposable = vscode.commands.registerCommand('extension.googleSearchAtBrowser',
        googleSearchAtBrowser) ;

    context.subscriptions.push(disposable);
}
exports.activate = activate;
function deactivate() {}
exports.deactivate = deactivate;

function googleSearchAtBrowser(){
    var text = getSelection();
    runURL(text);

    async function runURL(word) {
        let config = vscode.workspace.getConfiguration('googleSearchAtBrowser');
        let baseurl = config.get('url');// || Controller.DefaultEndpointUrl;

        let uri = vscode.Uri.parse(baseurl + word);
        let success = await vscode.commands.executeCommand("vscode.open", uri);
    }

    function getSelection(){
        let editor = vscode.window.activeTextEditor;
        let doc = editor.document;

        let selection = editor.selection;
        let selStart, selEnd;
        selStart = doc.offsetAt(selection.start);
        selEnd = doc.offsetAt(selection.end);

        let phrase;
        if (selStart == selEnd) {
            //phrase = getCurrentWord(text, selStart);
            let range = doc.getWordRangeAtPosition(selection.start);
            phrase = doc.getText(range);
        } else {
            let text = doc.getText(new vscode.Range(selection.start, selection.end));
            if (!text) return '';

            phrase = text;//.slice(selStart, selEnd);
        }

        phrase = phrase.trim();

        phrase = phrase.replace(/\s\s+/g,' ');
        phrase = phrase.slice(0, 300).trim();
        return phrase;
    }

    /*
    function getCurrentWord(text, pos) {
        let prevt = text.substr(0, pos);
        let nextt = text.substr(pos);

        let re = new RegExp("[A-Za-z0-9_]+$");
        let result = prevt.match(re);

        let word = result.length > 0 ? result[0] : "@";

        re = new RegExp("^[A-Za-z0-9_]+");
        result = nextt.match(re);
        word = word + (result.length > 0? result[0] :"#");

        return word;
    }*/
}
