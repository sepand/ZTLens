#!/usr/bin/env node
/**
 * Pulls vendor listings from public cloud marketplace catalogs and writes
 * data/vendors.yaml, grouped by ZTLens' 7 DoD ZT RA 2.0 pillars.
 *
 * Sources, merged per pillar with live results winning ties over
 * curated/manual fallbacks (see the merge order comment in main()):
 *   - AWS Marketplace Discovery API — requires AWS credentials for an
 *     IAM user/role with ONLY aws-marketplace:SearchFacets and
 *     aws-marketplace:SearchListings (see aws-iam-policy.json); self-
 *     serve, no AWS approval needed. Category IDs are discovered live
 *     via SearchFacets, then matched to pillars by keyword against the
 *     category display name.
 *   - Azure Marketplace Catalog API (optional) — requires an X-API-Key
 *     generated via an Azure Resource Manager call, which itself
 *     requires enrolling the subscription in the "Discovery Api Key
 *     Early Access" preview feature (Azure Portal → Preview features;
 *     approval may require an Azure support ticket). Skipped silently
 *     if AZURE_MARKETPLACE_API_KEY isn't set.
 *   - Google Cloud Marketplace has no public category-search API as of
 *     this writing — its Consumer/Partner Procurement APIs cover only
 *     orders, entitlements, and license pools, with no products.list or
 *     search resource (verified against Google's own REST resource
 *     tree). Revisit if Google publishes one. In the meantime,
 *     manual-vendors.yaml carries a small hand-curated GCP Marketplace
 *     seed list that's merged in on every run and untouched by the
 *     automated fetch.
 *   - curated-enterprise-vendors.yaml — a cloud-agnostic floor list of
 *     vendors widely deployed by large enterprises, merged in last and
 *     never subject to the live-results cap, so well-known names can't
 *     get crowded out by whatever the live marketplace search happens
 *     to surface (rating/relevance sort doesn't reliably track "which
 *     vendors enterprises actually use").
 *
 * Run by .github/workflows/sync-vendors.yml on a schedule. This script
 * only ever reads from marketplace APIs and writes data/vendors.yaml —
 * it never touches the website's own dependencies.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { load as parseYaml, dump as dumpYaml } from 'js-yaml';
import {
  MarketplaceDiscoveryClient,
  SearchFacetsCommand,
  SearchListingsCommand,
} from '@aws-sdk/client-marketplace-discovery';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..', '..');
const KEYWORDS_PATH = path.join(__dirname, 'pillar-keywords.yaml');
const MANUAL_VENDORS_PATH = path.join(__dirname, 'manual-vendors.yaml');
const CURATED_VENDORS_PATH = path.join(__dirname, 'curated-enterprise-vendors.yaml');
const OUTPUT_PATH = path.join(REPO_ROOT, 'data', 'vendors.yaml');
const MAX_LIVE_VENDORS_PER_PILLAR = 20; // cap on AWS/Azure results only
const SEARCH_RESULTS_PER_CATEGORY = 25; // AWS SearchListings page size per matched category

const PILLAR_IDS = {
  User: 'user',
  Device: 'device',
  'Application & Workload': 'application-workload',
  Data: 'data',
  'Network & Environment': 'network-environment',
  'Automation & Orchestration': 'automation-orchestration',
  'Visibility & Analytics': 'visibility-analytics',
};

function loadKeywords() {
  return parseYaml(readFileSync(KEYWORDS_PATH, 'utf8'));
}

function loadManualVendors() {
  return parseYaml(readFileSync(MANUAL_VENDORS_PATH, 'utf8'));
}

function loadCuratedVendors() {
  return parseYaml(readFileSync(CURATED_VENDORS_PATH, 'utf8'));
}

function dedupeVendors(vendors) {
  const seen = new Set();
  const out = [];
  for (const v of vendors) {
    const key = (v.publisher + '|' + v.name).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}

// Best-effort classification of a live marketplace listing into one of
// the 6 NIST CSF 2.0 functions, so live results can slot into the same
// per-function columns as the curated/manual entries (which are
// hand-assigned). There's no function signal in the marketplace APIs
// themselves, so this is a keyword heuristic over the category name and
// listing text — checked in this order because a listing can plausibly
// match several; more specific functions are checked before falling
// back to 'protect', which is the most common primary framing for
// security marketplace listings in general.
const FUNCTION_KEYWORDS = {
  recover: ['backup', 'disaster recovery', 'recovery', 'restore', 'resilience'],
  respond: ['orchestration', 'soar', 'incident response', 'response', 'remediation', 'playbook'],
  govern: ['governance', 'policy management', 'compliance management', 'risk management', 'audit'],
  identify: ['inventory', 'discovery', 'asset management', 'vulnerability', 'posture management', 'assessment', 'scanning'],
  detect: ['detection', 'siem', 'analytics', 'monitoring', 'threat intelligence', 'anomaly', 'xdr', 'edr', 'observability'],
};
const FUNCTION_CHECK_ORDER = ['recover', 'respond', 'govern', 'identify', 'detect'];
const DEFAULT_FUNCTION = 'protect';

function classifyFunction(text) {
  const lower = (text || '').toLowerCase();
  for (const fn of FUNCTION_CHECK_ORDER) {
    if (FUNCTION_KEYWORDS[fn].some((k) => lower.includes(k))) return fn;
  }
  return DEFAULT_FUNCTION;
}

// ---------- AWS Marketplace ----------

async function fetchAwsVendors(pillarKeywords) {
  if (!process.env.AWS_ACCESS_KEY_ID && !process.env.AWS_ROLE_ARN) {
    console.log('AWS: no credentials found in env, skipping AWS Marketplace source.');
    return {};
  }

  const client = new MarketplaceDiscoveryClient({ region: process.env.AWS_REGION || 'us-east-1' });

  console.log('AWS: discovering available categories via SearchFacets...');
  const facets = await client.send(
    new SearchFacetsCommand({ facetTypes: ['CATEGORY'] })
  );
  const categories = facets.listingFacets?.CATEGORY || [];
  console.log(`AWS: found ${categories.length} categories.`);

  const results = {};

  for (const [pillar, cfg] of Object.entries(pillarKeywords)) {
    const keywords = (cfg.aws || []).map((k) => k.toLowerCase());
    const matched = categories.filter((c) =>
      keywords.some((k) => (c.displayName || '').toLowerCase().includes(k))
    );
    if (!matched.length) {
      console.log(`AWS: no category matched pillar "${pillar}", skipping.`);
      continue;
    }

    const pillarVendors = [];
    for (const cat of matched) {
      try {
        // RELEVANCE rather than rating: rating-sort buries enterprise
        // vendors whose deals go through private offers and rarely
        // accumulate public marketplace reviews.
        const res = await client.send(
          new SearchListingsCommand({
            filters: [{ filterType: 'CATEGORY', filterValues: [cat.value] }],
            maxResults: SEARCH_RESULTS_PER_CATEGORY,
            sortBy: 'RELEVANCE',
            sortOrder: 'DESCENDING',
          })
        );
        for (const listing of res.listingSummaries || []) {
          pillarVendors.push({
            name: listing.listingName,
            publisher: listing.publisher?.displayName || 'Unknown',
            category: cat.displayName,
            function: classifyFunction(`${cat.displayName} ${listing.listingName} ${listing.shortDescription || ''}`),
            source: 'aws-marketplace',
            url: listing.listingId ? `https://aws.amazon.com/marketplace/pp/${listing.listingId}` : undefined,
          });
        }
      } catch (err) {
        console.warn(`AWS: SearchListings failed for category "${cat.displayName}": ${err.message}`);
      }
    }
    results[pillar] = dedupeVendors(pillarVendors).slice(0, MAX_LIVE_VENDORS_PER_PILLAR);
    console.log(`AWS: pillar "${pillar}" -> ${results[pillar].length} vendors (across ${matched.length} matched categories).`);
  }

  return results;
}

// ---------- Azure Marketplace (optional, best-effort) ----------

async function fetchAzureVendors(pillarKeywords) {
  const apiKey = process.env.AZURE_MARKETPLACE_API_KEY;
  if (!apiKey) {
    console.log(
      'Azure: AZURE_MARKETPLACE_API_KEY not set, skipping. Enroll the subscription in the ' +
        '"Discovery Api Key Early Access" preview feature (Azure Portal -> Preview features), ' +
        'then generate a key via POST /subscriptions/{id}/providers/Microsoft.Marketplace/keys/{alias}/create ' +
        '(see README.md).'
    );
    return {};
  }

  const results = {};
  for (const [pillar, cfg] of Object.entries(pillarKeywords)) {
    const categoryIds = cfg.azureCategoryIds || [];
    if (!categoryIds.length) continue;
    try {
      const filter = categoryIds.map((id) => `categoryIds/any(c: c eq '${id}')`).join(' or ');
      const url =
        'https://catalogapi.azure.com/products?api-version=2023-05-01-preview' +
        `&language=en&market=US&select=displayName,publisherDisplayName,categoryIds` +
        `&filter=${encodeURIComponent(filter)}`;
      const res = await fetch(url, { headers: { 'X-API-Key': apiKey } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const pillarVendors = (data.items || []).map((p) => ({
        name: p.displayName,
        publisher: p.publisherDisplayName || 'Unknown',
        category: (p.categoryIds || [])[0],
        function: classifyFunction(`${(p.categoryIds || []).join(' ')} ${p.displayName}`),
        source: 'azure-marketplace',
      }));
      results[pillar] = dedupeVendors(pillarVendors).slice(0, MAX_LIVE_VENDORS_PER_PILLAR);
      console.log(`Azure: pillar "${pillar}" -> ${results[pillar].length} vendors.`);
    } catch (err) {
      console.warn(`Azure: fetch failed for pillar "${pillar}": ${err.message}`);
    }
  }
  return results;
}

// ---------- Main ----------

async function main() {
  const pillarKeywords = loadKeywords();
  const manualVendors = loadManualVendors();
  const curatedVendors = loadCuratedVendors();

  const [awsResults, azureResults] = await Promise.all([
    fetchAwsVendors(pillarKeywords).catch((err) => {
      console.warn('AWS Marketplace source failed entirely:', err.message);
      return {};
    }),
    fetchAzureVendors(pillarKeywords).catch((err) => {
      console.warn('Azure Marketplace source failed entirely:', err.message);
      return {};
    }),
  ]);

  const sourcesUsed = new Set();
  const pillarVendorLists = Object.keys(pillarKeywords).map((pillar) => {
    // Live results (AWS/Azure) go first so their more specific,
    // verified listing URLs win over a curated fallback when the same
    // vendor shows up in both. GCP's manual list goes next since GCP
    // has no live source at all. The curated-enterprise floor list is
    // deduped in LAST and is never subject to the live cap below — it
    // exists specifically so well-known enterprise vendors can't get
    // pushed out by whatever the live search happens to surface, which
    // would defeat its purpose as a guaranteed floor.
    const live = dedupeVendors([...(awsResults[pillar] || []), ...(azureResults[pillar] || [])]);
    const withManual = dedupeVendors([...live, ...(manualVendors[pillar] || [])]);
    const combined = dedupeVendors([...withManual, ...(curatedVendors[pillar] || [])]);
    combined.forEach((v) => sourcesUsed.add(v.source));
    return { id: PILLAR_IDS[pillar], pillar, vendors: combined };
  });

  const generatedAt = new Date().toISOString();
  const sources = Array.from(sourcesUsed).sort();
  const disclaimer =
    'Identified from public marketplace category listings. Presence here is not a certification, partnership, or endorsement by ZTLens.';

  // generated_at/sources/disclaimer are duplicated onto every pillar entry
  // (not just once at the top level) so the Astro content collection —
  // which only sees the `pillars` array — can read them without a second
  // raw file read (import.meta.url doesn't map back to source-relative
  // paths once Vite bundles the page for the production build).
  const pillars = pillarVendorLists.map((p) => ({ ...p, generated_at: generatedAt, sources, disclaimer }));

  const header = `# Auto-generated by scripts/vendor-sync — do not hand-edit.\n# Regenerate with: cd scripts/vendor-sync && npm ci && npm run sync\n# Edit scripts/vendor-sync/pillar-keywords.yaml to change category matching.\n\n`;

  const yamlBody = dumpYaml(
    { generated_at: generatedAt, sources, disclaimer, pillars },
    { lineWidth: 100, noRefs: true }
  );

  writeFileSync(OUTPUT_PATH, header + yamlBody, 'utf8');
  console.log(`\nWrote ${OUTPUT_PATH}`);
  console.log(`Sources used: ${Array.from(sourcesUsed).join(', ') || '(none — no credentials configured)'}`);
}

main().catch((err) => {
  console.error('Vendor sync failed:', err);
  process.exit(1);
});
