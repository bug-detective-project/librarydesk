# LD-103: Enter in the author field sends the New book form

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | Medium |
| Reporter | Daniel Price (Library aide) |
| Track | Front-end |
| Affects version | 1.0 |
| Component | New book form |
| Labels | `client`, `form`, `keyboard` |
| Sprint | LD Sprint 1 |
| Created | Mar 6, 2026 10:20 |

## Description

When I add a book, I type the first letters of the author, move to the name with the arrow keys and press **Enter**, the way every search box works. The name goes into the field, and at the same moment the whole form is sent: red messages appear under **ISBN** and **Year**, which I had not filled yet.

If I had filled everything else first, the book is added with whatever is there, before I can check it. I added **East of Eden** twice yesterday because of this.

The same happens when I type a new author's name and press Enter to keep it.

## Steps to reproduce

1. Open **New book**.
2. In **Author**, type `Stein`, press **↓** to highlight **John Steinbeck**, and press **Enter**.

## Expected result

**John Steinbeck** is in the Author field, the list closes, and nothing else happens: the form is sent only by **Add book**.

## Actual result

The author is picked and the form is sent: messages appear under the empty fields (or the book is added, if they were filled).

## Acceptance criteria

- [ ] Enter in the Author field picks the highlighted author and does not send the form.
- [ ] Enter on a name that is not on the list keeps it as a new author and does not send the form.
- [ ] **Add book** still sends the form; Enter in the other fields still works as usual.

## Environment

- LibraryDesk 1.0
- Any browser

## Activity

**Rachel Owens** · Mar 6, 2026 10:41
> The arrow keys and Escape in that field work perfectly. It is only Enter.
