# LD-207: A reader that does not exist takes the server down

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Marcus Lee (District IT technician) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (readers) |
| Labels | `api`, `errors`, `crash` |
| Sprint | LD Sprint 1 |
| Created | Mar 6, 2026 16:45 |

## Description

Twice this week the desk stopped working in the middle of the afternoon: every page stuck on "Loading…", for everyone, until I restarted the API.

I found the trigger. Rachel keeps a bookmark to the page of a student who changed schools; that reader was removed. When she opens the bookmark, the page stays on "Loading the reader…" and the API process **ends**. The log says:

```
Error: There is no such reader
    at loadReader (server/src/library.ts)
Node.js v26.12.1
```

and the process is gone. Every other request after that fails until someone starts the API again.

An unknown book does not do this: `/api/books/99999` answers 404 and the API keeps going.

## Steps to reproduce

In the VS Code terminal, with the app running:

```sh
curl -i http://localhost:3001/api/readers/99999
curl -i http://localhost:3001/api/readers/1
```

Or open `http://localhost:5173/readers/99999`.

## Expected result

- The first request answers **404** with `{"error": "There is no such reader"}`.
- The second answers **200** with Emma Johnson.
- The page says "There is no such reader".

## Actual result

The first request never answers, the API process ends, and the second fails to connect.

## Acceptance criteria

- [ ] An unknown reader answers 404 in JSON, and the API keeps answering.
- [ ] An id that is not a number still answers 400.
- [ ] A reader that exists is still answered as before.

## Environment

- LibraryDesk 1.0
- Node.js 26

## Activity

**Rachel Owens** · Mar 6, 2026 17:02
> Sorry! I did not know a bookmark could do that. It did happen right after I opened it, both times.
