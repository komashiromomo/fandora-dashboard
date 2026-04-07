#!/usr/bin/env python3
"""Diagnostic test for Gemini API key and connectivity."""

import os
import sys


def load_api_key():
    """Load GEMINI_API_KEY from environment or .env file."""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key, "environment variable"

    env_path = os.path.expanduser("~/.claude/skills/design/.env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line.startswith("GEMINI_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'"), env_path
    return None, None


def main():
    print("=== Gemini API Diagnostic Test ===\n")

    # 1. Check API key
    print("[1/4] Checking API key...")
    api_key, source = load_api_key()
    if not api_key:
        print("  FAIL: No GEMINI_API_KEY found.")
        print("  Run setup.sh or set GEMINI_API_KEY environment variable.")
        sys.exit(1)
    print(f"  OK: Key loaded from {source}")
    print(f"  Key prefix: {api_key[:10]}...{api_key[-4:]}")
    print()

    # 2. Check google-genai installed
    print("[2/4] Checking google-genai package...")
    try:
        from google import genai
        print(f"  OK: google-genai imported successfully")
    except ImportError as e:
        print(f"  FAIL: Cannot import google.genai: {e}")
        print("  Run: pip install google-genai")
        sys.exit(1)
    print()

    # 3. Test API connectivity (list models)
    print("[3/4] Testing API connectivity (list models)...")
    try:
        client = genai.Client(api_key=api_key)
        models = list(client.models.list())
        print(f"  OK: Connected. Found {len(models)} models.")
        gemini_models = [m.name for m in models if "gemini" in m.name.lower()]
        for m in gemini_models[:5]:
            print(f"    - {m}")
        if len(gemini_models) > 5:
            print(f"    ... and {len(gemini_models) - 5} more")
    except Exception as e:
        print(f"  FAIL: {e}")
        print()
        print("  Possible causes:")
        print("  - API key is invalid or revoked")
        print("  - Generative Language API not enabled in Google Cloud Console")
        print("  - API key has IP/referrer restrictions")
        print("  - Network connectivity issue")
        sys.exit(1)
    print()

    # 4. Test generation
    print("[4/4] Testing text generation (gemini-2.0-flash)...")
    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents="Say 'Hello, Fandora!' in one line.",
        )
        print(f"  OK: {response.text.strip()}")
    except Exception as e:
        print(f"  FAIL: {e}")
        sys.exit(1)
    print()

    print("=== All tests passed! ===")


if __name__ == "__main__":
    main()
