"""
app.py — Scale Audit PDF service
Deployed on Railway. Called by the Next.js API route on Vercel.

Environment variables:
  PDF_SERVICE_SECRET  Shared secret — must match the Next.js side.
                      Requests without it return 401.
  PORT                Set automatically by Railway.
"""

import base64
import json
import os

from flask import Flask, jsonify, request

from generate_audit_pdf import generate_audit_pdf, score_audit

app = Flask(__name__)

SECRET = os.environ.get("PDF_SERVICE_SECRET", "")


def _check_secret():
    if not SECRET:
        return None  # secret not configured — open in dev
    if request.headers.get("X-PDF-Secret") != SECRET:
        return jsonify({"error": "Unauthorized"}), 401
    return None


@app.post("/generate")
def generate():
    denied = _check_secret()
    if denied:
        return denied

    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Invalid JSON body"}), 400

    name = body.get("name", "")
    email = body.get("email", "")
    answers = body.get("answers", [])

    if not email:
        return jsonify({"error": "email is required"}), 400
    if len(answers) != 24:
        return jsonify({"error": "answers must be a list of 24 integers"}), 400

    result = score_audit(answers)
    pdf_bytes = generate_audit_pdf(name=name, email=email, **result)

    return jsonify({
        "total_score":  result["total_score"],
        "tier_label":   result["tier_label"],
        "tier_insight": result["tier_insight"],
        "cat_scores":   result["cat_scores"],
        "priority_idx": result["priority_idx"],
        "pdf_b64":      base64.b64encode(pdf_bytes).decode(),
    })


@app.get("/health")
def health():
    return jsonify({"ok": True})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
