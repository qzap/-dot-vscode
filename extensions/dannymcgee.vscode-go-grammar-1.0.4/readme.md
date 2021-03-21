# Go Grammar

This extension provides a highly detailed VSCode TextMate grammar for Go. The TextMate scopes are mostly borrowed from Microsoft's TypeScript grammar, so it should work out-of-the-box with your favorite theme.

![Dark+](https://github.com/dannymcgee/vscode-go-grammar/raw/main/examples/darkplus.png)
![Material](https://github.com/dannymcgee/vscode-go-grammar/raw/main/examples/material.png)
![One Dark Pro](https://github.com/dannymcgee/vscode-go-grammar/raw/main/examples/onedarkpro.png)

Do note that some of the highlights aren't _quite_ right due to the limits of TextMate's grammar format (and the limits of my patience 🙂), particularly around variables vs packages vs types. If this sort of thing bugs you as much as it bugs me, you can install my [patched version of gopls](https://github.com/dannymcgee/golang-tools/tree/semantic-tokens) to fix it.

![Summer Vacation (grammar only)](https://github.com/dannymcgee/vscode-go-grammar/raw/main/examples/summervac--syntax-only.png)
![Summer Vacation (semantic tokens)](https://github.com/dannymcgee/vscode-go-grammar/raw/main/examples/summervac--semantic-tokens.png)
