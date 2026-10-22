#!/usr/bin/env python3
"""Verify an Issue #7 reproduction ZIP in a new temporary directory.

Only bundled synthetic fixtures are used. No private records are read.
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
import tempfile
from pathlib import Path
from zipfile import ZipFile


def verify(path: Path) -> None:
    with ZipFile(path) as archive:
        entries = archive.namelist()
        if len(entries) != len(set(entries)):
            raise ValueError("Duplicate ZIP paths")
        if "SHA256SUMS.json" not in entries:
            raise ValueError("Missing manifest")
        expected = json.loads(archive.read("SHA256SUMS.json"))
        if not isinstance(expected, dict) or set(expected) != set(entries) - {"SHA256SUMS.json"}:
            raise ValueError("Manifest does not enumerate exactly all payload files")
        for name, digest in expected.items():
            posix = Path(name)
            if posix.is_absolute() or ".." in posix.parts or "\\" in name:
                raise ValueError("Unsafe ZIP path")
            if hashlib.sha256(archive.read(name)).hexdigest() != digest:
                raise ValueError("SHA-256 mismatch for " + name)
        with tempfile.TemporaryDirectory(prefix="trace-issue7-verify-") as folder:
            archive.extractall(folder)
            root = Path(folder)
            tests = sorted((root / "tests").glob("*.test.mjs"))
            if not tests:
                raise ValueError("No tests inside the archive")
            subprocess.run(["node", "--test", *[str(p.relative_to(root)) for p in tests]],
                           cwd=root, check=True)
            print("PASS: ZIP file manifest matches and standalone Node tests pass")
            print("ZIP SHA-256:", hashlib.sha256(path.read_bytes()).hexdigest())


if __name__ == "__main__":
    if len(sys.argv) != 2:
        raise SystemExit("Usage: python3 scripts/verify-reproduction.py generated/private/issue7-reproduction.zip")
    verify(Path(sys.argv[1]).resolve())
