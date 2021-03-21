# Database Client

[![Marketplace Version](https://vsmarketplacebadge.apphb.com/version-short/cweijan.vscode-mysql-client2.svg)](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2) [![Installs](https://vsmarketplacebadge.apphb.com/installs-short/cweijan.vscode-mysql-client2.svg)](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2) [![Rating](https://vsmarketplacebadge.apphb.com/rating-short/cweijan.vscode-mysql-client2.svg)](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2)

Database Client for Visual Studio Code. It supports databases MySQL/MariaDB, Microsoft SQL Server, PostgreSQL, Redis, and ElasticSearch.

> Project site: [vscode-database-client](https://github.com/cweijan/vscode-database-client), [中文文档](https://github.com/cweijan/vscode-database-client/blob/master/README_CN.md)

## Features

- [Database Client](#database-client)
  - [Connect](#connect)
  - [Table](#table)
  - [Execute SQL Query](#execute-sql-query)
  - [Generate Mock Data](#generate-mock-data)
  - [History](#history)
  - [Backup/Import](#backupimport)
  - [Setting](#setting)
  - [Filter](#filter)

## Installation

Install from vscode marketplace [vscode-database-client](https://marketplace.visualstudio.com/items?itemName=cweijan.vscode-mysql-client2).

## Connect

1. Open Database Explorer panel, then click the `+` button.
2. Select your database type, input your database connection information then click the connect button.

![connection](https://github.com/cweijan/vscode-database-client/raw/master/images/connection.jpg)

## Table

1. Click table to open table view.
2. Then you can do data modification on the view page.

![query](https://github.com/cweijan/vscode-database-client/raw/master/images/QueryTable.jpg)

## Execute SQL Query

In the Database Explorer panel, click the `Open Query` button.

![newquery](https://github.com/cweijan/vscode-database-client/raw/master/images/newquery.jpg)

That will open a sql editor bind of database, it provider:

1. IntelliSense sql edit.
2. snippets: `sel、del、ins、upd、joi`...
3. run sql (Shortcut : F9).

![run](https://github.com/cweijan/vscode-database-client/raw/master/images/run.jpg)

## Generate Mock Data

Now you do not need to spend time writing test data.

![mockData](https://github.com/cweijan/vscode-database-client/raw/master/images/mockData.png)

## History

Click the history button to open the list of recently executed query history records.

![history](https://github.com/cweijan/vscode-database-client/raw/master/images/history.jpg)

## Backup/Import

Move to ant DatabaseNode or TableNode. The export/import options are listed in the context menu (right click to open).

![bakcup](https://github.com/cweijan/vscode-database-client/raw/master/images/Backup.jpg)

## Setting

This extension contain some setting, find him in the following way.

![](https://github.com/cweijan/vscode-database-client/raw/master/image/README/1611910592756.png)

## Filter

![filter](https://github.com/cweijan/vscode-database-client/raw/master/images/filter.gif)

## Credits

- [vscode-mysql](https://github.com/formulahendry/vscode-mysql): The original version of this extension.
- [mysqldump](https://github.com/bradzacher/mysqldum): Data dump lib.
- [sql-formatter](https://github.com/zeroturnaround/sql-formatter) Sql format lib.
- [umy-ui](https://github.com/u-leo/umy-ui): Result view render.
- Core Lib:
  - [node-mysql2](https://github.com/sidorares/node-mysql2) : Mysql client.
  - [node-postgres](https://github.com/brianc/node-postgres): PostgreSql client.
  - [tedious](https://github.com/tediousjs/tedious): SqlServer client.
