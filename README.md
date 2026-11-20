# LibraryDesk

The loans desk of the library of Maple Grove Middle School, a public school: the collection with its
copies, the readers (students and teachers), loans, renewals, reservations and fines. It is a game
project of [Bug Detective](https://github.com/bug-detective-project): this branch (`main`) is the
app with every bug fixed; the tickets players get are built from it (see the `qa` branch).

| Part      | Stack                                             |
| --------- | ------------------------------------------------- |
| `client/` | React, Vite, React Router, CSS Modules, Inter     |
| `server/` | Node.js, Express 5, Sequelize 6 (`mysql2` driver) |
| Database  | MySQL 8.4                                         |

## Running it

The app needs a MySQL database and reads its address from `DATABASE_URL`; nothing in the code knows
a fixed address. Inside Bug Detective the database is already there: the app starts it next to your
workspace and sets the variable.

```sh
npm ci
npm run db:reset   # create the tables and the sample library
npm run dev        # the desk on http://localhost:5173, the API on http://localhost:3001
```

Outside Bug Detective, start a MySQL 8.4 yourself and set `DATABASE_URL`, for example
`mysql://root:librarydesk@localhost:3306/librarydesk` (`services.json` has the settings the game
uses; MySQL's default server needs 512 MB of memory).

| Command                                   | What it does                                                                                             |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm run dev`                             | Starts the API and the client, both reloading on change                                                  |
| `npm run db:reset`                        | Empties the database and puts the sample library back                                                    |
| `npm test`                                | Runs every test (the server's tests use a database of their own, `librarydesk_test`, on the same server) |
| `npm run lint` / `npm run lint:fix`       | ESLint, which also formats the TypeScript files                                                          |
| `npm run format` / `npm run format:check` | Prettier, for every other file                                                                           |

`LIBRARYDESK_TODAY` (`YYYY-MM-DD`) and `LIBRARYDESK_TIME` (`HH:MM`) fix the library's day and time,
so the due dates and the fines are always the same; the QA sets the day to Monday, 2026-03-09.

## Looking at the data

```sh
mysql "$DATABASE_URL"
```

In VS Code, the SQLTools extension and its MySQL driver (recommended by this project) connect to
the same address.

## How it is organized

- **A book has copies.** A loan, a return and a renewal are always of one copy, labelled on its
  spine (`B005-2`). How many copies are in comes from the open loans; nothing keeps it in a column.
- **The desk's rules** live in `server/src/library.ts`: a loan lasts 14 days; a reader renews up to
  twice, while the loan is not overdue and nobody waits for the book; a reader who owes fines takes
  no new book; a reservation puts a copy aside when one is in, or a place in the queue when not.
- **Days and moments.** Due dates are days in the school's time zone, New York, daylight saving
  time included (`server/src/clock.ts`); returns are moments. A copy is late from the day after its
  due day.
- **Fines** are 25 cents a day (`server/src/fines.ts`), charged when the copy comes back and kept
  as `DECIMAL(8,2)`. The `mysql2` driver gives a `DECIMAL` back as text, so the API sends a fine as
  text too (`"0.75"`), and the client turns it into a number before adding (`client/src/format.ts`).
- **ISBN-13** is typed with or without dashes; the server keeps the 13 digits and checks the check
  digit (`server/src/isbn.ts`). The form masks the field (`client/src/masks.ts`).
- **The collection sorts by the filing rule of library catalogs**: a title is filed without its
  leading article, so "The Giver" goes under G (`client/src/collection.ts`).
- **The client asks the server which day it is** (`GET /api/today`, `client/src/TodayContext.tsx`)
  and counts due dates from it, never from the computer's clock.
- **The API** (`server/src/routes/`) answers only `localhost` and `127.0.0.1`. Express 5 hands what
  an async route throws to the error handler of `server/src/app.ts`, which answers in JSON and logs
  only what nobody planned for.
- **The tables** are the models of `server/src/models.ts`; `npm run db:reset` creates them from
  there. After a change to a model, reset the database.

## License

[PolyForm Noncommercial 1.0.0](LICENSE).
