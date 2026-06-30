from __future__ import annotations

from content_lib import dump_json, load_deck


def main() -> int:
    print(dump_json(load_deck()))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
