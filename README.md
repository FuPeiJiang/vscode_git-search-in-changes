## create Diff Folder so you can search in many files using vscode
___
### clone, get the vsix, install vsix:\
`git clone https://github.com/FuPeiJiang/vscode_git-search-in-changes.git`\
`cd vscode_git-search-in-changes`\
`yarn install`\
`yarn run vsix`\
`code --install-extension git-search-in-changes.vsix`\
install from git-search-in-changes.vsix
___
### folder created at \${temp}/\${repoName}\
`temp=os.tmpdir()`\
`repoName=git rev-parse --show-toplevel`