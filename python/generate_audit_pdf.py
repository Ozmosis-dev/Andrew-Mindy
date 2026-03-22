"""
generate_audit_pdf.py
─────────────────────
Generates a branded PDF report for The Growth Brief.

Usage (from your API route):
    from generate_audit_pdf import generate_audit_pdf, score_audit

    # 1. Score the raw answers (list of 24 integers 1–4)
    result = score_audit(answers)

    # 2. Generate the PDF
    pdf_bytes = generate_audit_pdf(
        name="Alex Johnson",
        email="alex@growthco.com",
        cat_scores=result["cat_scores"],
        total_score=result["total_score"],
        tier_label=result["tier_label"],
        tier_insight=result["tier_insight"],
        priority_idx=result["priority_idx"],
    )
    # pdf_bytes is a bytes object — attach directly to your email or save to disk.

Dependencies:
    pip install reportlab pillow

Assets (place in the same directory as this file):
    fonts/PhosphateSolid.ttf
    fonts/SpaceGrotesk-Regular.ttf
    fonts/SpaceGrotesk-Medium.ttf
    fonts/SpaceGrotesk-Bold.ttf
    assets/wave_faded.png
"""

import io
import os
from pathlib import Path

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# ── Asset paths — resolved relative to this file ─────────────────────────────
_HERE  = Path(__file__).parent
_FONTS = _HERE / "fonts"
_ASSETS = _HERE / "assets"

def _register_fonts():
    """Register fonts once. Safe to call multiple times."""
    try:
        pdfmetrics.getFont('BebasNeue')
    except KeyError:
        pdfmetrics.registerFont(TTFont('BebasNeue',        str(_FONTS / 'BebasNeue-Regular.ttf')))
        pdfmetrics.registerFont(TTFont('PhosphateSolid',   str(_FONTS / 'PhosphateSolid.ttf')))
        pdfmetrics.registerFont(TTFont('SpaceGrotesk',     str(_FONTS / 'SpaceGrotesk-Regular.ttf')))
        pdfmetrics.registerFont(TTFont('SpaceGrotesk-Med', str(_FONTS / 'SpaceGrotesk-Medium.ttf')))
        pdfmetrics.registerFont(TTFont('SpaceGrotesk-Bold',str(_FONTS / 'SpaceGrotesk-Bold.ttf')))

_register_fonts()

# ── Scoring logic ─────────────────────────────────────────────────────────────
_TIERS = [
    (82, "Optimized",
     "Your systems are the competitive advantage. Most companies your size are held together by talented "
     "people working too hard. Yours runs on documented, repeatable processes that compound over time. "
     "Growth at this stage is a function of execution and opportunity — not firefighting. "
     "The work now is protecting what's built as you scale team and revenue."),
    (65, "Scale-Ready",
     "The foundation is there. Now you push. You've built something that works systematically — not just "
     "accidentally. Your processes hold up under pressure, your brand reflects who you've become, and your "
     "pipeline is more predictable than most. There are gaps, but they're refinement problems, not structural "
     "ones. The ceiling from here is ambition, not operations."),
    (48, "At the Ceiling",
     "What got you here is starting to limit you. This is the most common position for companies between "
     "$1M and $5M. You've grown on the strength of good people and good instincts — but the informal systems "
     "that worked at smaller scale are now creating drag. You feel it as: inconsistent close rates, manual "
     "work that never gets automated, a brand that doesn't quite match the business you've built. "
     "The gap between where you are and where you could be is mostly process."),
    (32, "Leaking Revenue",
     "You're generating revenue despite your systems, not because of them. There's real friction in your "
     "operation — and it's costing you money you can measure. Leads fall through cracks. Manual work consumes "
     "hours that should go toward selling or building. Every dollar you put into growth right now is working "
     "against a current. Fixing the leaks isn't overhead — it's the highest-ROI investment available to you."),
    (16, "Reactive Mode",
     "The business runs on you, not on systems. Growth is happening, but it's unpredictable — because the "
     "outcomes depend on who's in the room, not what's on the page. There's no documented sales process, no "
     "reliable lead system, no brand infrastructure that works without you. This is the natural state of a "
     "company that grew fast without time to systematize. But it's also a ceiling, a retention risk, and a "
     "fragility you can't afford to carry into the next stage."),
    (0,  "Start Here",
     "Before you scale anything, you need a foundation. Right now, every investment in marketing, sales, or "
     "growth is working against a leaky bucket. Without documented processes, a brand that converts, and "
     "systems that capture leads reliably, more growth just creates more chaos. The work here is foundational, "
     "and the ROI on getting it right is multiplied by everything you build on top of it."),
]

