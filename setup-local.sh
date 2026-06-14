#!/bin/bash
# Local Setup Script for CAD Viewer + Nextcloud
# Run this to test the app locally at http://localhost:8080

set -e

echo "🚀 CAD Viewer Local Setup"
echo "========================"

# Check prerequisites
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed"
    exit 1
fi

if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed"
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed"
    echo "   Install: npm install -g pnpm"
    exit 1
fi

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NC_DIR="${SCRIPT_DIR}/nextcloud-server"

# Clone Nextcloud if not exists
if [ ! -d "$NC_DIR" ]; then
    echo ""
    echo "📦 Cloning Nextcloud server..."
    git clone --depth 1 https://github.com/nextcloud/server.git "$NC_DIR"
fi

# Link CAD Viewer app
echo "🔗 Linking CAD Viewer app..."
rm -rf "$NC_DIR/apps/cad_viewer"
ln -sf "$SCRIPT_DIR" "$NC_DIR/apps/cad_viewer"

# Install Nextcloud dependencies
echo ""
echo "📦 Installing Nextcloud dependencies..."
cd "$NC_DIR"
composer install --no-dev --optimize-autoloader

# Install CAD Viewer dependencies
echo ""
echo "📦 Installing CAD Viewer dependencies..."
cd "$SCRIPT_DIR"
pnpm install --frozen-lockfile

# Build CAD Viewer
echo ""
echo "🔨 Building CAD Viewer..."
pnpm build

# Set up Nextcloud config
cd "$NC_DIR"
if [ ! -f "config/config.php" ]; then
    echo ""
    echo "🔧 Configuring Nextcloud..."
    cp config/config.sample.php config/config.php
    
    # Configure for local dev
    php -r "
    \$config = include 'config/config.php';
    \$config['debug'] = true;
    \$config['log_level'] = 0;
    \$config['singleuser'] = true;
    file_put_contents('config/config.php', '<?php' . PHP_EOL . '\$CONFIG = ' . var_export(\$config, true) . ';');
    "
fi

# Create data directory
mkdir -p "$NC_DIR/data"

echo ""
echo "========================"
echo "✅ Setup complete!"
echo ""
echo "🌐 Starting Nextcloud..."
echo ""
echo "   cd $NC_DIR"
echo "   php -S localhost:8080"
echo ""
echo "   Then open: http://localhost:8080"
echo ""
echo "   Login: admin / admin"
echo "   App: http://localhost:8080/apps/cad_viewer"
echo ""
