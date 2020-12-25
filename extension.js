const vscode = require('vscode')
const window = vscode.window
const fs = require('fs')
const child_process = require('child_process')
const os = require('os')
const path = require('path')
const trash = require('trash')

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('git-search-in-changes.createFolder', async function () {
		try {
			const activeEditor = window.activeTextEditor
			var fullPath
			if (activeEditor) {
				const document = activeEditor.document

				fullPath = document.fileName.replace(/\\/g, '/')
			}


			const input = await window.showInputBox({ value: fullPath, prompt: "git repo path or subpath" })
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

			await trash(tempDir)

			var newAr, deletedAr, changedAr
			// let promises = []
			const newFiles = child_process.execSync('git ls-files --others --exclude-standard', { cwd: gitRoot }).toString().slice(0, -1)
			if (newFiles === "")
				newAr = []
			else
				newAr = newFiles.split("\n")
			// promises.push(new Promise((resolve) => {
			// copyFiles(newFiles.split("\n"), gitRoot, tempDir)
			// resolve()
			// }))

			const deletedFiles = child_process.execSync('git ls-files --deleted', { cwd: gitRoot }).toString().slice(0, -1)
			if (deletedFiles === "")
				deletedAr = []
			else
				deletedAr = deletedFiles.split("\n")
			// promises.push(new Promise((resolve) => {
			// copyDeleted(deletedFiles.split("\n"), gitRoot, tempDir)
			// resolve()
			// }))

			const changedFiles = child_process.execSync('git diff --name-only --diff-filter=M', { cwd: gitRoot }).toString().slice(0, -1)
			if (changedFiles === "")
				changedAr = []
			else
				changedAr = changedFiles.split("\n")
			// promises.push(new Promise((resolve) => {
			// twoFilesPerChanged(changedFiles.split("\n"), gitRoot, tempDir)
			// resolve()
			// }))
			// console.log(newAr)
			// console.log(deletedAr)
			// console.log(changedAr)
			// return
			await amalgamate(newAr, deletedAr, changedAr, gitRoot, tempDir)
			// await Promise.all([copyFiles(newFiles.split("\n"), gitRoot, tempDir), copyDeleted(deletedFiles.split("\n"), gitRoot, tempDir), twoFilesPerChanged(changedFiles.split("\n"), gitRoot, tempDir)])

			let uri = vscode.Uri.file(tempDir)
			await vscode.commands.executeCommand('vscode.openFolder', uri, true)

			// .then(async () => {
			// let uri = vscode.Uri.file(tempDir)
			// await vscode.commands.executeCommand('vscode.openFolder', uri, true)
			// })

			// Promise.all(promises).then(async () => {
			// let uri = vscode.Uri.file(tempDir)
			// await vscode.commands.executeCommand('vscode.openFolder', uri, true)
			// })


			// let success = await vscode.commands.executeCommand('vscode.openFolder', uri, true)
			return

			/* 		var length = arrNewFiles.length
					for (let i = 0; i < length; i++) {
						// console.log(arrNewFiles[i])
						// writeFile(path.join(tempDir, arrNewFiles[i]), "hello", 'utf-8')
						copyFile(path.join(gitRoot, arrNewFiles[i]), path.join(tempDir, arrNewFiles[i]), 'utf-8')
					} */

			/* const changedFiles = child_process.execSync('git diff --name-only', { cwd: gitRoot }).toString().slice(0, -1)
			const arrChangedFiles = changedFiles.split("\n")
			diffFiles(arrChangedFiles, gitRoot, tempDir)
			return
			var length = arrChangedFiles.length
			for (let i = 0; i < length; i++) {
				const diffString = child_process.execSync('git diff ' + fileName, { cwd: parentDir }).toString()


				// copyFile(path.join(gitRoot, arrNewFiles[i]), path.join(tempDir, arrNewFiles[i]), 'utf-8')
			}

			return


			console.log(success) */
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
			const strError = error.toString()
			if (strError.includes("Error: ENOENT: no such file or directory")) {
				vscode.window.showInformationMessage("path is not a dir and has no parent dir")
				console.log(strError)
				return
			}
			console.log(strError)
		}


	})

	context.subscriptions.push(disposable)
}

