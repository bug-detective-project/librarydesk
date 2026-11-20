# LD-202: The same copy was lent to two readers

| Field | Value |
| --- | --- |
| Project | LibraryDesk (LD) |
| Issue type | Bug |
| Status | To Do |
| Priority | High |
| Reporter | Daniel Price (Library aide) |
| Track | Back-end |
| Affects version | 1.0 |
| Component | API (loans) |
| Labels | `api`, `loans`, `rules` |
| Sprint | LD Sprint 1 |
| Created | Mar 3, 2026 14:10 |

## Description

We have two computers at the desk. On Tuesday, **To Kill a Mockingbird** copy **B001-1** came back from Emma at the first one, and I lent it to Liam right away. A few minutes later, at the second computer, Rachel lent **B001-1** to Olivia; that page had been open since before Liam took it. The desk said yes.

Now the system says both Liam and Olivia have B001-1, and there is one book. The page of the book shows only one of them, so it took us a while to see it.

The desk refuses a copy that is out, I have seen it do it. It just does not refuse this one.

## Steps to reproduce

In the VS Code terminal, with the app running (loan 1 is Emma's B001-1; readers 2 and 3 are Liam and Olivia):

```sh
curl -X POST http://localhost:3001/api/loans/1/return
curl -X POST http://localhost:3001/api/loans -H 'Content-Type: application/json' -d '{"copyId": 1, "readerId": 2}'
curl -X POST http://localhost:3001/api/loans -H 'Content-Type: application/json' -d '{"copyId": 1, "readerId": 3}'
```

## Expected result

The third request answers **409** with `{"error": "Copy B001-1 is already on loan"}`, and only Liam has B001-1.

## Actual result

The third request answers **201**: Olivia has B001-1 too.

## Acceptance criteria

- [ ] A copy that is out is refused to anyone else, also after it came back and went out again.
- [ ] A copy on the shelf is still lent.
- [ ] A copy that came back can be lent again.

## Environment

- LibraryDesk 1.0
- Any browser; also with curl

## Activity

**Rachel Owens** · Mar 3, 2026 14:31
> I tried it with a copy that had never been lent before, and the desk refused it the second time, as it should. It is the copies that already went out once.
