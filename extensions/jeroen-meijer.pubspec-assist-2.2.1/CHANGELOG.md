# Change Log

All notable changes to the "pubspec-assist" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.0 - 2018-09-15

- Initial beta release.

## 0.2.0 - 2018-09-17

### Changed

- Update existing dependency entry with latest version if it's already there instead of adding a second entry.
- Change default search threshold to **0.5** (from **1.0**).
- Change extension entry point to `pubspec-assist.openInput` (from `extension.openInput`).
- New changelog formatting based on Keep a Changelog.

### Added

- Add boolean setting for automatically adding a package on a very close match to search query (`pubspec-assist.autoAddPackage`).

## 0.3.0 - 2018-10-05

### Changed

- Improve bug reporting and error handling.

## 0.3.1 - 2018-11-29

### Changed

- Updated dependencies.

## 0.3.2 - 2018-12-08

### Changed

- Fix bug where new imported packages would replace existing similarly named packages. (Mentioned in issues: [#2](https://github.com/jeroen-meijer/pubspec-assist/issues/2))

## 0.3.3 - 2019-02-09

### Changed

- Catch errors related to http fetching and improve feedback to user. (Mentioned in issues: [#3](https://github.com/jeroen-meijer/pubspec-assist/issues/3), [#4](https://github.com/jeroen-meijer/pubspec-assist/issues/4), [#5](https://github.com/jeroen-meijer/pubspec-assist/issues/5) and [#6](https://github.com/jeroen-meijer/pubspec-assist/issues/6))

## 0.3.4 - 2019-02-21

### Changed

- Preserve newline characters at the end of the file if present before formatting. (Mentioned in issues: [#8](https://github.com/jeroen-meijer/pubspec-assist/issues/8))
- Refactor some methods for simplicity.

## 1.0.0 - 2020-04-23

First official release! 🎉

### Added

- Add dependencies to your pubspec without having the file open (thank you to [@mychaelgo](https://github.com/mychaelgo)!). (Merged from PR: [#17](https://github.com/jeroen-meijer/pubspec-assist/issues/17))
- Ability to add `dev_dependencies`.

### Changed

- Changed "Add dependency" to "Add/update dependency" to better represent actual behavior.
- Improved and enforced formatting rules.
- Upgrade dependency versions for security reasons (again).

## 1.0.1 - 2020-04-23

### Changed

- Improved and updated README.md

## 1.0.2 - 2020-04-23

### Fixed

- Fixed bug where the opened file would be formatted even if the `pubspec.yaml` isn't opened.

## 1.0.3 - 2020-05-08

### Changed

- Changed status bar message icon to spinning sync icon.
- Removed console logs.

## 2.0.0 - 2020-08-06

### Changed

- **BREAKING**: Replaced old "text parser" with a proper implementation that uses the `yaml` package.
- Added option for using the legacy text parser.
- Added option for disabling the caret (`^`) for dependencies.
- Filtered `dart:...` packages from search results.
- Improved and updated README.md
- Upgrade dependency versions for security reasons (again again).

## 2.1.0 - 2020-10-05

### Changed

- Added command that sorts all `dependencies` and `dev_dependencies`.
- Added option to sorts all `dependencies` and `dev_dependencies` automatically when running an import (turned on by default). (Thanks [@JCKodel](https://github.com/JCKodel) for feature request [#19](https://github.com/jeroen-meijer/pubspec-assist/issues/19)!)
- Removed old text parser.

### Fixed

- Fixed several bugs where the extension would crash when adding dependencies to an empty pubspec or empty `(dev_)dependencies`. (Thank you to [@cverdes](https://github.com/cverdes) for [#56](https://github.com/jeroen-meijer/pubspec-assist/issues/56), [@JCKodel](https://github.com/JCKodel) for [#54](https://github.com/jeroen-meijer/pubspec-assist/issues/54), [@simphotonics](https://github.com/simphotonics) for [#49](https://github.com/jeroen-meijer/pubspec-assist/issues/49) and [@ernestsheldon](https://github.com/ernestsheldon) for [#47](https://github.com/jeroen-meijer/pubspec-assist/issues/47)!)

## 2.2.0 - 2020-10-06

### Added

- Functionality to add multiple packages in once query.

### Fixed

- Using the `autoAddPackage` option now automatically picks the first package that has the exact same name as the search query.

### Changed

- Turns out that recent changes have broken the comments functionality in most places. Whoops. The README now reflects this fact.

## 2.2.1 - 2020-10-06

### Changed

- Updated README with new demo video.
- Remove old roadmap item.
