# TODO

- přidat semantic release
  - vygenerovat changelog
  - updatovat npm
  - nahrát jako extension



##1.3.0
- [x] python - někdy to nebere závorky - z nějakého důvodu zůstane uvozovka u závorky a vezme zbytek řetězce jako string. Zkontrolovat, zda je na cursoru string a pokud ano, tak k tomu nějak přiřadit závorky (nedělám to už?). Někde to funguje a někde ne. Nevím proč - je to proto, že za tím je na řádku další string. Musím to nějak vyparsovat - zkontrolovat co je posledním prvkem tokenizedBeforeTextu - pokud string, tak vzít typ uvozovky a přilepit jí do afterTextu před tokenizací
  - mohu použít offsetAt a positionAt abych pos zkonvertoval na number offset a zpět - místo dbilního parsování lines
- [x] HTML - puncation - je to ale několik úrovní deep, nevím, zda to bude fungovat
- [ ] CSS support
- [ ] zvážit/prozkoumat parsování commentů tak, že odstraním comment token a zprasuji znovu string
  - Prism mi správně určí, že jsem v commentu - musím se vrátit na začátek commentu, odstranit comment tokeny, sparsovat daný kus kodu a hotovo

## v2.0
- new features
  - comments parsing
  - select to end/begining of b/q
  - one universal command to select closes - b or q
- written in TS
- tests
- works in MD as well

## Future
- [ ] Selection from cursor to opening/closing bracket/quote
- [ ] Cursor navigation to opening/closing brackets/quotes
- [ ] sestudovat testování funkcí - testy na funkce, další modularizace
- [ ] zkusit tam scope-info nebo vscode-textmate - co vrací, zda by to nešlo využít místo custom lang definice dodané z extension (textmate definice)
- [ ] migrace to TS (jakmile budu mít napsané testy), přeházet/upravit strukturu filů
- [ ] nastavit CI/CD, vyčistit repo a upravit ať to vypadá víc profi
  - [auto security fixes](https://help.github.com/en/articles/configuring-automated-security-fixes)
- [ ] markdown - it's mosty string, would have to parse MD completely differently than other languages for brackets
- [ ] možnost přidat vlastní lang definici přes settings (ať to nemusím releasovat já)
- [ ] pokud mám zadefinovanou pouze jednu závorku či uvozovku v nějakém jazyku. Tak přerušit swap command a vyhodit hlášku že pro jazyk je definován pouze jeden token
- [ ] Language specific settings for bracket/quotes types available for swapping
- [ ] Add settings to specify how large line offset should be used for quotes parsing (default is 8)
## parsování závorek
- [highlight all ocurenc of a symbol](https://code.visualstudio.com/api/language-extensions/programmatic-language-features#highlight-all-occurrences-of-a-symbol-in-a-document) - šlo by to znásilnit abych tak mohl vybrat odpovídající závorky/uvozovky - našel bych první otevírací token a k němu bych vzal první odpovídající uzavíratelný token?
- jde v extension vytáhnout definice párových tokenu? Abych nemusel dělat vlastní dlouhou definici něcoho co už existuje
- https://github.com/Microsoft/vscode-textmate
- https://marketplace.visualstudio.com/items?itemName=siegebell.scope-info
