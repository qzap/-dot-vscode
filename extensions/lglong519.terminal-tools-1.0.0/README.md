<center>

# <img src="https://raw.githubusercontent.com/lglong519/vscode-extension/master/images/logo.png"  height="50" width="50" align="center"> Terminal Tools

</center>

## Preview

![tools Preview](https://github.com/lglong519/vscode-extension/raw/master/images/terminal-tools.png)

## Usage

<img src="https://raw.githubusercontent.com/lglong519/vscode-extension/master/images/usage.gif" align="center" alt="[img]Usage"/>

## Features

| BUTTON | DESC |
| :-------------: | ------------- |
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><img src="https://raw.githubusercontent.com/lglong519/vscode-extension/master/images/lock.png"  height="14" width="14" align="center"></td> </table> |remember the active file then can run it when you are editting other files|
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="#BAF3BE">CD</font></td></table> |cd to the active file's path|
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="purple">cmd</font></td></table> |select default or custom directives to run in the terminal. Like installing some frequently used packages |
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="yellow">Clear</font></td></table> |clear the active terminal |
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="#fff">Rerun</font></td></table> |restart the active terminal then run the active js/ts file |
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="red">Run</font></td></table> |run the active js/ts file |
|<table><td style="padding:0 8px;" bgcolor="#007ACC"><font color="cyan">Stop</font></td></table> |restart the active terminal to destroy the running task |

## Configuration
example
```
{
    // custom directives
    "terminal-tools.directives": [
        "npm run sync",
    ],
    "terminal-tools.dependencies": [
        "customDependency"
    ],
    "terminal-tools.devDependencies": [
        "customDevDependency@version"
    ],
    "terminal-tools.globalDependencies": [
        "customDependency@^1.0.0"
    ],
    // use defualt or custom
    "terminal-tools.options": {
        "directives": "default",
        "dependencies": "default",
        "devDependencies": "default",
        "globalDependencies": "default",
        "tools": "default",
        "sudo": false,
        // use npm or other else
        "install": "npm",
        "installOptions": [
            "--registry http://registry.npmjs.org"
        ]
    }
}
```
use custom directives only
```
{
    "terminal-tools.options": {
        "directives": "custom"
    }
}
```