#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEPLOY_DIR="$HOME/.claude/skills/design"
SCRIPTS_DIR="$DEPLOY_DIR/scripts"

echo "=== Design Scripts Setup ==="
echo ""

# Step 1: Install google-genai
echo "[1/4] Installing google-genai package..."
pip install google-genai cffi cryptography
echo "  -> google-genai installed successfully."
echo ""

# Step 2: Prompt for GEMINI_API_KEY
echo "[2/4] Configuring GEMINI_API_KEY..."
mkdir -p "$DEPLOY_DIR"
if [ -f "$DEPLOY_DIR/.env" ] && grep -q "GEMINI_API_KEY=" "$DEPLOY_DIR/.env"; then
    echo "  -> GEMINI_API_KEY already configured in $DEPLOY_DIR/.env"
    read -p "  -> Overwrite existing key? (y/N): " overwrite
    if [[ "$overwrite" != "y" && "$overwrite" != "Y" ]]; then
        echo "  -> Keeping existing key."
    else
        read -p "  -> Enter your GEMINI_API_KEY: " api_key
        sed -i "s/^GEMINI_API_KEY=.*/GEMINI_API_KEY=${api_key}/" "$DEPLOY_DIR/.env"
        echo "  -> API key updated."
    fi
else
    read -p "  -> Enter your GEMINI_API_KEY: " api_key
    echo "GEMINI_API_KEY=${api_key}" >> "$DEPLOY_DIR/.env"
    echo "  -> API key saved to $DEPLOY_DIR/.env"
fi
echo ""

# Step 3: Deploy scripts
echo "[3/4] Deploying scripts to $SCRIPTS_DIR ..."
mkdir -p "$SCRIPTS_DIR/logo" "$SCRIPTS_DIR/cip" "$SCRIPTS_DIR/icon"

cp "$SCRIPT_DIR/scripts/logo/generate.py" "$SCRIPTS_DIR/logo/generate.py"
chmod +x "$SCRIPTS_DIR/logo/generate.py"
echo "  -> logo/generate.py deployed."

cp "$SCRIPT_DIR/scripts/cip/generate.py" "$SCRIPTS_DIR/cip/generate.py"
chmod +x "$SCRIPTS_DIR/cip/generate.py"
echo "  -> cip/generate.py deployed."

cp "$SCRIPT_DIR/scripts/icon/generate.py" "$SCRIPTS_DIR/icon/generate.py"
chmod +x "$SCRIPTS_DIR/icon/generate.py"
echo "  -> icon/generate.py deployed."

cp "$SCRIPT_DIR/scripts/test_api.py" "$SCRIPTS_DIR/test_api.py"
chmod +x "$SCRIPTS_DIR/test_api.py"
echo "  -> test_api.py deployed."
echo ""

# Step 4: Verify installation
echo "[4/4] Verifying installation..."
python3 -c "from google import genai; print('  -> google-genai import OK')"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Deployed scripts:"
echo "  $SCRIPTS_DIR/test_api.py        (API diagnostic)"
echo "  $SCRIPTS_DIR/logo/generate.py   (Logo design)"
echo "  $SCRIPTS_DIR/cip/generate.py    (Corporate identity)"
echo "  $SCRIPTS_DIR/icon/generate.py   (Icon design)"
echo ""
echo "Usage:"
echo "  python3 $SCRIPTS_DIR/test_api.py                                        # Test API"
echo "  python3 $SCRIPTS_DIR/logo/generate.py --brand Fandora --style minimalist # Logo"
echo "  python3 $SCRIPTS_DIR/cip/generate.py  --brand Fandora --style modern     # CIP"
echo "  python3 $SCRIPTS_DIR/icon/generate.py --brand Fandora --category app-icon # Icon"
