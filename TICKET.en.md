# LD-104: Sorting by title puts "The Giver" under T

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Low |
| Reporter | Rachel Owens (School librarian) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | Collection |
| Labels | `client`, `sort`, `catalog` |
| Sprint | LD Sprint 1 |
| Created | Mar 3, 2026 08:50 |

## Description

The collection sorted by **Title** files every "The …" book together near the end, under T: **The Giver**, **The Grapes of Wrath**, **The Great Gatsby**, **The Outsiders**. And **A Wrinkle in Time** comes first of all, under A.

That is not how a library files titles. Every catalog, and our shelves, ignore a leading "The", "A" or "An": **The Giver** goes under G, between **Fahrenheit 451** and **Hatchet**, and **A Wrinkle in Time** under W, at the end. The students look for books the way the shelves are labeled, and they do not find them on the screen.

## Steps to reproduce

Open the collection (it opens sorted by **Title**).

## Expected result

Bridge to Terabithia, Charlotte's Web, Fahrenheit 451, **The Giver**, **The Grapes of Wrath**, **The Great Gatsby**, Hatchet, Holes, Number the Stars, Of Mice and Men, **The Outsiders**, Reading Steinbeck, To Kill a Mockingbird, Wonder, **A Wrinkle in Time**: each title filed under the word after its article.

## Actual result

**A Wrinkle in Time** first, and the four "The" titles together under T.

## Acceptance criteria

- [ ] Sorting by title ignores a leading "The", "A" or "An".
- [ ] Words that only start like an article ("Theo", "Anatomy") are filed as they are.
- [ ] The title still shows complete on the card; only the order changes.
- [ ] Sorting by author and by newest do not change.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Daniel Price** · Mar 3, 2026 09:12
> The little letter on the covers already does it right: The Giver has a "G". So the rule is in the code somewhere.
