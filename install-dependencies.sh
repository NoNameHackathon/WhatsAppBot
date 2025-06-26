#!/bin/bash

# Script to install dependencies for Chromium/Puppeteer on Ubuntu/Debian systems
# This fixes the "libatk-1.0.so.0: cannot open shared object file" error

echo "Installing dependencies for Chromium/Puppeteer..."

# Update package list
sudo apt-get update

# Install Chromium and its dependencies
sudo apt-get install -y \
    chromium-browser \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    libxss1 \
    libxtst6 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    fonts-liberation \
    fonts-noto-color-emoji \
    fonts-noto-cjk \
    fonts-noto-cjk-extra

# Install additional development libraries (optional, for building)
echo "Installing development libraries (optional)..."
sudo apt-get install -y \
    libatk1.0-dev \
    libatk-bridge2.0-dev \
    libcups2-dev \
    libdrm-dev \
    libxkbcommon-dev \
    libxcomposite-dev \
    libxdamage-dev \
    libxfixes-dev \
    libxrandr-dev \
    libgbm-dev \
    libasound2-dev \
    libpango1.0-dev \
    libcairo2-dev \
    libatspi2.0-dev \
    libgtk-3-dev \
    libgdk-pixbuf2.0-dev \
    libxss-dev \
    libxtst-dev \
    libx11-xcb-dev \
    libxcb-dri3-dev

# Set environment variables for Puppeteer
echo "Setting up environment variables..."

# Add to ~/.bashrc for persistence
if ! grep -q "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Puppeteer configuration" >> ~/.bashrc
    echo "export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true" >> ~/.bashrc
    echo "export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser" >> ~/.bashrc
fi

# Export for current session
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

echo "Dependencies installed successfully!"
echo "Environment variables have been set."
echo ""
echo "To apply changes to current session, run:"
echo "source ~/.bashrc"
echo ""
echo "Or restart your terminal."
echo ""
echo "You can now run your WhatsApp bot without the Chromium library errors." 