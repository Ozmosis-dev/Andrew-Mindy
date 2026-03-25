/**
 * One-time setup: registers all contact property schemas in Resend
 * and confirms all 3 audience IDs.
 *
 * Run: node scripts/create-audiences.mjs
 *
 * Properties in Resend are GLOBAL (not per-audience) — define them once,
 * use them across all audiences.
 */

import { Resend } from 'resend';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Read RESEND_API_KEY from .env.local
let RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
    try {
        const envPath = resolve(__dirname, '../.env.local');
        const envFile = readFileSync(envPath, 'utf-8');
        for (const line of envFile.split('\n')) {
            const match = line.match(/^RESEND_API_KEY=(.+)$/);
            if (match) { RESEND_API_KEY = match[1].trim(); break; }
        }
    } catch { }
}

if (!RESEND_API_KEY) {
    console.error('❌ RESEND_API_KEY not found in .env.local');
    process.exit(1);
}

const resend = new Resend(RESEND_API_KEY);

// ─── All contact property schemas (global across all audiences) ───────────────

const ALL_PROPERTIES = [
    // Growth Brief
    { key: 'score', type: 'number' },
    { key: 'tier', type: 'string' },
    { key: 'priority_category', type: 'string' },
    { key: 'cat_sales', type: 'number' },
    { key: 'cat_brand', type: 'number' },
    { key: 'cat_leads', type: 'number' },
    { key: 'cat_workflows', type: 'number' },
    { key: 'cat_marketing', type: 'number' },
    { key: 'cat_growth', type: 'number' },
    { key: 'audit_date', type: 'string' },
    // Project Intake
    { key: 'services', type: 'string' },
    { key: 'budget', type: 'string' },
    { key: 'timeline', type: 'string' },
    { key: 'company', type: 'string' },
    { key: 'decision_maker', type: 'string' },
    { key: 'intake_date', type: 'string' },
    // General Contact
    { key: 'service_interest', type: 'string' },
    { key: 'contact_pref', type: 'string' },
    { key: 'contact_date', type: 'string' },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

async function run() {
    // 1. List existing audiences
    const { data: listData, error: listError } = await resend.audiences.list();
    if (listError) {
        console.error('❌ Could not list audiences:', listError.message);
        process.exit(1);
    }

    const existing = listData.data;
    console.log(`\n📋 Existing audiences (${existing.length}/3 on free plan):\n`);
    existing.forEach(a => console.log(`  • ${a.name} — ${a.id}`));

    // 2. List existing properties to avoid duplicates
    const { data: propListData } = await resend.contactProperties.list();
    const existingKeys = new Set((propListData?.data ?? []).map(p => p.key));
    console.log(`\n🔑 Existing properties: [${[...existingKeys].join(', ') || 'none'}]`);

    // 3. Register missing properties (with rate-limit spacing)
    console.log('\n🔧 Registering missing contact properties...\n');

    for (const { key, type } of ALL_PROPERTIES) {
        if (existingKeys.has(key)) {
            console.log(`  ✓ ${key} (already registered)`);
            continue;
        }

        await sleep(250); // Stay under 5 req/s rate limit
        const { data, error } = await resend.contactProperties.create({ key, type });
        if (error) {
            console.log(`  ❌ ${key}: ${error.message}`);
        } else {
            console.log(`  ✅ ${key} (${type}) — id: ${data.id}`);
        }
    }

    // 4. Print final env var map
    const growthBrief = existing.find(a => a.name === 'Growth Brief');
    const intake = existing.find(a => a.name === 'Project Intake');
    const contact = existing.find(a => a.name === 'General');

    console.log('\n─────────────────────────────────────────');
    console.log('📋 Audience IDs (confirm these match .env.local):\n');
    if (growthBrief) console.log(`RESEND_AUDIENCE_GROWTH_BRIEF_ID=${growthBrief.id}`);
    if (intake) console.log(`RESEND_AUDIENCE_INTAKE_ID=${intake.id}`);
    if (contact) console.log(`RESEND_AUDIENCE_CONTACT_ID=${contact.id}`);
    console.log('\n─────────────────────────────────────────');
    console.log('\n✅ Setup complete! Contact properties are now registered globally.');
    console.log('📌 Each form submission will now populate properties in the correct audience.\n');
}

run().catch(err => {
    console.error('Fatal:', err);
    process.exit(1);
});
