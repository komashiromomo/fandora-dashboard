#!/usr/bin/env python3
"""Generate icon design concepts using Google Gemini AI."""

import argparse
import os
import sys


def load_api_key():
    """Load GEMINI_API_KEY from environment or ~/.claude/skills/design/.env"""
    key = os.environ.get("GEMINI_API_KEY")
    if key:
        return key

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
    parser = argparse.ArgumentParser(description="Generate icon design concepts with Gemini AI")
    parser.add_argument("--brand", required=True, help="Brand or project name")
    parser.add_argument("--style", default="modern", help="Design style (default: modern)")
    parser.add_argument("--category", default="app-icon",
                        help="Icon category: app-icon, favicon, ui-icons, social-media (default: app-icon)")
    parser.add_argument("--sizes", default="16,32,64,128,256,512",
                        help="Comma-separated icon sizes in px (default: 16,32,64,128,256,512)")
    args = parser.parse_args()

    api_key = load_api_key()

    from google import genai

    client = genai.Client(api_key=api_key)

    sizes = [s.strip() for s in args.sizes.split(",")]
    sizes_formatted = ", ".join(f"{s}x{s}px" for s in sizes)

    prompt = (
        f"You are a professional icon designer. Generate a detailed icon design concept "
        f"for \"{args.brand}\" in a \"{args.style}\" style.\n\n"
        f"Category: {args.category}\n"
        f"Required sizes: {sizes_formatted}\n\n"
        f"Include:\n"
        f"1. Icon concept description (shape, symbolism, visual metaphor)\n"
        f"2. Color palette (with hex codes, including dark/light mode variants)\n"
        f"3. Grid and keyline specifications\n"
        f"4. Size-specific adaptations (what simplifies at small sizes)\n"
        f"5. Do's and Don'ts for usage\n"
        f"6. Export format recommendations (SVG, PNG, ICO)\n"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    print(response.text)


if __name__ == "__main__":
    main()
