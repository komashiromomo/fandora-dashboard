#!/usr/bin/env python3
"""Generate CIP (Corporate Identity Package) design concepts using Google Gemini AI."""

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
    parser = argparse.ArgumentParser(description="Generate CIP design concepts with Gemini AI")
    parser.add_argument("--brand", required=True, help="Brand name")
    parser.add_argument("--style", default="modern", help="Design style (default: modern)")
    parser.add_argument("--items", default="business-card,letterhead,envelope",
                        help="Comma-separated CIP items (default: business-card,letterhead,envelope)")
    args = parser.parse_args()

    api_key = load_api_key()

    from google import genai

    client = genai.Client(api_key=api_key)

    items_list = [item.strip() for item in args.items.split(",")]
    items_formatted = "\n".join(f"  - {item}" for item in items_list)

    prompt = (
        f"You are a professional brand identity designer. Generate a detailed Corporate Identity "
        f"Package (CIP) design concept for the brand \"{args.brand}\" in a \"{args.style}\" style.\n\n"
        f"CIP items to design:\n{items_formatted}\n\n"
        f"For each item, include:\n"
        f"1. Layout and dimensions\n"
        f"2. Color usage (with hex codes)\n"
        f"3. Typography placement and sizing\n"
        f"4. Logo placement and sizing rules\n"
        f"5. Design specifications (margins, bleeds, paper stock)\n\n"
        f"Also provide:\n"
        f"- Brand color palette (primary, secondary, accent)\n"
        f"- Typography system (headings, body, captions)\n"
        f"- Brand guidelines summary\n"
    )

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt,
    )

    print(response.text)


if __name__ == "__main__":
    main()
