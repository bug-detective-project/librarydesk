# LD-203: Searching "Steinbeck" finds the title, not the author

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Rachel Owens (School librarian) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (search) |
| Labels | `api`, `search`, `sequelize` |
| Sprint | LD Sprint 1 |
| Created | Mar 4, 2026 10:05 |

## Description

The eighth grade reads Steinbeck this term, and the first thing every student does at the desk is ask for "a Steinbeck". So I type **Steinbeck** in the search box of the collection.

The only book that comes up is **Reading Steinbeck**, Dana Whitfield's guide, because the name is in its title. **Of Mice and Men** and **The Grapes of Wrath**, the books they actually want, do not show. Typing "Lowry" finds nothing at all, and we have two of hers.

The search box says "Title or author". Today it is only "Title".

## Steps to reproduce

Type `Steinbeck` in **Search the collection**. Or, in the VS Code terminal, with the app running:

```sh
curl 'http://localhost:3001/api/books?q=steinbeck'
curl 'http://localhost:3001/api/books?q=lowry'
```

## Expected result

- `q=steinbeck` answers **Of Mice and Men**, **The Grapes of Wrath** and **Reading Steinbeck**.
- `q=lowry` answers **The Giver** and **Number the Stars**.

## Actual result

- `q=steinbeck` answers only **Reading Steinbeck**.
- `q=lowry` answers `[]`.

## Acceptance criteria

- [ ] A search finds the books whose author's name has the text, in any case.
- [ ] A search still finds books by a piece of the title.
- [ ] A book whose title and author both match is listed once.

## Environment

- LibraryDesk 1.0
- Any browser; also with curl

## Activity

**Marcus Lee** · Mar 4, 2026 10:40
> Authors are a table of their own (`authors`), and each book points to one. The list of books already brings the author along, it is on every card.
