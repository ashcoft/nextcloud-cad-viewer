#!/bin/bash

# Enable corepack to use pnpm (required for this project)
corepack enable

# Install frontend dependencies using pnpm
cd /workspace/project/nextcloud-cad-viewer && pnpm install