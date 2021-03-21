# VS Code extension for indenting to open brackets

#### Fork of https://github.com/briankendall/vscode-indent-to-bracket with added support for multiple cursors/selections.

This is a minimal extension for VS Code that implements automatic indentation to the last open bracket / parenthesis. This is essentially the same feature as the `indent_to_bracket` setting in Sublime Text, except that it works with most brackets, including square, and curly brackets. (Currently angle brackets are not supported.)

Basically, when you type enter to create a new line, it automatically indents your code like this:

    variable = someMannerOfFunction(argument1,
                                    argument2,
                                    anotherArgument,
                                    (someNumber +
                                     someOtherNumber))
    someData = {'key': [1, 2, 3, 4, 5, 6, 7, 8,
                        9, 10, 11, 12, 13, 14],
                'anotherKey': {'what': 'huh?',
                               'who': 'wha?',
                               'where': 'guh?'},
                'lastKey': ('This is a string that ' \
                            'goes on too long to ' \
                            'easily fit on one line ' \
                            'if you're using some ' \
                            'weird terminal that ' \
                            'only has 52 columns ' \
                            'for some reason')

If any line ends with an open bracket of some sort, though, it still falls back on the default behavior for your current language. So it won't interfere with things like if statements or declaring functions with curly braces, and doing something like this still works:

    variable = someOtherFunction(
        argument1,
        argument2,
        argument3
    );


## Extension Settings

This extension currently has no settings, and will affect all languages and document types. If this is an issue for you, feel free to request me adding some sort of setting like a whitelist or blacklist for particular file extensions.


## Release Notes

### 1.2.1
- Fix indentation behaviour when pressing newline inside bracket pair to resemble default vs code behaviour.

### 1.1.0
- Support multiple cursors.

### 1.0.1

- No longer considering angle brackets -- did not work with boolean logic or bitwise operators
- Fixed bug where typing a new line after an open bracket while text is selected would not replace the text

### 1.0.0
Initial release
