#!/bin/bash
set -e

echo "🚀 Setting up CAD Viewer development environment..."

# Navigate to workspace
cd /workspace

# Clone Nextcloud server if not exists
if [ ! -d "server" ]; then
    echo "📦 Cloning Nextcloud server..."
    git clone --depth 1 https://github.com/nextcloud/server.git
fi

# Clone CAD Viewer app if not exists in apps
if [ ! -d "server/apps/cad_viewer" ]; then
    echo "📦 Linking CAD Viewer app..."
    ln -s /workspace/project/nextcloud-cad-viewer /workspace/server/apps/cad_viewer
fi

# Install dependencies
cd /workspace/server
echo "📦 Installing Nextcloud dependencies..."
composer install --no-dev --optimize-autoloader

# Build CAD Viewer app
cd /workspace/project/nextcloud-cad-viewer
echo "📦 Building CAD Viewer app..."
pnpm install --frozen-lockfile
pnpm build

# Create data directory
mkdir -p /workspace/server/data

# Set up Nextcloud
cd /workspace/server
if [ ! -f "config/config.php" ]; then
    echo "🔧 Configuring Nextcloud..."
    cp config/config.sample.php config/config.php
    
    # Update config for SQLite and dev mode
    cat >> config/config.php << 'EOF'

// CAD Viewer development settings
'debug' => true,
'log_level' => 0,
'singleuser' => true,
EOF
fi

echo "✅ Setup complete!"
echo ""
echo "🌐 To start Nextcloud:"
echo "   cd /workspace/server && php -S 0.0.0.0:8080"
echo ""
echo "📂 To open CAD Viewer:"
echo "   http://localhost:8080/apps/cad_viewer"
echo ""
echo "🔧 Or use the port forwarding in Codespaces"