_QUESTIONS_PER_CAT = 4   # 6 categories × 4 questions = 24 total
_CAT_COUNT         = 6
_MAX_CAT_SCORE     = 16  # 4 questions × 4 max answer = 16
_MAX_TOTAL         = 96  # 6 × 16

def score_audit(answers: list[int]) -> dict:
    """
    Score a completed audit.

    Args:
        answers: List of 24 integers (1–4), in question order.
                 Questions 0-3  → category 0 (Sales System)
                 Questions 4-7  → category 1 (Brand Positioning)
                 Questions 8-11 → category 2 (Lead Operations)
                 Questions 12-15→ category 3 (Internal Workflows)
                 Questions 16-19→ category 4 (Marketing Infrastructure)
                 Questions 20-23→ category 5 (Growth Readiness)

    Returns:
        {
            "cat_scores":   [int × 6],   # score per category (0–16)
            "total_score":  int,          # 0–96
            "tier_label":   str,
            "tier_insight": str,
            "priority_idx": int,          # index of lowest-scoring category
        }
    """
    if len(answers) != 24:
        raise ValueError(f"Expected 24 answers, got {len(answers)}")
    for i, a in enumerate(answers):
        if a not in (1, 2, 3, 4):
            raise ValueError(f"Answer {i} must be 1–4, got {a}")

    cat_scores = [0] * _CAT_COUNT
    for i, ans in enumerate(answers):
        cat_scores[i // _QUESTIONS_PER_CAT] += ans

    total = sum(cat_scores)
    tier_label, tier_insight = next(
        (t[1], t[2]) for t in _TIERS if total >= t[0]
    )
    priority_idx = cat_scores.index(min(cat_scores))

    return {
        "cat_scores":   cat_scores,
        "total_score":  total,
        "tier_label":   tier_label,
        "tier_insight": tier_insight,
        "priority_idx": priority_idx,
    }

# ── Tokens ────────────────────────────────────────────────────────────────────
INK      = colors.HexColor('#0A0A0A')
SURFACE  = colors.HexColor('#0F0F0F')
SURFACE2 = colors.HexColor('#111111')
MID      = colors.HexColor('#1A1A1A')
MID2     = colors.HexColor('#222222')
BLUE     = colors.HexColor('#66B3FF')
BLUE_DIM = colors.HexColor('#0D1E30')
CREAM    = colors.HexColor('#F0EBE3')
MUTED    = colors.HexColor('#777777')
DIM      = colors.HexColor('#BBBBBB')
GHOST    = colors.HexColor('#444444')

W, H     = letter          # 612 × 792 pt
WAVE     = str(_ASSETS / 'wave_faded.png')
WAVE_H   = H * 0.40        # wave occupies bottom 40% of every page

CATEGORIES = [
    ("01", "Sales System",            "How predictably does your team close?"),
    ("02", "Brand Positioning",       "Does your brand match who you are today?"),
    ("03", "Lead Operations",         "How much manual work lives between lead and close?"),
    ("04", "Internal Workflows",      "Where is your team's time going that it shouldn't be?"),
    ("05", "Marketing Infrastructure","Is your top-of-funnel predictable or random?"),
    ("06", "Growth Readiness",        "Can your current setup handle 2x without breaking?"),
]

CAT_DETAIL = [
    {"what":"A close rate that depends on who's running the appointment is a ceiling, not a foundation. When your sales process lives in reps' heads, you can't hire for it, train for it, or improve it systematically.",
     "signs":["Close rate varies significantly between reps","New hires take 3–6 months to become productive","No documented objection handling or deal structure","Top performer leaving would meaningfully hurt revenue"],
     "actions":["Map your top rep's exact process and document it","Build a 30-day onboarding curriculum with milestones","Define pipeline stages with clear entry/exit criteria","Run weekly close rate reviews to find stalling points"],
     "proof":"At Team Roofing, systematizing the process improved close rate from 35% to 52% and enabled zero-experience hires to produce $200K in their first month."},
    {"what":"Your brand isn't just aesthetics — it's the first filter prospects run you through. An outdated or inconsistent brand signals your operation hasn't grown, even when it has.",
     "signs":["Website was built more than 2 years ago","Materials look like they came from different companies","You feel you need to 'explain' your brand to prospects","Competitors with inferior offerings win on perception"],
     "actions":["Audit all prospect-facing touchpoints end-to-end","Define 3 words your brand should communicate — then test","Prioritize website first — it's where qualification happens","Create a single-page brand standards doc your team uses"],
     "proof":"Southern Water Service's rebrand positioned them as a sophisticated industrial partner, directly supporting expansion into higher-value distribution contracts."},
    {"what":"Manual lead operations are a hidden tax on your revenue. Every hour spent on data entry or follow-up tracking is an hour not spent closing. At scale, this compounds into thousands of hours annually.",
     "signs":["Leads regularly fall through the cracks","Team spends hours each week on manual data entry","Follow-up timing is inconsistent across the pipeline","CRM exists but isn't consistently used"],
     "actions":["Map every manual step from lead inquiry to close","Implement lead scoring to prioritize automatically","Set up automated sequences for common follow-up scenarios","Track lead response time — it's the most predictive metric"],
     "proof":"At Southern Water Service, automating lead ops reduced batch search time by 95% and reclaimed 1,000+ hours annually — $37K in labor savings."},
    {"what":"When processes live in people's heads, you're not running a business — you're running a collection of individuals. Every key-person dependency is a growth ceiling.",
     "signs":["Key team members can't take time off without things breaking","Onboarding takes weeks of ad-hoc knowledge transfer","The same questions get answered over and over","Output quality varies significantly by who does the work"],
     "actions":["Identify top 5 most-repeated processes and document them first","Create a simple SOP template your team will actually follow","Build a knowledge base for common internal questions","Review and update documentation quarterly"],
     "proof":"Documenting and standardizing SOPs across 5 departments at Team Roofing was what made the $3M to $20M growth possible without proportionally scaling management."},
    {"what":"Unpredictable marketing means unpredictable revenue. If your pipeline depends on referrals, timing, or individual effort rather than a system, growth is a series of sprints — not a compounding trajectory.",
     "signs":["Revenue varies significantly month-to-month without clear cause","You can't reliably predict next quarter's pipeline","Most leads still come from referrals or word of mouth","You don't know which marketing activities drive revenue"],
     "actions":["Identify your top 2 lead sources and systematize them","Set up basic attribution: know where every lead came from","Create a 90-day content calendar and stick to it one quarter","Build email nurture sequences for leads not yet ready to buy"],
     "proof":"Systematizing marketing infrastructure is what separates companies that grow reactively from those that grow on purpose. Attribution and automation are the difference."},
    {"what":"The constraints you tolerate today will become crises at 2x revenue. Growth readiness isn't about preparing for a hypothetical — it's about removing the bottlenecks that will break you before they do.",
     "signs":["You already know 2–3 things that will break if revenue doubles","Key decisions funnel through one or two people","Systems held together with workarounds","New team members take too long to become productive"],
     "actions":["Do a '2x stress test' — what breaks if revenue doubles?","Identify your biggest key-person dependency and decouple it","Audit your tech stack for tools you're outgrowing","Build a 90-day operational roadmap focused on scale-readiness"],
     "proof":"Notova was architected to handle growth without proportional engineering effort. That philosophy is what allows fast-moving companies to stay fast."},
]

TIER_DATA = {
    "Scale-Ready":      (colors.HexColor('#0A2A1A'), colors.HexColor('#2DD881')),
    "Growth Plateau":   (BLUE_DIM,                   BLUE),
    "Operational Drag": (colors.HexColor('#1A1500'),  colors.HexColor('#E8721A')),
    "Foundation First": (colors.HexColor('#2A0A0A'),  colors.HexColor('#E04040')),
}
CAT_TIER_COLORS = {
    "Strong":     colors.HexColor('#2DD881'),
    "Developing": BLUE,
    "Fragile":    colors.HexColor('#E8721A'),
    "Critical":   colors.HexColor('#E04040'),
}

def get_tier_str(score, mx=16):
    if score >= mx * 0.75: return "Strong"
    if score >= mx * 0.50: return "Developing"
    if score >= mx * 0.25: return "Fragile"
    return "Critical"

# ── Drawing helpers ───────────────────────────────────────────────────────────
def rr(c, x, y, w, h, r=4, fc=None, sc=None, sw=0.5):
    if fc: c.setFillColor(fc)
    if sc: c.setStrokeColor(sc); c.setLineWidth(sw)
    c.roundRect(x, y, w, h, r, fill=1 if fc else 0, stroke=1 if sc else 0)

def dt(c, text, x, y, font, size, color, align='left'):
    c.setFillColor(color); c.setFont(font, size)
    {'left': c.drawString, 'right': c.drawRightString,
     'center': c.drawCentredString}[align](x, y, text)

def wp(c, text, x, y, width, font, size, color, leading=None):
    if leading is None: leading = size * 1.55
    s = ParagraphStyle('p', fontName=font, fontSize=size, textColor=color, leading=leading)
    p = Paragraph(text, s)
    _, ph = p.wrapOn(c, width, 600)
    p.drawOn(c, x, y - ph)
    return ph

def text_height(text, width, font, size, leading=None):
    if leading is None: leading = size * 1.55
    s = ParagraphStyle('p', fontName=font, fontSize=size, leading=leading)
    p = Paragraph(text, s)
    _, ph = p.wrap(width, 1000)
    return ph

def draw_wave(c):
    """Draw wave image anchored to bottom of current page."""
    c.drawImage(WAVE, 0, 0, width=W, height=WAVE_H, mask='auto')

def page_base(c, blue_rule=True):
    """Ink background + wave on every page."""
    c.setFillColor(INK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    draw_wave(c)
    if blue_rule:
        c.setFillColor(BLUE)
        c.rect(0, H - 3, W, 3, fill=1, stroke=0)

def footer(c, page_num=None):
    c.setFillColor(MID)
    c.rect(48, 38, W - 96, 0.5, fill=1, stroke=0)
    dt(c, "ANDREW MINDY — THE GROWTH BRIEF", 48, 24, 'SpaceGrotesk', 7, MUTED)
    dt(c, "andrewmindy.com  ·  info@andrewmindy.com", W-48, 24, 'SpaceGrotesk', 7, MUTED, 'right')
    if page_num:
        dt(c, str(page_num), W/2, 24, 'SpaceGrotesk', 7, GHOST, 'center')

# ── Main generator ────────────────────────────────────────────────────────────
def generate_audit_pdf(
    name: str,
    email: str,
    cat_scores: list,
    total_score: int,
    tier_label: str,
    tier_insight: str,
    priority_idx: int,
    max_score: int = 96,
    output_path: str | None = None,
) -> bytes:
    """
    Generate a PDF audit report and return it as bytes.

    If output_path is provided, the PDF is also written to that path.
    Returns the PDF as a bytes object for direct email attachment.

    Args:
        name:         Client's name (shown on cover)
        email:        Client's email (shown on cover)
        cat_scores:   List of 6 category scores (0–16 each)
        total_score:  Sum of cat_scores (0–96)
        tier_label:   Overall tier (e.g. "Growth Plateau")
        tier_insight: 2–3 sentence description of the tier
        priority_idx: Index (0–5) of the lowest-scoring category
        max_score:    Maximum possible score (default 96)
        output_path:  Optional file path to also save the PDF

    Returns:
        bytes: The complete PDF file as a bytes object
    """
    _register_fonts()  # idempotent — safe to call every time

    tier_bg, tier_accent = TIER_DATA.get(tier_label, (SURFACE2, BLUE))
    _buffer = io.BytesIO()
    c = canvas.Canvas(_buffer, pagesize=letter)

    # ═══════════════════════════════════════════════════════════════
    # PAGE 1 — COVER  (all positions verified via font metric math)
    # Y = distance from page bottom. Page = 792pt. Blue rule at top.
    # Wave occupies y=0..317. CTA sits in wave fade zone (intentional).
    #
    # LEFT COL (x=52, w=268):
    #  752  WM1 "ANDREW MINDY"     (top=760, bot=750)
    #  736  WM2 "andrewmindy.com"
    #  651  HL1 "THE GROWTH" B60    (top=716, bot=629)
    #  590  HL2 "BRIEF" B60        (top=655, bot=568) | gap=4.6pt ✓
    #  560  rule
    #  540→510  intro text 2 lines
    #  415  score B56              (top=465, bot=398) | gap from intro=14.6pt ✓
    #  382  "/ N" label
    #  365  bar y
    #  295→337  CTA bar (28pt below bar)
    #
    # RIGHT COL (x=356, w=204):
    #  760  PREPARED FOR
    #  738  name, 720 email, 703 rule
    #  674..544  6 cat rows (26pt each)
    #  521  rule
    #  505  pbox top, h=152, bot=353
    # ═══════════════════════════════════════════════════════════════
    page_base(c)

    M  = 52
    LW = 268
    RX = 356
    RW = W - RX - M

    # ── Wordmark ──────────────────────────────────────────────────
    dt(c, "ANDREW MINDY",    M, 752, 'PhosphateSolid', 8, CREAM)
    dt(c, "andrewmindy.com", M, 736, 'SpaceGrotesk',      7, MUTED)

    # Vertical spine
    c.saveState()
    c.setFillColor(BLUE); c.setFont('SpaceGrotesk', 7)
    c.translate(W - 16, H / 2); c.rotate(90)
    c.drawCentredString(0, 0, "THE GROWTH BRIEF  —  CONFIDENTIAL RESULTS")
    c.restoreState()

    # ── LEFT COLUMN ───────────────────────────────────────────────
    # Headline — 4.6pt visual gap between lines (tight editorial feel)
    dt(c, "THE GROWTH", M, 651, 'PhosphateSolid', 72, CREAM)
    dt(c, "BRIEF",     M, 582, 'PhosphateSolid', 72, BLUE)

    # Rule — 14pt below BRIEF bottom (560)
    c.setStrokeColor(MID2); c.setLineWidth(0.5)
    c.line(M, 546, M + LW, 546)

    # Intro text — draws downward from 533, 2 lines
    wp(c,
       "A diagnostic for growth-stage companies. "
       "Six categories. A clear picture of where to focus.",
       M, 533, LW, 'SpaceGrotesk', 9, MUTED, leading=15)

    # Score — PhosphateSolid 56, baseline 415 (top=465, 14.6pt below intro bot 480)
    dt(c, str(total_score), M, 415, 'PhosphateSolid', 56, BLUE)

    # "/ N" label — baseline 382
    dt(c, f"/ {max_score}", M, 382, 'SpaceGrotesk', 11, MUTED)

    # Score bar — y=365
    sb_w = LW
    c.setFillColor(MID2); c.roundRect(M, 365, sb_w, 5, 2, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.roundRect(M, 365, sb_w * min(total_score / max_score, 1.0), 5, 2, fill=1, stroke=0)

    # Tier label — below bar
    dt(c, tier_label.upper(), M, 349, 'SpaceGrotesk-Bold', 8, tier_accent)

    # CTA bar — y=255..285, single line, lower on page
    rr(c, M, 255, W - M*2, 34, 3, BLUE_DIM)
    rr(c, M, 255, W - M*2, 34, 3, sc=BLUE, sw=0.5)
    dt(c, "BOOK YOUR FREE 30-MIN GROWTH BRIEF REVIEW →",
       M + 14, 267, 'SpaceGrotesk-Bold', 8, BLUE)

    # ── RIGHT COLUMN ──────────────────────────────────────────────
    c.setStrokeColor(MID2); c.setLineWidth(0.5)
    c.line(RX - 12, 769, RX - 12, 293)

    dt(c, "PREPARED FOR", RX, 760, 'SpaceGrotesk-Bold', 7, MUTED)
    dt(c, name,            RX, 738, 'SpaceGrotesk-Bold', 14, CREAM)
    dt(c, email,           RX, 720, 'SpaceGrotesk',       9, MUTED)
    c.line(RX, 703, W - M, 703)

    # 6 category rows — first baseline=674, step=26
    for i, (num, label, _) in enumerate(CATEGORIES):
        s  = cat_scores[i]
        ip = (i == priority_idx)
        ry = 674 - i * 26
        if ip:
            rr(c, RX - 4, ry - 15, RW + 4, 26, 2, BLUE_DIM)
        dt(c, num, RX, ry, 'SpaceGrotesk-Bold', 7, BLUE if ip else GHOST)
        lbl = label.upper()
        if len(lbl) > 19: lbl = lbl[:18] + '…'
        dt(c, lbl, RX + 22, ry, 'SpaceGrotesk-Bold', 7, CREAM if ip else DIM)
        dt(c, f"{s}/16", W - M, ry, 'SpaceGrotesk-Bold', 7,
           BLUE if ip else MUTED, 'right')

    c.line(RX, 521, W - M, 521)

    # Priority box — top=505, h=152, bot=353
    # Internal (verified no overlaps):
    #  488  "PRIORITY FOCUS" label
    #  460  category name (PhosphateSolid 20, top=478, bot=454)
    #  440→412  sub quote (2 lines × 14pt leading)
    #  381  score (PhosphateSolid 26, top=404, bot=373)
    #  358  tier label (bot=356) | box bot=353 ✓
    PBOX_BOT = 353
    PBOX_H   = 152
    rr(c, RX - 4, PBOX_BOT, RW + 4, PBOX_H, 3, BLUE_DIM)
    rr(c, RX - 4, PBOX_BOT, RW + 4, PBOX_H, 3, sc=BLUE, sw=0.5)

    dt(c, "PRIORITY FOCUS",
       RX + 6, 488, 'SpaceGrotesk-Bold', 7, BLUE)
    dt(c, CATEGORIES[priority_idx][1].upper(),
       RX + 6, 460, 'PhosphateSolid', 20, CREAM)
    wp(c, f'"{CATEGORIES[priority_idx][2]}"',
       RX + 6, 440, RW - 12, 'SpaceGrotesk', 8, DIM, leading=14)
    # Score and tier pinned near bottom of box
    tsp = get_tier_str(cat_scores[priority_idx])
    dt(c, tsp.upper(),
       RX + 6, 362, 'SpaceGrotesk-Bold', 7, CAT_TIER_COLORS[tsp])
    dt(c, f"{cat_scores[priority_idx]}/16",
       RX + 6, 378, 'PhosphateSolid', 26, BLUE)

    c.showPage()

    # ═══════════════════════════════════════════════════════════════
    # PAGE 2 — SCORE OVERVIEW
    # ═══════════════════════════════════════════════════════════════
    page_base(c)

    dt(c, "02 — SCORE BREAKDOWN", 52, H-34,  'SpaceGrotesk-Bold', 7, BLUE)
    dt(c, "YOUR RESULTS",         52, H-86,  'PhosphateSolid', 44, CREAM)
    dt(c, "AT A GLANCE",          52, H-110, 'PhosphateSolid', 44, BLUE)
    c.setStrokeColor(MID); c.setLineWidth(0.5)
    c.line(52, H-142, W-52, H-142)

    cw = (W - 96 - 14) / 2
    ch = 90
    sy2 = H - 182

    for i, (num, label, sub) in enumerate(CATEGORIES):
        col = i % 2; row = i // 2
        cx = 48 + col * (cw + 14)
        cy = sy2 - row * (ch + 10)
        ip = (i == priority_idx); s = cat_scores[i]

        rr(c, cx, cy-ch, cw, ch, 3, BLUE_DIM if ip else SURFACE2)
        if ip: rr(c, cx, cy-ch, cw, ch, 3, sc=BLUE, sw=0.8)

        dt(c, num, cx+12, cy-17, 'SpaceGrotesk-Bold', 7, BLUE if ip else MUTED)
        dt(c, label.upper(), cx+12, cy-31, 'SpaceGrotesk-Bold', 9, CREAM)
        sub_s = sub[:45] + ('…' if len(sub)>45 else '')
        dt(c, sub_s, cx+12, cy-44, 'SpaceGrotesk', 7, MUTED)
        dt(c, str(s), cx+cw-12, cy-32, 'PhosphateSolid', 24, BLUE if ip else CREAM, 'right')
        dt(c, "/16", cx+cw-12, cy-44, 'SpaceGrotesk', 8, MUTED, 'right')

        bw2 = cw - 24
        by2 = cy - ch + 18
        c.setFillColor(MID); c.roundRect(cx+12, by2, bw2, 4, 2, fill=1, stroke=0)
        c.setFillColor(BLUE if ip else GHOST)
        c.roundRect(cx+12, by2, bw2 * min(s/16,1.0), 4, 2, fill=1, stroke=0)

        ts = get_tier_str(s)
        c.setFillColor(CAT_TIER_COLORS[ts]); c.setFont('SpaceGrotesk-Bold', 7)
        c.drawString(cx+12, cy-ch+30, ts.upper())
        if ip: c.setFillColor(BLUE); c.drawRightString(cx+cw-12, cy-ch+30, "▲ PRIORITY")

    # Overall score — positions verified via font metrics (no overlaps)
    # rule=196, label=184(top=191,bot=182), score=150(top=179,bot=140), bar=132(top=137)
    c.setStrokeColor(MID); c.setLineWidth(0.5)
    c.line(48, 196, W-48, 196)
    dt(c, "OVERALL SCORE", 48, 184, 'SpaceGrotesk', 7, MUTED)
    dt(c, str(total_score), 48, 150, 'PhosphateSolid', 32, BLUE)
    dt(c, f"/ {max_score}", 92, 150, 'SpaceGrotesk', 11, MUTED)
    dt(c, tier_label.upper(), 124, 150, 'SpaceGrotesk-Bold', 10, CREAM)
    c.setFillColor(MID); c.roundRect(48, 132, W-96, 5, 2, fill=1, stroke=0)
    c.setFillColor(BLUE)
    c.roundRect(48, 132, (W-96)*min(total_score/max_score,1.0), 5, 2, fill=1, stroke=0)

    footer(c, 2)
    c.showPage()

    # ═══════════════════════════════════════════════════════════════
    # PAGES 3–8 — CATEGORY DETAIL PAGES
    # ═══════════════════════════════════════════════════════════════
    top_offset = 30  # Increased top padding

    for i, (num, label, sub) in enumerate(CATEGORIES):
        page_base(c)
        ip = (i == priority_idx)
        s  = cat_scores[i]
        detail = CAT_DETAIL[i]

        # Split title if needed
        if label.upper() == "MARKETING INFRASTRUCTURE":
            lines_title = ["MARKETING", "INFRASTRUCTURE"]
        else:
            lines_title = [label.upper()]
            
        title_shift = 44 if len(lines_title) > 1 else 0
        sh_score = top_offset + title_shift

        # Priority badge — inline with title, shifted left clear of score block
        # Score block occupies W-48..W-96 (Bebas52 2-digit). Badge right edge = W-112.
        if ip:
            badge_w2 = 114
            badge_x  = W - 112 - badge_w2   # right edge at W-112, clear of score
            badge_y2 = H - 70 - sh_score    # vertically centered on title
            rr(c, badge_x, badge_y2, badge_w2, 22, 3, BLUE)
            dt(c, "PRIORITY FOCUS", badge_x + badge_w2/2, badge_y2 + 8,
               'SpaceGrotesk-Bold', 7, INK, 'center')

        # Header block
        dt(c, f"{num} — {label.upper()}", 48, H - 34 - top_offset, 'SpaceGrotesk-Bold', 7,
           BLUE if ip else MUTED)
        
        y_title_start = H - 72 - top_offset
        for idx, line in enumerate(lines_title):
            dt(c, line, 48, y_title_start - (idx * 44), 'PhosphateSolid', 44, CREAM)
            
        dt(c, f'"{sub}"', 48, H - 94 - sh_score, 'SpaceGrotesk', 10, MUTED)

        c.setStrokeColor(MID); c.setLineWidth(0.5)
        c.line(48, H - 110 - sh_score, W-48, H - 110 - sh_score)

        # Score block — right-aligned, vertically tied to title
        dt(c, str(s), W-48, H - 68 - sh_score, 'PhosphateSolid', 52, BLUE if ip else CREAM, 'right')
        dt(c, "/16", W-48, H - 84 - sh_score, 'SpaceGrotesk', 10, MUTED, 'right')
        bw3 = 170; brx = W-48-bw3; bys = H - 98 - sh_score
        c.setFillColor(MID); c.roundRect(brx, bys, bw3, 4, 2, fill=1, stroke=0)
        c.setFillColor(BLUE if ip else GHOST)
        c.roundRect(brx, bys, bw3*min(s/16,1.0), 4, 2, fill=1, stroke=0)
        ts2 = get_tier_str(s)
        c.setFillColor(CAT_TIER_COLORS[ts2]); c.setFont('SpaceGrotesk-Bold', 7)
        c.drawRightString(W-48, H - 110 - sh_score, ts2.upper())

        # Body
        y = H - 130 - sh_score

        dt(c, "WHAT THIS MEANS", 48, y, 'SpaceGrotesk-Bold', 7, BLUE if ip else MUTED)
        y -= 14
        h2 = wp(c, detail["what"], 48, y, W-96, 'SpaceGrotesk', 10, DIM)
        y -= h2 + 18

        c.setStrokeColor(MID); c.line(48, y+6, W-48, y+6); y -= 6
        dt(c, "SIGNS YOU'RE HERE", 48, y, 'SpaceGrotesk-Bold', 7, BLUE if ip else MUTED)
        y -= 14
        for sign in detail["signs"]:
            c.setFillColor(BLUE); c.circle(56, y+3.5, 2, fill=1, stroke=0)
            dt(c, sign, 68, y, 'SpaceGrotesk', 9, DIM)
            y -= 14
        y -= 10

        c.setStrokeColor(MID); c.line(48, y+6, W-48, y+6); y -= 6
        dt(c, "FOUR QUICK WINS", 48, y, 'SpaceGrotesk-Bold', 7, BLUE if ip else MUTED)
        y -= 26  # Increased padding beneath the four quick wins header line
        col_w2 = (W - 96 - 14) / 2
        for j, action in enumerate(detail["actions"]):
            col = j % 2
            if col == 0 and j == 2: y -= 6
            ax = 48 + col * (col_w2 + 14)
            rr(c, ax, y-4, 18, 14, 2, MID2)
            dt(c, f"0{j+1}", ax+9, y+1, 'SpaceGrotesk-Bold', 7, BLUE, 'center')
            words = action.split()
            lines2 = ['']
            for w2 in words:
                test = (lines2[-1]+' '+w2).strip()
                if len(test)*5 > col_w2-28: lines2.append(w2)
                else: lines2[-1] = test
            for li, line in enumerate(lines2[:2]):
                dt(c, line, ax+26, y+1-li*11, 'SpaceGrotesk', 8, CREAM if li==0 else DIM)
            if col == 1: y -= 26

        y -= 24

        # Proof strip — keep above wave, min y=160
        ph = text_height(detail["proof"], W-128, 'SpaceGrotesk', 8, leading=13)
        # Top pad (16) + text start gap from title (12) + 16 (bot pad) = 44
        proof_h = 44 + ph
        
        py = max(y - proof_h, 155)
        rr(c, 48, py, W-96, proof_h, 4, BLUE_DIM if ip else SURFACE)
        if ip: rr(c, 48, py, W-96, proof_h, 4, sc=BLUE, sw=0.5)
        
        dt(c, "PROOF POINT", 64, py + proof_h - 16, 'PhosphateSolid', 7, BLUE)
        wp(c, detail["proof"], 64, py + proof_h - 28, W-128, 'SpaceGrotesk', 8, DIM, leading=13)

        footer(c, i+3)
        c.showPage()

    # ═══════════════════════════════════════════════════════════════
    # PAGE 9 — NEXT STEPS
    # ═══════════════════════════════════════════════════════════════
    page_base(c)

    dt(c, "08 — WHAT HAPPENS NOW", 48, H-48, 'SpaceGrotesk-Bold', 7, MUTED)
    dt(c, "THREE WAYS TO MOVE", 48, H-82, 'PhosphateSolid', 38, CREAM)
    dt(c, "FROM DIAGNOSIS TO ACTION.", 48, H-118, 'PhosphateSolid', 38, BLUE)
    c.setStrokeColor(MID); c.setLineWidth(0.5)
    c.line(48, H-132, W-48, H-132)

    steps = [
        ("01","REVIEW YOUR RESULTS",
         "Go through each category in this report. The signs and quick wins are your starting point — pick the one action per section you can execute in the next 30 days."),
        ("02","BOOK A FREE BRIEF REVIEW",
         "I do a free 30-minute call for founders who complete the audit. We walk through your results together and I'll tell you exactly what I'd prioritize. No pitch — just clarity."),
        ("03","START A PROJECT",
         "If you want to go further, every engagement starts with a conversation. Reach out at contact@andrewmindy.com and tell me what's not keeping pace with your growth."),
    ]

    ROW_H  = 84    # row height
    ROW_GAP = 10   # gap between rows
    STEP_X  = 48   # left edge
    NUM_W   = 52   # number column width
    TXT_X   = STEP_X + NUM_W + 12  # text starts here
    TXT_W   = W - TXT_X - 48       # text column width

    sy3 = H - 152
    for sn, st, sd in steps:
        box_bot = sy3 - ROW_H
        # Row background
        rr(c, STEP_X, box_bot, W-96, ROW_H, 4, SURFACE2)
        # Left number column — blue tinted bg
        rr(c, STEP_X, box_bot, NUM_W, ROW_H, 4, BLUE_DIM)
        # Number — vertically centered: baseline = box_bot + (ROW_H/2) - 8 = box_bot + 34
        dt(c, sn, STEP_X + NUM_W/2, box_bot + 34, 'PhosphateSolid', 28, BLUE, 'center')
        # Title — increased top padding to better center with body text
        dt(c, st, TXT_X, sy3 - 26, 'SpaceGrotesk-Bold', 11, CREAM)
        # Body — preserved gap below title, adjusting bottom padding
        wp(c, sd, TXT_X, sy3 - 40, TXT_W, 'SpaceGrotesk', 9, DIM, leading=14)
        sy3 -= ROW_H + ROW_GAP

    # CTA block — sits just above the wave
    cta_h = 76
    rr(c, 48, 155, W-96, cta_h, 4, BLUE)
    dt(c, "BOOK YOUR FREE 30-MIN BRIEF REVIEW", W/2, 155 + 46, 'SpaceGrotesk-Bold', 14, INK, 'center')
    dt(c, "calendly.com/andrewmindy-info/30min  ·  info@andrewmindy.com  ·  330-507-7605",
       W/2, 155 + 24, 'SpaceGrotesk', 9, INK, 'center')

    footer(c, 9)
    c.save()

    pdf_bytes = _buffer.getvalue()

    if output_path:
        with open(output_path, 'wb') as f:
            f.write(pdf_bytes)
        print(f"PDF saved → {output_path}")

    return pdf_bytes


if __name__ == "__main__":
    # ── Test: simulate a completed audit with example answers ─────────────────
    import sys

    # 24 answers (1–4). Swap these with real answers from your database.
    test_answers = [3, 3, 3, 3,   # Sales System       → 12
                    2, 3, 2, 3,   # Brand Positioning  → 10
                    2, 2, 2, 1,   # Lead Operations    →  7  (priority)
                    3, 2, 2, 2,   # Internal Workflows →  9
                    3, 2, 3, 2,   # Marketing Infra    → 10
                    3, 3, 2, 3]   # Growth Readiness   → 11

    result = score_audit(test_answers)
    print("Scoring result:")
    for k, v in result.items():
        print(f"  {k}: {v}")

    output = sys.argv[1] if len(sys.argv) > 1 else "scale_audit_test.pdf"
    pdf_bytes = generate_audit_pdf(
        name="Alex Johnson",
        email="alex@growthco.com",
        output_path=output,
        **result,
    )
    print(f"PDF size: {len(pdf_bytes):,} bytes")
    print(f"\nUsage in your API route:")
    print("  from generate_audit_pdf import generate_audit_pdf, score_audit")
    print("  result = score_audit(answers_from_db)")
    print("  pdf_bytes = generate_audit_pdf(name=..., email=..., **result)")
    print("  # Attach pdf_bytes to Resend email")
