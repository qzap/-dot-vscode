const config = require("./config.json");
const fs = require("fs");

const theme = generate(config);

fs.writeFile(
  `../themes/${config.themeName}-color-theme.json`,
  JSON.stringify(theme),
  (err) => {
    if (err) {
      console.log(err);
    }
    console.log("Theme built!");
  }
);

function generate({
  editorBackground,
  editorForeground,
  activityBarBadgeBackground,
  sideBarTitleForeground,
  commentFontStyle,
  commentForeground,
  constantOtherColor,
  invalidColor,
  keywordStorageColor,
  operatorMiscColor,
  tagColor,
  functionColor,
  numConstArgColor,
  stringSymbolColor,
  classSupportColor,
  entityTypesColor,
  urlFontStyle,
  jsonKeyLevel4,
  markdownRawInlinePunctuation,
  markdownFenced,
}) {
  return {
    name: "Svelte Dark",
    type: "dark",
    colors: {
      "editor.background": editorBackground,
      "editor.foreground": editorForeground,
      "activityBarBadge.background": activityBarBadgeBackground,
      "sideBarTitle.foreground": sideBarTitleForeground,
    },
    tokenColors: [
      {
        name: "Comment",
        scope: ["comment", "punctuation.definition.comment"],
        settings: {
          fontStyle: commentFontStyle,
          foreground: commentForeground,
        },
      },
      {
        name: "Variables",
        scope: ["variable", "string constant.other.placeholder"],
        settings: {
          foreground: editorForeground,
        },
      },
      {
        name: "Colors",
        scope: ["constant.other.color"],
        settings: {
          foreground: constantOtherColor,
        },
      },
      {
        name: "Invalid",
        scope: ["invalid", "invalid.illegal"],
        settings: {
          foreground: invalidColor,
        },
      },
      {
        name: "Keyword, Storage",
        scope: ["keyword", "storage.type", "storage.modifier"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "Operator, Misc",
        scope: [
          "keyword.control",
          "constant.other.color",
          "punctuation",
          "meta.tag",
          "punctuation.definition.tag",
          "punctuation.separator.inheritance.php",
          "punctuation.definition.tag.html",
          "punctuation.definition.tag.begin.html",
          "punctuation.definition.tag.end.html",
          "punctuation.section.embedded",
          "keyword.other.template",
          "keyword.other.substitution",
        ],
        settings: {
          foreground: operatorMiscColor,
        },
      },
      {
        name: "Tag",
        scope: [
          "entity.name.tag",
          "meta.tag.sgml",
          "markup.deleted.git_gutter",
        ],
        settings: {
          foreground: tagColor,
        },
      },
      {
        name: "Function, Special Method",
        scope: [
          "entity.name.function",
          "meta.function-call",
          "variable.function",
          "support.function",
          "keyword.other.special-method",
        ],
        settings: {
          foreground: functionColor,
        },
      },
      {
        name: "Block Level Variables",
        scope: ["meta.block variable.other"],
        settings: {
          foreground: tagColor,
        },
      },
      {
        name: "Other Variable, String Link",
        scope: ["support.other.variable", "string.other.link"],
        settings: {
          foreground: tagColor,
        },
      },
      {
        name: "Number, Constant, Function Argument, Tag Attribute, Embedded",
        scope: [
          "constant.numeric",
          "constant.language",
          "support.constant",
          "constant.character",
          "constant.escape",
          "variable.parameter",
          "keyword.other.unit",
          "keyword.other",
        ],
        settings: {
          foreground: numConstArgColor,
        },
      },
      {
        name: "String, Symbols, Inherited Class, Markup Heading",
        scope: [
          "string",
          "constant.other.symbol",
          "constant.other.key",
          "entity.other.inherited-class",
          "markup.heading",
          "markup.inserted.git_gutter",
          "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js",
        ],
        settings: {
          foreground: stringSymbolColor,
        },
      },
      {
        name: "Class, Support",
        scope: [
          "entity.name",
          "support.type",
          "support.class",
          "support.orther.namespace.use.php",
          "meta.use.php",
          "support.other.namespace.php",
          "markup.changed.git_gutter",
          "support.type.sys-types",
        ],
        settings: {
          foreground: classSupportColor,
        },
      },
      {
        name: "Entity Types",
        scope: ["support.type"],
        settings: {
          foreground: entityTypesColor,
        },
      },
      {
        name: "CSS Class and Support",
        scope: [
          "source.css support.type.property-name",
          "source.sass support.type.property-name",
          "source.scss support.type.property-name",
          "source.less support.type.property-name",
          "source.stylus support.type.property-name",
          "source.postcss support.type.property-name",
        ],
        settings: {
          foreground: entityTypesColor,
        },
      },
      {
        name: "Sub-methods",
        scope: [
          "entity.name.module.js",
          "variable.import.parameter.js",
          "variable.other.class.js",
        ],
        settings: {
          foreground: invalidColor,
        },
      },
      {
        name: "Language methods",
        scope: ["variable.language"],
        settings: {
          fontStyle: commentFontStyle,
          foreground: invalidColor,
        },
      },
      {
        name: "entity.name.method.js",
        scope: ["entity.name.method.js"],
        settings: {
          fontStyle: commentFontStyle,
          foreground: functionColor,
        },
      },
      {
        name: "meta.method.js",
        scope: [
          "meta.class-method.js entity.name.function.js",
          "variable.function.constructor",
        ],
        settings: {
          foreground: functionColor,
        },
      },
      {
        name: "Attributes",
        scope: ["entity.other.attribute-name"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "HTML Attributes",
        scope: [
          "text.html.basic entity.other.attribute-name.html",
          "text.html.basic entity.other.attribute-name",
        ],
        settings: {
          fontStyle: commentFontStyle,
          foreground: classSupportColor,
        },
      },
      {
        name: "CSS Classes",
        scope: ["entity.other.attribute-name.class"],
        settings: {
          foreground: classSupportColor,
        },
      },
      {
        name: "CSS ID's",
        scope: ["source.sass keyword.control"],
        settings: {
          foreground: functionColor,
        },
      },
      {
        name: "Inserted",
        scope: ["markup.inserted"],
        settings: {
          foreground: stringSymbolColor,
        },
      },
      {
        name: "Deleted",
        scope: ["markup.deleted"],
        settings: {
          foreground: invalidColor,
        },
      },
      {
        name: "Changed",
        scope: ["markup.changed"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "Regular Expressions",
        scope: ["string.regexp"],
        settings: {
          foreground: operatorMiscColor,
        },
      },
      {
        name: "Escape Characters",
        scope: ["constant.character.escape"],
        settings: {
          foreground: operatorMiscColor,
        },
      },
      {
        name: "URL",
        scope: ["*url*", "*link*", "*uri*"],
        settings: {
          fontStyle: urlFontStyle,
        },
      },
      {
        name: "Decorators",
        scope: [
          "tag.decorator.js entity.name.tag.js",
          "tag.decorator.js punctuation.definition.tag.js",
        ],
        settings: {
          fontStyle: commentFontStyle,
          foreground: functionColor,
        },
      },
      {
        name: "ES7 Bind Operator",
        scope: [
          "source.js constant.other.object.key.js string.unquoted.label.js",
        ],
        settings: {
          fontStyle: commentFontStyle,
          foreground: invalidColor,
        },
      },
      {
        name: "JSON Key - Level 0",
        scope: [
          "source.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "JSON Key - Level 1",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: classSupportColor,
        },
      },
      {
        name: "JSON Key - Level 2",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: numConstArgColor,
        },
      },
      {
        name: "JSON Key - Level 3",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: invalidColor,
        },
      },
      {
        name: "JSON Key - Level 4",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: jsonKeyLevel4,
        },
      },
      {
        name: "JSON Key - Level 5",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: functionColor,
        },
      },
      {
        name: "JSON Key - Level 6",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: tagColor,
        },
      },
      {
        name: "JSON Key - Level 7",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "JSON Key - Level 8",
        scope: [
          "source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json",
        ],
        settings: {
          foreground: stringSymbolColor,
        },
      },
      {
        name: "Markdown - Plain",
        scope: [
          "text.html.markdown",
          "punctuation.definition.list_item.markdown",
        ],
        settings: {
          foreground: editorForeground,
        },
      },
      {
        name: "Markdown - Markup Raw Inline",
        scope: ["text.html.markdown markup.inline.raw.markdown"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "Markdown - Markup Raw Inline Punctuation",
        scope: [
          "text.html.markdown markup.inline.raw.markdown punctuation.definition.raw.markdown",
        ],
        settings: {
          foreground: markdownRawInlinePunctuation,
        },
      },
      {
        name: "Markdown - Heading",
        scope: [
          "markdown.heading",
          "markup.heading | markup.heading entity.name",
          "markup.heading.markdown punctuation.definition.heading.markdown",
        ],
        settings: {
          foreground: stringSymbolColor,
        },
      },
      {
        name: "Markup - Italic",
        scope: ["markup.italic"],
        settings: {
          fontStyle: commentFontStyle,
          foreground: tagColor,
        },
      },
      {
        name: "Markup - Bold",
        scope: ["markup.bold", "markup.bold string"],
        settings: {
          fontStyle: "bold",
          foreground: tagColor,
        },
      },
      {
        name: "Markup - Bold-Italic",
        scope: [
          "markup.bold markup.italic",
          "markup.italic markup.bold",
          "markup.quote markup.bold",
          "markup.bold markup.italic string",
          "markup.italic markup.bold string",
          "markup.quote markup.bold string",
        ],
        settings: {
          fontStyle: "bold",
          foreground: tagColor,
        },
      },
      {
        name: "Markup - Underline",
        scope: ["markup.underline"],
        settings: {
          fontStyle: urlFontStyle,
          foreground: numConstArgColor,
        },
      },
      {
        name: "Markdown - Blockquote",
        scope: ["markup.quote punctuation.definition.blockquote.markdown"],
        settings: {
          foreground: markdownRawInlinePunctuation,
        },
      },
      {
        name: "Markup - Quote",
        scope: ["markup.quote"],
        settings: {
          fontStyle: commentFontStyle,
        },
      },
      {
        name: "Markdown - Link",
        scope: ["string.other.link.title.markdown"],
        settings: {
          foreground: functionColor,
        },
      },
      {
        name: "Markdown - Link Description",
        scope: ["string.other.link.description.title.markdown"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "Markdown - Link Anchor",
        scope: ["constant.other.reference.link.markdown"],
        settings: {
          foreground: classSupportColor,
        },
      },
      {
        name: "Markup - Raw Block",
        scope: ["markup.raw.block"],
        settings: {
          foreground: keywordStorageColor,
        },
      },
      {
        name: "Markdown - Raw Block Fenced",
        scope: ["markup.raw.block.fenced.markdown"],
        settings: {
          foreground: markdownFenced,
        },
      },
      {
        name: "Markdown - Fenced Bode Block",
        scope: ["punctuation.definition.fenced.markdown"],
        settings: {
          foreground: markdownFenced,
        },
      },
      {
        name: "Markdown - Fenced Bode Block Variable",
        scope: [
          "markup.raw.block.fenced.markdown",
          "variable.language.fenced.markdown",
          "punctuation.section.class.end",
        ],
        settings: {
          foreground: editorForeground,
        },
      },
      {
        name: "Markdown - Fenced Language",
        scope: ["variable.language.fenced.markdown"],
        settings: {
          foreground: markdownRawInlinePunctuation,
        },
      },
      {
        name: "Markdown - Separator",
        scope: ["meta.separator"],
        settings: {
          fontStyle: "bold",
          foreground: markdownRawInlinePunctuation,
        },
      },
      {
        name: "Markup - Table",
        scope: ["markup.table"],
        settings: {
          foreground: editorForeground,
        },
      },
    ],
  };
}
