# 🚀 Brokerless Realty — VPS Deployment Guide

Deploy the full stack (React frontend + Express/SQLite backend) to a fresh VPS
using **Docker**, **Docker Compose**, and **Caddy** (automatic HTTPS).

---

## 1. Architecture

```
                        Internet (ports 80 / 443)
                                 │
                        ┌────────▼─────────┐
                        │   caddy (edge)   │  ← auto TLS via Let's Encrypt
                        │  reverse proxy   │
                        └───┬──────────┬───┘
        brokerlessrealty.com│          │backend.brokerlessrealty.com
                   ┌────────▼──┐   ┌───▼───────────┐
                   │ frontend  │   │   backend     │
                   │ (Caddy    │   │ Express API   │
                   │  static)  │   │ + SQLite      │
                   └───────────┘   └───┬───────┬───┘
                                       │       │
                            backend-data│       │backend-uploads
                             (SQLite DB)│       │(uploaded images)
                                   [ Docker named volumes ]
```

| Service    | Image                | Role                                             | Exposed |
|------------|----------------------|--------------------------------------------------|---------|
| `caddy`    | `caddy:2-alpine`     | Edge reverse proxy, terminates TLS for both domains | 80, 443 |
| `frontend` | built from `frontend/` | Serves the static Vite build (internal Caddy)   | internal 80 |
| `backend`  | built from `backend/`  | Express API + SQLite database                   | internal 3001 |

**Persistence:** the SQLite database and uploaded images live in Docker named
volumes (`backend-data`, `backend-uploads`), and TLS certificates in
`caddy-data` — so `docker compose down` / rebuilds never lose data.

> **Note:** the app uses **SQLite** (a file-based DB). The legacy MySQL variables
> in `.env` are unused and kept only for reference.

---

## 2. Prerequisites

- A VPS running **Ubuntu 22.04 / 24.04** (or Debian) with root/sudo access.
- Two DNS **A records** pointing at the VPS public IP:
  - `brokerlessrealty.com`  →  `<VPS_IP>`
  - `www.brokerlessrealty.com`  →  `<VPS_IP>`
  - `backend.brokerlessrealty.com`  →  `<VPS_IP>`
- Ports **80** and **443** open in the firewall / cloud security group.

> Caddy cannot issue certificates until DNS resolves to the server and 80/443
> are reachable. Set DNS up **before** deploying.

---

## 3. Fresh VPS? Run the bootstrap first

A brand-new server needs some one-time prep (non-root user, firewall, swap,
Docker). The included `server-bootstrap.sh` does all of it. **Run it once, as
root, on the VPS:**

```bash
# SSH into the fresh server as root, then:
curl -fsSL https://raw.githubusercontent.com/NewLearner4848/brokerlessrealty/main/server-bootstrap.sh -o server-bootstrap.sh
bash server-bootstrap.sh deploy      # "deploy" = the non-root user to create
```

It installs updates + Docker, creates a sudo user named `deploy` (copying your
SSH key from root), enables the UFW firewall (SSH/80/443 only), and adds a swap
file so Docker builds don't run out of memory on small VPSes.

When it finishes, **open a new terminal and log in as the new user** (so the
`docker` group applies), then continue with the Quick Start below:

```bash
ssh deploy@<server-ip>
```

> The bootstrap is idempotent — safe to re-run. It does **not** disable root/
> password SSH login automatically; harden that manually once you've confirmed
> key login works as `deploy` (commands printed at the end of the script).

---

## 4. Quick Start (TL;DR)

```bash
# As the deploy user on the VPS:
git clone https://github.com/NewLearner4848/brokerlessrealty.git
cd brokerlessrealty

# 1. First run creates .env files, then stops so you can edit them
#    (Docker is already installed by server-bootstrap.sh)
./deploy.sh
nano .env            # set domains + ACME_EMAIL + VITE_API_BASE_URL
nano backend/.env    # set JWT_SECRET + SMTP credentials

# 2. Deploy for real
./deploy.sh

# 3. Watch certificate issuance & startup
./deploy.sh --logs
```

Open **https://brokerlessrealty.com** — you're live. 🎉

> If you skipped the bootstrap (Docker not installed yet), run
> `sudo ./deploy.sh --install-docker` first.

---

## 5. Step-by-Step

### 5.1 Get the code onto the VPS

```bash
git clone https://github.com/NewLearner4848/brokerlessrealty.git
cd brokerlessrealty
```
(or `scp` / `rsync` the project directory up.)

### 5.2 Install Docker

If Docker isn't installed yet:

```bash
sudo ./deploy.sh --install-docker
```

This installs Docker Engine + the Compose plugin and enables the service.
To run Docker without `sudo`, add your user to the `docker` group and re-login:

```bash
sudo usermod -aG docker $USER && newgrp docker
```

### 5.3 Configure environment

The first `./deploy.sh` run copies the example env files and pauses.

**Root `.env`** (compose / Caddy / frontend build):

