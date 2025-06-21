# Juma

Juma is a web application that lets you download torrents on a remote server and fetch the files through normal HTTP. It can be used to work around network restrictions on peer‑to‑peer traffic and is inspired by services like seedr.cc.

The backend is written with **NestJS** and uses MySQL, Redis and WebTorrent. A small React/Vite front‑end is included in the `frontend/` directory.

## Features

- User registration and login with JWT authentication.
- Queue based torrent downloading using Bull and WebTorrent.
- File management helpers for creating, listing and deleting directories.
- MySQL database access via TypeORM migrations.
- Docker compose configuration for local development.

## Requirements

- Node.js LTS and npm
- Docker and Docker Compose

## Getting started

1. Copy `.env.dist` to `.env` and adjust the values (database credentials, `JWT_SECRET`, `TORRENTS_STORAGE_PATH`, etc.).
2. Install dependencies:

```bash
npm install
```

3. Start the stack with Docker Compose:

```bash
docker-compose up
```

The backend listens on `http://localhost:4000` and exposes a REST API under `/api`.
MySQL is available on port `3333` and Redis on `6379`.

For a local setup without Docker you can run the backend and front‑end together:

```bash
npm run dev
```

## Running tests

Tests use Jest and expect the environment defined in `.env.test`:

```bash
npm test
```

You may need to run `npm install` first if the dependencies are missing.

## Project layout

```
src/
  authContext/         Authentication logic
  torrentContext/      Torrent entities and use cases
  fileExplorerContext/ File system helpers
  sharedKernel/        Common config, migrations and exceptions
frontend/              React/Vite front‑end
```

## License

This project is provided under the **UNLICENSED** license as defined in `package.json`.
