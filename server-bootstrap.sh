#!/usr/bin/env bash
# ============================================================================
#  Brokerless Realty — fresh VPS bootstrap (run ONCE as root)
#
#  Prepares a brand-new Ubuntu 22.04/24.04 server for hosting:
#    • system updates + essential packages
#    • a non-root sudo user (with your SSH key copied over)
#    • UFW firewall (SSH + HTTP + HTTPS only)
#    • a swap file (prevents out-of-memory during Docker builds on small VPSes)
#    • Docker Engine + Compose plugin
#    • fail2ban + automatic security updates
#
#  Usage (as root on the VPS):
#     bash server-bootstrap.sh [username]
#     bash server-bootstrap.sh deploy
#
#  After it finishes, log in as the new user and deploy:
#     ssh <user>@<server-ip>
#     git clone https://github.com/NewLearner4848/brokerlessrealty.git
#     cd brokerlessrealty && ./deploy.sh
# ============================================================================
set -euo pipefail

DEPLOY_USER="${1:-deploy}"
SWAP_SIZE="${SWAP_SIZE:-2G}"

c_reset='\033[0m'; c_green='\033[0;32m'; c_yellow='\033[1;33m'; c_red='\033[0;31m'; c_blue='\033[0;34m'
info() { echo -e "${c_blue}[i]${c_reset} $*"; }
ok()   { echo -e "${c_green}[✓]${c_reset} $*"; }
warn() { echo -e "${c_yellow}[!]${c_reset} $*"; }
die()  { echo -e "${c_red}[✗]${c_reset} $*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "Run this as root:  sudo bash server-bootstrap.sh"
. /etc/os-release
info "Detected: ${PRETTY_NAME:-unknown}"
echo

# ---------------------------------------------------------------------------
# 1. System update + essential packages
# ---------------------------------------------------------------------------
info "Updating system and installing base packages..."
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y
apt-get install -y \
  ca-certificates curl gnupg git ufw fail2ban unattended-upgrades \
  apt-transport-https software-properties-common
ok "Base packages installed."

# ---------------------------------------------------------------------------
# 2. Non-root sudo user (+ copy SSH key from root)
# ---------------------------------------------------------------------------
if id "$DEPLOY_USER" >/dev/null 2>&1; then
  info "User '$DEPLOY_USER' already exists — skipping creation."
else
  info "Creating sudo user '$DEPLOY_USER'..."
  adduser --disabled-password --gecos "" "$DEPLOY_USER"
  usermod -aG sudo "$DEPLOY_USER"
  ok "User '$DEPLOY_USER' created and added to sudo."
fi

HAS_KEY=0
if [ -f /root/.ssh/authorized_keys ]; then
  info "Copying SSH authorized_keys from root to '$DEPLOY_USER'..."
  install -d -m 700 -o "$DEPLOY_USER" -g "$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"
  install -m 600 -o "$DEPLOY_USER" -g "$DEPLOY_USER" \
    /root/.ssh/authorized_keys "/home/$DEPLOY_USER/.ssh/authorized_keys"
  HAS_KEY=1
  ok "SSH key installed for '$DEPLOY_USER'."
else
  warn "No /root/.ssh/authorized_keys found (password login in use)."
  warn "Set a password for the new user so you can still log in:"
  echo -e "    ${c_yellow}passwd $DEPLOY_USER${c_reset}"
fi

# ---------------------------------------------------------------------------
# 3. Firewall (UFW) — allow SSH, HTTP, HTTPS; deny everything else inbound
# ---------------------------------------------------------------------------
info "Configuring UFW firewall..."
ufw --force reset >/dev/null
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH        # port 22
ufw allow 80/tcp         # HTTP  (Caddy / ACME challenge)
ufw allow 443/tcp        # HTTPS (Caddy)
ufw allow 443/udp        # HTTP/3
ufw --force enable
ok "Firewall active (22, 80, 443 open)."

# ---------------------------------------------------------------------------
# 4. Swap file (guards against OOM during npm ci / native builds)
# ---------------------------------------------------------------------------
if swapon --show | grep -q .; then
  info "Swap already present — skipping."
elif [ -f /swapfile ]; then
  info "/swapfile already exists — skipping."
else
  info "Creating ${SWAP_SIZE} swap file..."
  fallocate -l "$SWAP_SIZE" /swapfile || dd if=/dev/zero of=/swapfile bs=1M count=2048
  chmod 600 /swapfile
  mkswap /swapfile >/dev/null
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
  ok "${SWAP_SIZE} swap enabled."
fi

# ---------------------------------------------------------------------------
# 5. Docker Engine + Compose plugin
# ---------------------------------------------------------------------------
if command -v docker >/dev/null 2>&1; then
  info "Docker already installed — skipping."
else
  info "Installing Docker Engine + Compose plugin..."
  install -m 0755 -d /etc/apt/keyrings
  curl -fsSL "https://download.docker.com/linux/${ID}/gpg" | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
  chmod a+r /etc/apt/keyrings/docker.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/${ID} ${VERSION_CODENAME} stable" \
    > /etc/apt/sources.list.d/docker.list
  apt-get update -y
  apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  systemctl enable --now docker
  ok "Docker installed."
fi
info "Adding '$DEPLOY_USER' to the docker group..."
usermod -aG docker "$DEPLOY_USER"

# ---------------------------------------------------------------------------
# 6. fail2ban + automatic security updates
# ---------------------------------------------------------------------------
info "Enabling fail2ban and unattended security upgrades..."
systemctl enable --now fail2ban >/dev/null 2>&1 || true
dpkg-reconfigure -f noninteractive unattended-upgrades >/dev/null 2>&1 || true
ok "Hardening basics enabled."

# ---------------------------------------------------------------------------
# Done
# ---------------------------------------------------------------------------
echo
ok "Server bootstrap complete!"
echo
echo "───────────────────────────────────────────────────────────────"
echo " Next steps:"
echo "───────────────────────────────────────────────────────────────"
if [ "$HAS_KEY" -eq 1 ]; then
  echo "  1. Open a NEW terminal and log in as the deploy user:"
  echo -e "        ${c_yellow}ssh ${DEPLOY_USER}@<server-ip>${c_reset}"
else
  echo -e "  1. Set a password first:  ${c_yellow}passwd ${DEPLOY_USER}${c_reset}"
  echo -e "     then log in:            ${c_yellow}ssh ${DEPLOY_USER}@<server-ip>${c_reset}"
fi
echo "  2. Clone and deploy:"
echo -e "        ${c_yellow}git clone https://github.com/NewLearner4848/brokerlessrealty.git${c_reset}"
echo -e "        ${c_yellow}cd brokerlessrealty && ./deploy.sh${c_reset}"
echo "  3. Edit the .env files when prompted, then run ./deploy.sh again."
echo
warn "Optional SSH hardening (only AFTER you confirm key login works as"
warn "'${DEPLOY_USER}' — otherwise you can lock yourself out):"
echo    "     sudo sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config"
echo    "     sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config"
echo    "     sudo systemctl restart ssh"
echo "───────────────────────────────────────────────────────────────"
