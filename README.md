# Juma

Juma is a self-hosted web application for remote torrent downloads. Torrents are fetched and stored on the server so files can later be retrieved via regular HTTP downloads. It is built with **NestJS** for the API and **React** (Vite) for the frontend.

## Features

- Queue torrents and download them server‑side using WebTorrent
- Browse, create, copy and delete folders through a REST API
- Download individual files from completed torrents
- JWT based user authentication

## Running the project

### Environment variables

Copy `.env.dist` to `.env` and adjust values as needed:

```env
APP_NAME="my-juma"
MYSQL_ROOT_PASSWORD="juma"
MYSQL_DATABASE="juma"
MYSQL_USER="juma"
MYSQL_PASSWORD="juma"
JWT_SECRET="change-me"
TORRENTS_STORAGE_PATH="/path/on/host"
```

### Backend with Docker Compose

Use the provided `docker-compose.yml` to start the API server along with MySQL and Redis:

```bash
docker-compose up --build
```

The NestJS application listens on port **5000** inside the container and is exposed locally on **http://localhost:4000**.

### Frontend

Install dependencies and run the React development server:

```bash
cd frontend
npm install
npm run dev
```

Vite serves the UI on `http://localhost:5173` and expects the backend to be reachable on port `4000`.

### Combined development

The root `package.json` includes a helper command that launches both the backend (in watch mode) and the frontend:

```bash
npm run dev
```

## Directory structure

```
.
├── docker-compose.yml       # Docker services for backend, MySQL and Redis
├── Dockerfile               # Build instructions for the backend container
├── src/                     # NestJS application sources
│   ├── authContext/         # Authentication modules
│   ├── torrentContext/      # Torrent downloading logic
│   ├── fileExplorerContext/ # File management API
│   └── sharedKernel/        # Common configuration and utilities
├── frontend/                # React application (Vite)
└── test/                    # Unit and e2e tests
```

