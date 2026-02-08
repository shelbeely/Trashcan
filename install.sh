#!/bin/bash
# Trashcan Installation Script

set -e

echo "🦝 Installing Trashcan..."

# Detect OS
OS="$(uname -s)"
ARCH="$(uname -m)"

# Check prerequisites
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "   Please install Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    echo "   Please install Docker Compose: https://docs.docker.com/compose/install/"
    exit 1
fi

# Download or build Trashcan
if [ -f "dist/trashcan" ]; then
    echo "✓ Found local build"
    BINARY="dist/trashcan"
else
    echo "❌ No binary found"
    echo "   Please build Trashcan first: bun run build"
    exit 1
fi

# Install to /usr/local/bin
INSTALL_DIR="/usr/local/bin"

if [ -w "$INSTALL_DIR" ]; then
    cp "$BINARY" "$INSTALL_DIR/trashcan"
    chmod +x "$INSTALL_DIR/trashcan"
else
    echo "Installing to $INSTALL_DIR requires sudo..."
    sudo cp "$BINARY" "$INSTALL_DIR/trashcan"
    sudo chmod +x "$INSTALL_DIR/trashcan"
fi

echo "✅ Trashcan installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Initialize Trashcan: trashcan init your@email.com"
echo "  2. Deploy your first site: trashcan deploy --name my-site --domain mysite.com"
echo "  3. View help: trashcan help"
echo ""
