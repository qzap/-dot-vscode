'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	
	const disposable = vscode.commands.registerCommand('extension.fillTabs', function () {
		
		// Get the active text editor
		const editor = vscode.window.activeTextEditor;
		
		
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;
			
			
			let allText = document.getText();
			let arrAllText = allText.split(/\n/gm);
			
			
			for (let _i = 0; _i < arrAllText.length; _i ++) {
				
				console.log( "_i", `(${typeof _i}): `, _i);
				// if (_i > 6) break;
				
				let line = arrAllText[_i];
				let nextLine = arrAllText[_i + 1];
				
				if (!nextLine) break;
				
				if (! (/^(?!.)/gi).test(nextLine)) continue; // si la siguiente línea tiene caracteres, me salto esta iteración
				
				
				if ((/^(?!.)/gi).test(nextLine)) {
					console.log("regex TRUE")
				} else {
					console.log("regex FALSE")
				}
				
				let nTabs = line.split(/\t/m).length; // busco las tabulaciones que tiene esta línea
				let nTabsNext = nextLine.split(/\t/m).length; // la siguiente línea
				
				console.log( line.split(/\t/m), nextLine.split(/\t/m) );
				console.log( nTabs, nTabsNext );
				
				let tabsRestantes = nTabs - nTabsNext;
				
				console.log( "Soy", `(${typeof line}): `, line);
				console.log( "Meto tabs al de abajo", `(${typeof tabsRestantes}): `, tabsRestantes);
				console.log( "---------------------------------------------" );
				
				if (tabsRestantes > 0) {
					let addedTab = "".padStart(tabsRestantes, "\t");
					arrAllText[_i + 1] = addedTab + nextLine;
				};
				
			};
			
			
			let firstLine = document.lineAt(0);
			let lastLine = document.lineAt(document.lineCount - 1);
			const range = new vscode.Range(firstLine.range.start, lastLine.range.end);
			
			editor.edit(editBuilder => {
				editBuilder.replace(range, arrAllText.join(""));
			});
			
		}
	});
	
	context.subscriptions.push(disposable);
}