function deactivate() { }

module.exports = {
	activate,
	deactivate
}


/* 
new Promise(async (resolve) => {
	resolve()
})
 */

function amalgamate(newFiles, deletedFiles, changedFiles, gitRoot, tempDir) {
	function addPromise(i) {
		return new Promise((resolve2) => {
			fs.readFile(path.join(gitRoot, newFiles[i]), async function (err, data) {
				if (err) throw err
				const plusName = path.join(path.dirname(newFiles[i]), "+" + path.basename(newFiles[i]))
				await writeFile(path.join(tempDir, plusName), data, 'utf-8')
				resolve2()
			})
		})
	}
	function minusPromise(i) {
		return new Promise((resolve2) => {
			child_process.exec('git show HEAD:"' + deletedFiles[i] + '"0', { cwd: gitRoot }, async (error, deletedContent) => {
				if (error) {
					console.error(`couldn't get last revision: ${error}`)
					return
				}
				const minusName = path.join(path.dirname(deletedFiles[i]), "-" + path.basename(deletedFiles[i]))
				await writeFile(path.join(tempDir, minusName), deletedContent, 'utf-8')
				resolve2()
			})
		})
	}
	function changedPromise(i) {
		return new Promise((resolve2) => {
			child_process.exec('git --no-pager diff "' + changedFiles[i] + '"', { cwd: gitRoot }, async (error, diffStr) => {
				if (error) {
					console.error(`couldn't get last revision: ${error}`)
					return
				}
				const arr = diffStr.split("\n")
				const len = arr.length

				var text, firstChar, additionLine = 0, subtractionLine = 0, addMaxLine, subMaxLine
				const addDict = {}, subDict = {}

				for (let k = 4; k < len; k++) {
					text = arr[k]
					if (k === 4)
						console.log(text)
					firstChar = text[0]
					// console.log(firstChar);
					if (firstChar === "+") {
						addDict[additionLine] = text.slice(1)
						addMaxLine = additionLine
						subtractionLine--
					} else if (firstChar === "-") {
						subDict[subtractionLine] = text.slice(1)
						subMaxLine = subtractionLine
						additionLine--
					} else if (firstChar === "@") {
						const minusIdx = text.indexOf("-") + 1
						subtractionLine = parseInt(text.slice(minusIdx, text.indexOf(","))) - 2

						const plusIdx = text.indexOf("+") + 1
						additionLine = parseInt(text.slice(plusIdx, text.indexOf(",", plusIdx))) - 2

					}
					additionLine++
					subtractionLine++
				}
				addMaxLine--; subMaxLine--
				const addArr = [], subArr = []

				for (let line = 4; line < addMaxLine; line++) {
					addArr.push((line in addDict) ? addDict[line] : "")
				}

				for (let line = 4; line < subMaxLine; line++) {
					subArr.push((line in subDict) ? subDict[line] : "")
				}

				const plusName = path.join(path.dirname(changedFiles[i]), "+" + path.basename(changedFiles[i]))
				writeFile(path.join(tempDir, plusName), addArr.join("\n"), 'utf-8')

				const minusName = path.join(path.dirname(changedFiles[i]), "-" + path.basename(changedFiles[i]))
				await writeFile(path.join(tempDir, minusName), subArr.join("\n"), 'utf-8')
				resolve2()
			})
		})
	}
	return new Promise(async (resolve) => {
		const promises = []
		var length, i
		length = newFiles.length
		for (i = 0; i < length; i++) {
			promises.push(addPromise(i))
		}
		length = deletedFiles.length
		for (let i = 0; i < length; i++) {
			promises.push(minusPromise(i))
		}
		length = changedFiles.length
		for (let i = 0; i < length; i++) {
			promises.push(changedPromise(i))
		}
		await Promise.all(promises)
		resolve()
	})

}

function writeFile(filePath, contents, encoding) {
	fs.promises.mkdir(path.dirname(filePath), { recursive: true }).then(() => fs.promises.writeFile(filePath, contents, encoding))
}