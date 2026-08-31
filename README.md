# Ledger — Expense Tracker

A simple, good-looking expense tracker built with React + Vite. Add income and
expense entries, see totals update live, and filter the list — all stored in
the browser (`localStorage`), no backend required.

## Features

- Add income / expense entries with description, amount, category, and date
- Live balance, income, and expense totals
- Filter entries by type
- Remove entries
- Data persists locally in the browser
- Responsive, ledger-book styled UI

## Run locally (Node)

```bash
npm install
npm run dev       # http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview   # http://localhost:4173
```

## Run with Docker

Build and run the container directly:

```bash
docker build -t expense-tracker .
docker run -d -p 8080:80 --name expense-tracker expense-tracker
```

Visit **http://localhost:8080**.

## Run with Docker Compose

```bash
docker compose up -d --build
```

Visit **http://localhost:8080**. Stop with `docker compose down`.

## CI/CD with Jenkins

A `Jenkinsfile` is included with a declarative pipeline:

1. **Checkout** — pulls the repo
2. **Install Dependencies** — `npm ci` in a `node:20-alpine` agent
3. **Build** — `npm run build` (Vite production build)
4. **Build Docker Image** — builds the multi-stage image
5. **Push Docker Image** — pushes to a registry (skipped if `REGISTRY` env var is empty)
6. **Deploy** — runs the container on the Jenkins host

### Set up in Jenkins

1. Create a new **Pipeline** job (or Multibranch Pipeline) pointed at this repo.
2. Make sure the Jenkins agent has **Docker** installed and the Jenkins user can
   run `docker` commands.
3. If you want to push images, add a Jenkins **Username/Password credential**
   (Docker registry login) and set its ID in `REGISTRY_CREDENTIALS_ID` in the
   `Jenkinsfile`, then set `REGISTRY` to your registry/namespace, e.g.
   `docker.io/yourusername`.
4. Run the pipeline. On success, the app is deployed on the Jenkins host at
   `http://<host>:8080`.

## Project structure

```
expense-tracker/
├── src/
│   ├── App.jsx        # App logic & UI
│   ├── index.css       # Styling
│   └── main.jsx        # React entry point
├── public/
│   └── coin.svg         # Favicon
├── index.html
├── vite.config.js
├── package.json
├── Dockerfile            # Multi-stage build (Node → nginx)
├── nginx.conf
├── docker-compose.yml
├── Jenkinsfile
├── .dockerignore
└── .gitignore
```

## Tech stack

- React 18 + Vite 5
- Plain CSS (no framework)
- nginx (production container serving)
- Docker / Docker Compose
- Jenkins declarative pipeline
