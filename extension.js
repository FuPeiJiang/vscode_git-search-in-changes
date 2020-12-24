// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const window = vscode.window
const fs = require('fs')
const child_process = require('child_process')
const os = require('os')
const path = require('path')
var mkdirp = require('mkdirp');
var getDirName = path.dirname;
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "git-search-in-changes" is now active!')

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('git-search-in-changes.helloWorld', async function () {
		// The code you place here will be executed every time your command is executed
		try {
			const activeEditor = window.activeTextEditor
			var fullPath
			if (activeEditor) {
				const document = activeEditor.document

				fullPath = document.fileName.replace(/\\/g, '/')
				// console.log(fullPath)
			}


			const input = await window.showInputBox({ value: fullPath, prompt: "git repo path or subpath" })
			// const input = await vscode.window.showInputBox({placeHolder:"hehoeheh",prompt:"git repo path or subpath"})
			var dirToCheck, lastSlash
			if (fs.lstatSync(input).isDirectory()) {
				dirToCheck = input
			} else {
				lastSlash = input.lastIndexOf('/')
				if (lastSlash != -1) {
					dirToCheck = input.slice(0, lastSlash + 1)
				} else {
					vscode.window.showInformationMessage("path is not a dir and has no parent dir")
					return
				}
			}
			// console.log(dirToCheck);

			const gitRoot = child_process.execSync('git rev-parse --show-toplevel', { cwd: dirToCheck }).toString().slice(0, -1)
			var repoName
			lastSlash = gitRoot.lastIndexOf('/')
			if (lastSlash != -1) {
				repoName = gitRoot.slice(lastSlash + 1)
			} else {
				vscode.window.showInformationMessage("path is not a dir and has no parent dir")
				return
			}
			const tempDir = path.join(os.tmpdir(), repoName)
			console.log(tempDir);
			// fs.writeFileSync(path.join(tempDir, "folder1", "ok.txt"), "hello", 'utf-8')
			writeFile(path.join(tempDir, "folder1", "ok.txt"), "hello", 'utf-8')
			return
			// tempDir = 

			// console.log(gitRoot)
			// vscode.window.showInformationMessage(gitRoot)

			const changedFiles = child_process.execSync('git diff --name-only', { cwd: gitRoot }).toString().slice(0, -1)
			const newFiles = child_process.execSync('git diff --name-only --diff-filter=A --cached', { cwd: gitRoot }).toString().slice(0, -1)

			// const tempDir = os.tmpdir()

			console.log(changedFiles)
			console.log(newFiles)

			// vscode.window.showInformationMessage(input)
			// input
			// git rev-parse --show-toplevel
		} catch (error) {
			// console.log(typeof error);
			const strError = error.toString()
			if (strError.includes("Error: ENOENT: no such file or directory")) {
				vscode.window.showInformationMessage("path is not a dir and has no parent dir")
				console.log(strError)
			}

			// console.log(error.toString())
			// vscode.window.showInformationMessage(gitRoot)
		}


	})

	context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

function writeFile(path, contents, cb) {
	mkdirp(getDirName(path), function (err) {
	  if (err) return cb(err);
  
	  fs.writeFile(path, contents, cb);
	});
}