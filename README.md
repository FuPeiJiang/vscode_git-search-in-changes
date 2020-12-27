## create Diff Folder so you can search in many files using vscode
currently can only search in the diff of unstaged changes (uncomitted).


### clone, get the vsix, install vsix:<br/>
`git clone https://github.com/FuPeiJiang/vscode_git-search-in-changes.git`\
`cd vscode_git-search-in-changes`\
`yarn install`\
`yarn run vsix`\
`code --install-extension git-search-in-changes.vsix`\
install from git-search-in-changes.vsix
___
### folder created at \${temp}/git-search-in-changes/\${repoName}<br/>
`temp=os.tmpdir()`\
`repoName=git rev-parse --show-toplevel`
