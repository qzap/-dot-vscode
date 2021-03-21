module.exports=(()=>{"use strict";var e={290:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,i){function s(e){try{c(n.next(e))}catch(e){i(e)}}function a(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}c((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.NodeDependenciesProvider=void 0;const o=r(549),i=r(747),s=r(622);function a(e){try{i.accessSync(e)}catch(e){return!1}return!0}t.NodeDependenciesProvider=class{constructor(e){this.workspaceRoot=e,this._onDidChangeTreeData=new o.EventEmitter,this.onDidChangeTreeData=this._onDidChangeTreeData.event}getTreeItem(e){return e}getChildren(e){var t,r;return n(this,void 0,void 0,(function*(){if(!this.workspaceRoot)return[];if(e)return(null===(t=e.resourceUri)||void 0===t?void 0:t.fsPath)?this.getDepsInPackageJson(null===(r=e.resourceUri)||void 0===r?void 0:r.fsPath):[];{const e=s.join(this.workspaceRoot,"package.json");return a(e)?this.getDepsInPackageJson(e):[]}}))}getDepsInPackageJson(e){if(a(e)){const t=JSON.parse(i.readFileSync(e,"utf-8")),r=s.dirname(e),n=(e,t=!1)=>{const n=new o.ThemeIcon(t?"github-alt":"github");return Object.entries(e).map((([e,t])=>{let i=[s.join(this.workspaceRoot,"node_modules",e,"package.json"),s.join(r,"node_modules",e,"package.json")].find((e=>a(e)));return i?new c(e,t,o.TreeItemCollapsibleState.Collapsed,n,o.Uri.file(i)):new c(e,t,o.TreeItemCollapsibleState.None,n)}))},l=n(t.dependencies||{}),u=n(t.devDependencies||{},!0);return l.concat(u)}return[]}refresh(){this._onDidChangeTreeData.fire(),o.window.showInformationMessage("已刷新")}};class c extends o.TreeItem{constructor(e,t,r,n,o){var i;super(e,r),this.label=e,this.version=t,this.collapsibleState=r,this.iconPath=n,this.resourceUri=o,this.tooltip=`${this.label}-${this.version}`,this.description=null===(i=this.resourceUri)||void 0===i?void 0:i.fsPath,this.resourceUri&&(this.command={title:"this.label",command:"vscode.open",arguments:[this.resourceUri]})}}},883:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,i){function s(e){try{c(n.next(e))}catch(e){i(e)}}function a(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}c((n=n.apply(e,t||[])).next())}))},o=this&&this.__rest||function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t.indexOf(n)<0&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(n=Object.getOwnPropertySymbols(e);o<n.length;o++)t.indexOf(n[o])<0&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]])}return r};Object.defineProperty(t,"__esModule",{value:!0}),t.ProjectTreeItem=t.ProjectTreeDataProvider=void 0;const i=r(549);t.ProjectTreeDataProvider=class{constructor(e,t){this.rootPath=e,this.config=t,this.refreshEvent=new i.EventEmitter,this.onDidChangeTreeData=this.refreshEvent.event}refresh(e){this.config=e,this.refreshEvent.fire()}getChildren(e){return n(this,void 0,void 0,(function*(){let t=(null==e?void 0:e.resourceUri)?(yield this.loadDirectory(e.resourceUri)).map((({name:e,resourceUri:t,hasChildren:r})=>({name:e,resourceUri:t,hasChildren:r,tooltip:e}))):[];return[...((e?e.children:this.config.folders)||[]).map((e=>{var{name:t}=e,r=o(e,["name"]);return Object.assign({name:t,hasChildren:!0,tooltip:t,children:r.folders||[]},r.path?{resourceUri:i.Uri.joinPath(i.Uri.file(this.rootPath),r.path)}:{})})),...t]}))}loadDirectory(e){return n(this,void 0,void 0,(function*(){return i.workspace.fs.readDirectory(e).then((t=>t.map((([t,r])=>({name:t,resourceUri:i.Uri.joinPath(e,t),hasChildren:r!==i.FileType.File}))).sort(((e,t)=>e.hasChildren===t.hasChildren?e.name.toLowerCase()>t.name.toLowerCase()||e.name>t.name?1:-1:t.hasChildren?1:-1))))}))}getTreeItem(e){return n(this,void 0,void 0,(function*(){let t=new s(e.resourceUri||e.name,e.hasChildren?i.TreeItemCollapsibleState.Collapsed:i.TreeItemCollapsibleState.None);return t.label=e.name,t.tooltip=e.tooltip,e.hasChildren||(t.command={title:"this.label",command:"vscode.open",arguments:[e.resourceUri]}),t}))}};class s extends i.TreeItem{constructor(e,t){super(e,t)}}t.ProjectTreeItem=s},112:function(e,t,r){var n=this&&this.__awaiter||function(e,t,r,n){return new(r||(r=Promise))((function(o,i){function s(e){try{c(n.next(e))}catch(e){i(e)}}function a(e){try{c(n.throw(e))}catch(e){i(e)}}function c(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,a)}c((n=n.apply(e,t||[])).next())}))};Object.defineProperty(t,"__esModule",{value:!0}),t.deactivate=t.activate=void 0;const o=r(549),i=r(622),s=r(282),a=r(290),c=r(883);t.activate=function(e){var t,r;let l=null===(r=null===(t=o.workspace.workspaceFolders)||void 0===t?void 0:t[0])||void 0===r?void 0:r.uri.fsPath,u=o.Uri.file(i.join(l,"vue.project.config.js")),h=s.createRequire(l);function d(){try{return delete h.cache[u.fsPath],h(u.fsPath)}catch(e){console.log(e.message)}}const f=d(),p=new a.NodeDependenciesProvider(l),v=new c.ProjectTreeDataProvider(l,f||{folders:[]});let m=function(){let e=d();e?(v.refresh(e),o.window.showInformationMessage("已执行刷新")):o.window.showWarningMessage("缺少配置文件 vue.project.config.js")};e.subscriptions.push(o.window.registerTreeDataProvider("nodeDependenciesTreeView",p),o.window.registerTreeDataProvider("projectTreeView",v),o.commands.registerCommand("vpm.refreshProject",m),o.commands.registerCommand("vpm.createConfigFile",(function(){return n(this,void 0,void 0,(function*(){try{yield o.workspace.fs.readFile(u),console.warn("配置文件已经存在")}catch(e){let t="\nmodule.exports = {\n  folders: [\n    { name: 'Root', path: '.' }\n  ]\n};";yield o.workspace.fs.writeFile(u,Buffer.from(t,"utf8"))}m()}))})))},t.deactivate=function(){}},747:e=>{e.exports=require("fs")},282:e=>{e.exports=require("module")},622:e=>{e.exports=require("path")},549:e=>{e.exports=require("vscode")}},t={};return function r(n){if(t[n])return t[n].exports;var o=t[n]={exports:{}};return e[n].call(o.exports,o,o.exports,r),o.exports}(112)})();