#!/usr/bin/env bash
# ============================================================================
#  Brokerless Realty — one-shot deployment script
#
#  Usage:
#     ./deploy.sh                 Build & (re)deploy the full stack
#     ./deploy.sh --install-docker  Install Docker Engine first (Ubuntu/Debian)
#     ./deploy.sh --build          Force a clean rebuild (no cache)
#     ./deploy.sh --down           Stop and remove the stack (keeps volumes)
#     ./deploy.sh --logs           Tail logs for all services
#     ./deploy.sh --status         Show container status
#     ./deploy.sh --help           Show this help
#
#  Run it from the project root on your VPS. On first run it will create the
#  .env files from the examples and pause so you can fill them in.
# ============================================================================
set -euo pipefail

# ---- pretty output -------------------------------------------------------
c_reset='\033[0m'; c_green='\033[0;32m'; c_yellow='\033[1;33m'; c_red='\033[0;31m'; c_blue='\033[0;34m'
info()  { echo -e "${c_blue}[i]${c_reset} $*"; }
ok()    { echo -e "${c_green}[✓]${c_reset} $*"; }
warn()  { echo -e "${c_yellow}[!]${c_reset} $*"; }
err()   { echo -e "${c_red}[✗]${c_reset} $*" >&2; }
die()   { err "$*"; exit 1; }

# ---- always operate from the project root --------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ---- resolve docker compose command --------------------------------------
compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
  else
    die "Docker Compose not found. Install Docker first: ./deploy.sh --install-docker"
  fi
}

# ---- install Docker on Ubuntu/Debian -------------------------------------
install_docker() {
  info "Installing Docker Engine + Compose plugin (Ubuntu/Debian)..."
  [ "$(id -u)" -eq 0 ] || die "Run with sudo for --install-docker:  sudo ./deploy.sh --install-docker"
  apt-get update
  apt-get install -y ca-certificates curl gnupg
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  . /etc/os-release
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  ok "Docker installed. You can now run: ./deploy.sh"
}

# ---- ensure env files exist ----------------------------------------------
ensure_env() {
  local created=0
  if [ ! -f .env ]; then
    cp .env.example .env
    warn "Created .env from .env.example — set your domains and ACME email."
    created=1
  fi
  if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    warn "Created backend/.env from example — set JWT_SECRET and SMTP creds."
    created=1
  fi
  if [ "$created" -eq 1 ]; then
    echo
    warn "Edit the .env files above, then re-run ./deploy.sh"
    echo -e "   ${c_yellow}nano .env${c_reset}          # domains, ACME_EMAIL, VITE_API_BASE_URL"
    echo -e "   ${c_yellow}nano backend/.env${c_reset}   # JWT_SECRET, SMTP_*"
    exit 0
  fi
}

# ---- pre-flight checks ----------------------------------------------------
preflight() {
  command -v docker >/dev/null 2>&1 || die "Docker not installed. Run: sudo ./deploy.sh --install-docker"
  docker info >/dev/null 2>&1 || die "Docker daemon not running (or needs sudo). Start it and retry."
  ok "Docker is available."
}

# ---- deploy ---------------------------------------------------------------
deploy() {
  local no_cache="${1:-}"
  preflight
  ensure_env

  info "Building images..."
  if [ "$no_cache" = "--no-cache" ]; then
    compose build --no-cache
  else
    compose build
  fi

  info "Starting the stack..."
  compose up -d --remove-orphans

  echo
  ok "Deployment complete."
  compose ps
  echo
  info "Certificates are provisioned automatically on first request."
  info "Watch progress with:  ./deploy.sh --logs"
}

# ---- argument handling ----------------------------------------------------
case "${1:-}" in
  --install-docker) install_docker ;;
  --build)          deploy --no-cache ;;
  --down)           info "Stopping stack (volumes preserved)..."; compose down; ok "Stopped." ;;
  --logs)           compose logs -f --tail=100 ;;
  --status)         compose ps ;;
  -h|--help)        sed -n '2,20p' "$0" | sed 's/^# \{0,1\}//' ;;
  "")               deploy ;;
  *)                die "Unknown option: $1  (try --help)" ;;
esac
