#!/usr/bin/env python3
"""Build a private submission bundle from three reviewed document pairs and Issue #7 ZIP.

Run locally. No upload, no web access, and no public directory writes.
"""
from __future__ import annotations
import argparse
import hashlib
import json
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

PAIRS = {
    "01_Resume": "Trace_BR-A_01_Resume_ROLES_VERIFIED",
    "02_Personal_Statement": "Trace_BR-A_02_Personal_Statement_ROLES_VERIFIED",
    "03_Project_Experience": "Trace_BR-A_03_Project_Experience_ROLES_VERIFIED",
}

def digest(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def package(docs: Path, device: Path, output: Path) -> str:
    files = {}
    for folder, stem in PAIRS.items():
        for ext in (".docx", ".pdf"):
            path = docs / (stem + ext)
            if not path.is_file():
                raise ValueError("Required document missing: " + path.name)
            data = path.read_bytes()
            if ext == ".pdf" and not data.startswith(b"%PDF-"):
                raise ValueError("Invalid PDF signature: " + path.name)
            if ext == ".docx":
                with ZipFile(path) as doc:
                    if "word/document.xml" not in doc.namelist() or doc.testzip():
                        raise ValueError("Invalid DOCX package: " + path.name)
            files["documents/" + folder + ext] = data
    if not device.is_file():
        raise ValueError("Device ZIP missing")
    with ZipFile(device) as z:
        if z.testzip() or "SHA256SUMS.json" not in z.namelist():
            raise ValueError("Device ZIP integrity check failed")
        manifest = json.loads(z.read("SHA256SUMS.json"))
        if set(manifest) != set(z.namelist()) - {"SHA256SUMS.json"}:
            raise ValueError("Device ZIP manifest coverage mismatch")
        for name, expected in manifest.items():
            if digest(z.read(name)) != expected:
                raise ValueError("Device ZIP checksum mismatch: " + name)
    files["device/issue7-reproduction.zip"] = device.read_bytes()
    hashes = {name: digest(data) for name, data in sorted(files.items())}
    files["SHA256SUMS.json"] = (json.dumps(hashes, sort_keys=True, ensure_ascii=False, indent=2) + "\n").encode()
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.resolve().is_relative_to(Path.cwd().resolve() / "public") or output.resolve().is_relative_to(Path.cwd().resolve() / "out"):
        raise ValueError("Cannot place private submission into a public path")
    with ZipFile(output, "w", ZIP_DEFLATED, compresslevel=9) as archive:
        for name in sorted(files):
            info = ZipInfo(name, date_time=(2020, 1, 1, 0, 0, 0))
            info.compress_type = ZIP_DEFLATED
            info.external_attr = 0o600 << 16
            archive.writestr(info, files[name])
    with ZipFile(output) as archive:
        if archive.testzip():
            raise ValueError("Final submission ZIP integrity check failed")
    return digest(output.read_bytes())

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--documents", required=True, type=Path)
    p.add_argument("--device", default="generated/private/issue7-reproduction.zip", type=Path)
    p.add_argument("--output", default="generated/private/Trace_BR-A_Private_Submission.zip", type=Path)
    args = p.parse_args()
    print("Private submission bundle SHA-256:", package(args.documents, args.device, args.output))
    print("Created local private ZIP only; no publication or submission performed.")
