// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const window = vscode.window
const fs = require('fs')
const child_process = require('child_process')
const os = require('os')
const path = require('path')
const { forEachTrailingCommentRange } = require('typescript')
// var mkdirp = require('mkdirp')
// var getDirName = path.dirname
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
			const tempDir = path.join(os.tmpdir(), "git-search-in-changes", repoName)
			// console.log(tempDir)

			/* const newFiles = child_process.execSync('git diff --name-only --diff-filter=A --cached', { cwd: gitRoot }).toString().slice(0, -1)
			const arrNewFiles = newFiles.split("\n")
			copyFiles(arrNewFiles,gitRoot,tempDir) */

	/* 		var length = arrNewFiles.length
			for (let i = 0; i < length; i++) {
				// console.log(arrNewFiles[i])
				// writeFile(path.join(tempDir, arrNewFiles[i]), "hello", 'utf-8')
				copyFile(path.join(gitRoot, arrNewFiles[i]), path.join(tempDir, arrNewFiles[i]), 'utf-8')
			} */

			const changedFiles = child_process.execSync('git diff --name-only', { cwd: gitRoot }).toString().slice(0, -1)
			const arrChangedFiles = changedFiles.split("\n")
			diffFiles(arrChangedFiles,gitRoot,tempDir)
			return
			var length = arrChangedFiles.length
			for (let i = 0; i < length; i++) {
				const diffString = child_process.execSync('git diff ' + fileName, { cwd: parentDir }).toString()


				// copyFile(path.join(gitRoot, arrNewFiles[i]), path.join(tempDir, arrNewFiles[i]), 'utf-8')
			}

return

			let uri = vscode.Uri.file(tempDir)
			let success = await vscode.commands.executeCommand('vscode.openFolder', uri, true)
			console.log(success)
			// success = await vscode.commands.executeCommand('workbench.view.search', uri, true)
			// console.log(success)

			// writeFile(path.join(tempDir, "folder1", "ok"), "hello", 'utf-8')
			return
			// tempDir = 

			// console.log(gitRoot)
			// vscode.window.showInformationMessage(gitRoot)


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

// function writeFile(filePath, contents, cb) {
// mkdirp(getDirName(filePath), (err) => {
// if (err) return cb(err)
// fs.writeFile(filePath, contents, cb)
// })
// }

function diffFiles(arrNewFiles,gitRoot,tempDir) {
	var length = arrNewFiles.length
	for (let i = 0; i < length; i++) {
		fs.readFile(path.join(gitRoot, arrNewFiles[i]), function (err, data) {
			if (err) throw err

			// const diffString = child_process.exec('git diff ' + fileName, { cwd: parentDir }).toString()

			child_process.exec('git diff ' + arrNewFiles[i], { cwd: gitRoot }, (error, diffString) => {
				if (error) {
				  console.error(`exec error: ${error}`);
				  return;
				}
return
				const arr = diffString.split('\n')
				const len = arr.length
				var text, firstChar, wasMinus
				var lineAddition = 0
				// loop2fefef:
				for (i = 4; i < len; i++) {
					text = arr[i]
					firstChar = text[0]
					if (firstChar === "+") {
						if (wasMinus) {
							line--
						}
						lineAddition++
					} else if (firstChar === "-") {
						wasMinus = true
						lineAddition--
					} else if (firstChar === "@") {
						var plusIdx = text.indexOf("+") + 1
						line = parseInt(text.slice(plusIdx, text.indexOf(",", plusIdx)))
						line -= 3
					} else {
						const plusTwo = line + 2
						// console.log(currentRange[0], plusTwo - lineAddition)
						if (currentRange[0] < plusTwo + lineAddition) {
							// console.log(text)
							console.log("WOW")
							// console.log(lineAddition)
							origRange = [currentRange[0] - lineAddition, currentRange[1] - lineAddition]
							didSubstract = true
							break
						}
					}
					line++

					// console.log("line:", line, "lineAddition", lineAddition, "text", text)
				}
				// console.log(diffString);
			  })

			// writeFile(path.join(tempDir, arrNewFiles[i]), data, 'utf-8')
		})
	}
}

function copyFiles(arrNewFiles,gitRoot,tempDir) {
	var length = arrNewFiles.length
	for (let i = 0; i < length; i++) {
		fs.readFile(path.join(gitRoot, arrNewFiles[i]), function (err, data) {
			if (err) throw err
			
			const plusName = path.join(path.dirname(arrNewFiles[i]),"+" + path.basename(arrNewFiles[i]))

			writeFile(path.join(tempDir, plusName), data, 'utf-8')
		})
	}
}

// function copyFile(readPath, writePath, encoding) {
	// fs.readFile(readPath, encoding, function (err, data) {
		// if (err) throw err
		// writeFile(writePath, data, encoding)
	// })
// }

function writeFile(filePath, contents, encoding) {
	fs.promises.mkdir(path.dirname(filePath), { recursive: true }).then(x => fs.promises.writeFile(filePath, contents, encoding))
}