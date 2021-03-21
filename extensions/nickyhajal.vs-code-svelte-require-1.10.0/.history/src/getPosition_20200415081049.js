const isRequire = require("./isRequire")
const {
  isNamedImport,
  isEndOfBlockComment,
  isStartOfBlockComment,
  isNamedImportEnd,
  isLocalNamedImportEnd,
  isStyleRequire,
  isLocalRequire,
  isCommentOrEmpty,
  isShebang,
} = require("./lineUtils")

module.exports = function(codeBlock, placeWithExternals) {
  let candidate = 0
  let candidateBeforeNamedImport = 0
  let findingNamedImportEnd = false
  let findingBlockCommentEnd = false
  let importOrRequireHit = false
  let foundScripts = false

  for (let i = 0; i < codeBlock.length; i++) {
    const line = codeBlock[i].trim()
    console.log(line)
    if (!foundScripts) {
      console.log(1)
      candidate = i + 1
      if (line.includes("<script>")) {
        foundScripts = true
      }
    } else if (findingNamedImportEnd) {
      console.log(2)
      if (isNamedImportEnd(line)) {
        if (isLocalNamedImportEnd(line) && placeWithExternals) {
          return candidateBeforeNamedImport
        }
        findingNamedImportEnd = false
      }
      candidate = i + 1
    } else if (findingBlockCommentEnd) {
      console.log(3)
      if (isEndOfBlockComment(line)) findingBlockCommentEnd = false
      candidate = i + 1
    } else if (isStartOfBlockComment(line) && !isEndOfBlockComment(line)) {
      console.log(4)
      // if a block comment is found below the require/import statements
      if (importOrRequireHit) break
      findingBlockCommentEnd = true
      candidate = i + 1
    } else if (isStartOfBlockComment(line) && isEndOfBlockComment(line)) {
      console.log(5)
      candidate = i + 1
    } else if (isShebang(line)) {
      candidate = i + 1
    } else if (
      isRequire(line) &&
      (!placeWithExternals || (placeWithExternals && !isLocalRequire(line)))
    ) {
      console.log(6)
      // require/imports should come before style imports
      if (isStyleRequire(line)) break
      else if (isNamedImport(line) && !isNamedImportEnd(line)) {
        findingNamedImportEnd = true
        candidateBeforeNamedImport = i
      } else candidate = i + 1
      importOrRequireHit = true
    } else if (!isCommentOrEmpty(line)) {
      console.log(7)
      break
    }
  }
  return candidate
}
