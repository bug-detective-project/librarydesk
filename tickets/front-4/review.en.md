# Code review: LD-104, the rule was there, one line skipped it

Sorting is easy; knowing **what** to compare is the part that belongs to the domain. Here is the reference approach, so you can compare it with yours.

## Why the bug happened

- A library files a title without its leading article. `filingTitle` encodes that rule, and the covers, the author order and the newest order all use it.
- The title order, the default one, compared the raw titles. So the one place where the rule matters most was the one place that skipped it.

## Why the reference fix is right

- The comparison uses the same `filingTitle` as the rest of the app, so the order on the screen and the letter on the cover agree.
- The card still shows the full title: only the key of the comparison changes.
- `Intl.Collator` stays: it compares letters the way people expect (case, accents), which a plain `<` does not.
- The regular expression wants a space after the article, so "Theo" and "Anatomy" are not cut.

## Compare with your fix

- Did you write a new regex in `sortBooks`? It works; now there are two copies of the rule to keep in step.
- Did you strip only "The"? "A Wrinkle in Time" stays first.
- Did you use `startsWith('The')`? "Theo and the Tide" would be filed as "o and the Tide".
- Did you change the titles in the database to "Giver, The"? That is how old card catalogs did it; the app shows titles as printed and sorts them by rule.
