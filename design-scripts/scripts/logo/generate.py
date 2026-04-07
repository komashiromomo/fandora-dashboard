#!/usr/bin/env python3
"""Generate logo design concepts using Google Gemini AI."""

import argparse
import os
import sys

def load_api_key():
    """Load GEMINI_API_KEY from ~/.claude/skills/design/.env"""
    env_path = os.path.expanduser("~/.claude/skills/design/.env")
    if not os.path.exists(env_path):
        print(f"Error: .env file not found at {env_path}", file=sys.stderr)
        print("Please run design-scripts/setup.sh first.", file=sys.stderr)
        sys.exit(1)

    with open(env_path) as f:
        for line in f:
            line = line.strip()
            if line.startswith("GEMINI_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")

    print("Error: GEMINI_API_KEY not found in .env file.", file=sys.stderr)
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description="Generate logo design concepts with Gemini AI")
    parser.add_argument("--brand", required=True, help="Brand name for the logo")
    parser.add_argument("--style", default="modern", help="Design style (default: modern)")
    args = parser.parse_args()

    api_key = load_api_key()

    from google import genai

    client = genai.Client(api_key=api_key)

    prompt = (
        f"You are a professional graphic designer. Generate a detailed logo design concept "
        f"for the brand \"{args.brand}\" in a \"{args.style}\" style.\n\n"
        f"Include:\n"
        f"1. Logo concept description (shape, layout, composition)\n"
        f"2. Color palette (with hex codes)\n"
        f"3. Typography recommendations\n"
        f"4. Design rationale\n"
        f"5. Variations (icon-only, horizontal, vertical)\n"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    print(response.text)


if __name__ == "__main__":
    main()
