#!/usr/bin/env python3
"""Deterministic, synthetic-only standalone package. No private user files."""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    "scripts/build-candidates.mjs",
    "scripts/sanitize-ritual.mjs",
    "scripts/review-approval.mjs",
    "scripts/fixtures/issue7-example.json",
    "tests/generator.test.mjs",
    "tests/generator-workflow.test.mjs",
    "docs/data/issue-7-generator.md",
]
OUT = ROOT / "generated" / "private" / "issue7-reproduction.zip"

def main():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    sample = ROOT / "scripts/fixtures/issue7-example.json"
    with tempfile.TemporaryDirectory() as tmp:
        report_path = Path(tmp) / "candidate.json"
        # Tool requires generated/private: run on the fixed example with
        # transient output inside repo, never add private inputs to the archive.
        report_path = ROOT / "generated/private/issue7-example-result.json"
        subprocess.run(["node", "scripts/build-candidates.mjs",
                        str(sample.relative_to(ROOT)), str(report_path.relative_to(ROOT))],
                       cwd=ROOT, check=True, capture_output=True, text=True)
        result = report_path.read_bytes()
        # Packaging is synthetic only, private sample output is temporary.
        report_path.unlink()
    contents = {path: (ROOT / path).read_bytes() for path in FILES}
    contents["example/result.json"] = result
    manifest = {key: hashlib.sha256(value).hexdigest() for key, value in sorted(contents.items())}
    contents["SHA256SUMS.json"] = (json.dumps(manifest, indent=2, sort_keys=True) + "\n").encode()
    with ZipFile(OUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
        for path in sorted(contents):
            info = ZipInfo(path, date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = (0o644 << 16)
            archive.writestr(info, contents[path])
    print(f"Synthetic-only archive: {OUT}")
    print(f"SHA-256: {hashlib.sha256(OUT.read_bytes()).hexdigest()}")

if __name__ == "__main__":
    main()