| Variable            | Description                                            |
|---------------------|--------------------------------------------------------|
| `FRONTEND_DOMAIN`   | Bare frontend domain, e.g. `brokerlessrealty.com`      |
| `BACKEND_DOMAIN`    | API domain, e.g. `backend.brokerlessrealty.com`        |
| `ACME_EMAIL`        | Email for Let's Encrypt expiry notices                 |
| `VITE_API_BASE_URL` | Public HTTPS URL of the backend (baked into frontend)  |

**`backend/.env`** (runtime secrets):

| Variable       | Description                                             |
|----------------|---------------------------------------------------------|
| `JWT_SECRET`   | Long random string for admin login tokens               |
| `SMTP_HOST/PORT/USER/PASS` | SMTP creds for outgoing email (contact/OTP) |
| `RECEIVER_EMAIL` | Where contact & inquiry notifications are sent        |
| `DB_PATH`      | Leave as `/app/data/brokerless.sqlite` (volume path)    |

Generate a strong JWT secret:

```bash
openssl rand -hex 32
```

### 5.4 Deploy

```bash
./deploy.sh
```

This builds the images and starts the stack in the background. Caddy requests
TLS certificates automatically on the first HTTPS request (allow ~30s).

---

## 6. `deploy.sh` Reference

| Command                        | What it does                                   |
|--------------------------------|------------------------------------------------|
| `./deploy.sh`                  | Build & (re)deploy the stack                    |
| `./deploy.sh --install-docker` | Install Docker Engine + Compose (Ubuntu/Debian) |
| `./deploy.sh --build`          | Force a clean rebuild (`--no-cache`)            |
| `./deploy.sh --down`           | Stop & remove containers (**keeps** volumes)    |
| `./deploy.sh --logs`           | Tail logs for all services                      |
| `./deploy.sh --status`         | Show container status                           |
| `./deploy.sh --help`           | Show usage                                      |

---

## 7. Day-2 Operations

**Redeploy after a code change** (e.g. `git pull`):
```bash
git pull
./deploy.sh          # rebuilds changed images and restarts
```

**View logs for one service:**
```bash
docker compose logs -f backend
docker compose logs -f caddy      # useful for TLS/ACME troubleshooting
```

**Restart a service:**
```bash
docker compose restart backend
```

### Admin login

Seeded on first run (⚠️ **change immediately** in the admin panel):

```
Username: admin
Password: admin_password123
```

### Backups

Everything important is in two volumes. Back them up with:

```bash
# SQLite database
docker run --rm -v brokerless_backend-data:/data -v "$PWD":/backup alpine \
  tar czf /backup/db-backup.tar.gz -C /data .

# Uploaded images
docker run --rm -v brokerless_backend-uploads:/data -v "$PWD":/backup alpine \
  tar czf /backup/uploads-backup.tar.gz -C /data .
```
Restore by extracting the tarball back into the same volume.

> Volume names are prefixed with the compose project name (the directory name,
> here `brokerless`). Check exact names with `docker volume ls`.

---

## 8. Troubleshooting

| Symptom | Cause / Fix |
|---------|-------------|
| Browser shows TLS error / "not secure" | DNS not pointing to the VPS yet, or ports 80/443 blocked. Verify with `dig +short brokerlessrealty.com` and check the firewall. Then `docker compose logs caddy`. |
| `502 Bad Gateway` on the API | Backend still starting or crashed. `docker compose logs backend`. |
| Frontend calls the wrong API URL | `VITE_API_BASE_URL` is baked at build time. Fix it in `.env` and run `./deploy.sh --build`. |
| Emails not sending | Check `SMTP_*` in `backend/.env`. For Gmail use an **App Password**, not your account password. |
| "too many certificates" from Let's Encrypt | You hit the rate limit while testing. Wait, or add `acme_ca https://acme-staging-v02.api.letsencrypt.org/directory` under the global block in `Caddyfile` while testing. |
| Changed `Caddyfile` not applied | It's bind-mounted; reload with `docker compose restart caddy`. |

---

## 9. Files Added for Deployment

```
├── server-bootstrap.sh       # Fresh-VPS prep: user, firewall, swap, Docker
├── Caddyfile                 # Edge reverse proxy + auto HTTPS (both domains)
├── docker-compose.yml        # Orchestrates backend + frontend + caddy
├── deploy.sh                 # One-shot deploy / manage script
├── .env.example              # Root compose config (copy to .env)
├── .gitignore
├── DEPLOYMENT.md             # This guide
├── backend/
│   ├── Dockerfile            # Node + SQLite (compiled from source)
│   ├── docker-entrypoint.sh  # Runs migrations + first-run seed
│   ├── .dockerignore
│   └── .env.example          # Backend secrets (copy to backend/.env)
└── frontend/
    ├── Dockerfile            # Vite build → static served by Caddy
    ├── Caddyfile             # Internal SPA static server
    └── .dockerignore
```
