if in package.json
```
"scripts": {
    "vscode:prepublish": "tsc"
}
```
this will be called every time you call `vsce package`, so `tsc`, then package