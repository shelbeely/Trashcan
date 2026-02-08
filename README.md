# Trashcan 🦝

A single-binary CLI hosting panel for Bun+Next.js applications with Docker and Caddy.

## 🌟 Features

- **🦝 Raccoon** - Single-binary CLI with intuitive commands
- **🦡 Opossum** - Easy site deployment and management  
- **🦡 Badger** - Automatic Caddy reverse proxy with Let's Encrypt SSL
- **🐦 Seagull** - Log viewing and monitoring
- **🐀 Rat** - Health checks and uptime monitoring
- **🦅 Crow** - Automated backups with retention
- **🦊 Fox** - AI-powered diagnostics (OpenRouter integration)
- **🦨 Skunk** - SSL certificate management

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose installed
- Bun runtime

### Installation

```bash
# Clone the repository
git clone https://github.com/shelbeely/Trashcan.git
cd Trashcan

# Run the CLI
bun run src/cli/index.ts help
```

### Initialize Trashcan

```bash
# Initialize with your email for Let's Encrypt
bun run src/cli/index.ts init your@email.com
```

### Deploy Your First Site

```bash
# Deploy a Next.js site
bun run src/cli/index.ts deploy \
  --name my-site \
  --domain mysite.com \
  --git https://github.com/user/nextjs-app.git
```

## 📚 Commands

### Core Commands

- `init [email]` - Initialize Trashcan on your system
- `deploy` - Deploy a new Next.js site
- `list` - List all deployed sites
- `start <name>` - Start a stopped site
- `stop <name>` - Stop a running site
- `restart <name>` - Restart a site
- `remove <name>` - Remove a site
- `info <name>` - Show detailed site information
- `version` - Show Trashcan version
- `help [command]` - Show help information

### Deploy Options

```bash
trashcan deploy \
  --name <site-name> \
  --domain <domain.com> \
  [--aliases alias1.com,alias2.com] \
  [--port 3000] \
  [--git <repo-url>] \
  [--branch main] \
  [--env '{"KEY":"value"}']
```

## 🏗️ Architecture

### Directory Structure

```
~/.trashcan/
├── config.json              # Global configuration
├── data/                    # JSON database files
│   ├── sites.json
│   ├── backups.json
│   └── health-checks.json
├── sites/                   # Site-specific directories
│   └── [site-name]/
│       ├── docker-compose.yml
│       ├── .env
│       ├── source/          # Application code
│       └── data/            # Persistent data
├── backups/                 # Backup storage
│   └── [site-name]/
├── logs/                    # Log files
└── caddy/                   # Reverse proxy
    ├── Caddyfile
    └── docker-compose.yml
```

### Technology Stack

- **Runtime**: Bun (TypeScript)
- **Containerization**: Docker + Docker Compose
- **Reverse Proxy**: Caddy (automatic HTTPS)
- **Database**: JSON-based storage
- **AI**: OpenRouter API integration

## 🎨 Trash-Animal Naming System

All components use memorable trash-animal names:

- 🦝 **Raccoon** - Main CLI (master scavenger)
- 🦡 **Opossum** - Site deployment (resilient)
- 🐦 **Seagull** - Log viewer (always watching)
- 🐀 **Rat** - Health checks (survivors)
- 🦊 **Fox** - AI assistant (clever)
- 🦨 **Skunk** - Security/SSL (protective)
- 🦡 **Badger** - Reverse proxy (persistent)
- 🦅 **Crow** - Backups (collectors)

## 🔒 Security

- Automatic HTTPS via Let's Encrypt
- Isolated Docker containers per site
- Secure environment variable storage
- Dedicated Docker network for internal communication

## 📖 Documentation

See [SPEC.md](SPEC.md) for complete specification including:
- Detailed UX/UI design
- Complete data models
- Architecture diagrams
- API documentation
- Development roadmap

## 🛠️ Development

```bash
# Run in development mode
bun run dev

# Build single binary
bun run build

# The binary will be in dist/trashcan
./dist/trashcan help
```

## 📝 License

MIT

## 🙏 Credits

Built with:
- [Bun](https://bun.sh/) - Fast JavaScript runtime
- [Docker](https://www.docker.com/) - Containerization
- [Caddy](https://caddyserver.com/) - Reverse proxy with automatic HTTPS
- [OpenRouter](https://openrouter.ai/) - AI API gateway
