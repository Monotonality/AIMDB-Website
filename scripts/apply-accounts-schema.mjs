import fs from "node:fs";
import path from "node:path";

const AUTH_PATH =
  "C:/Users/PC/.cursor/projects/c-Adam-Repos-AIMDB-AIMDB-Website/mcp-auth.json";
const REF = "rkqgcuvmxupyeppefwkt";
const ROOT = path.resolve(import.meta.dirname, "..");

const auth = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8"));
const token = auth.supabase.tokens.access_token;
const headers = {
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
  "Content-Type": "application/json",
};

async function api(pathname, options = {}) {
  const res = await fetch(`https://api.supabase.com/v1${pathname}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  if (!res.ok) {
    const detail =
      typeof json === "string" ? json.slice(0, 2000) : JSON.stringify(json).slice(0, 2000);
    throw new Error(`${options.method ?? "GET"} ${pathname} ${res.status}: ${detail}`);
  }
  return json;
}

async function query(sql) {
  return api(`/projects/${REF}/database/query`, {
    method: "POST",
    body: JSON.stringify({ query: sql }),
  });
}

const tables = await query(`
  select table_schema, table_name
  from information_schema.tables
  where table_schema in ('public', 'private')
  order by table_schema, table_name;
`);
console.log("existing_tables", JSON.stringify(tables));

const profilesExists = Array.isArray(tables)
  ? tables.some((row) => row.table_schema === "public" && row.table_name === "profiles")
  : JSON.stringify(tables).includes("profiles");

if (!profilesExists) {
  const sql = fs.readFileSync(
    path.join(ROOT, "supabase/migrations/20261001120000_accounts.sql"),
    "utf8",
  );
  const result = await query(sql);
  console.log("migration_applied", Array.isArray(result) ? "ok" : JSON.stringify(result).slice(0, 500));
} else {
  console.log("migration_skipped", "profiles already exists");
}

const after = await query(`
  select table_name
  from information_schema.tables
  where table_schema = 'public'
    and table_name in ('profiles', 'applications')
  order by table_name;
`);
console.log("public_tables", JSON.stringify(after));

const triggers = await query(`
  select event_object_schema, event_object_table, trigger_name
  from information_schema.triggers
  where trigger_name in (
    'enforce_edu_email',
    'before_user_created_set_role',
    'on_auth_user_created',
    'complete_application'
  )
  order by trigger_name;
`);
console.log("triggers", JSON.stringify(triggers));

const keys = await api(`/projects/${REF}/api-keys`);
const publishable =
  keys.find((k) => k.type === "publishable" || k.name === "anon" || k.tags?.includes("anon")) ??
  keys.find((k) => k.type === "legacy" && (k.name === "anon" || k.tags?.includes("anon")));

if (!publishable?.api_key) {
  console.log(
    "key_shapes",
    JSON.stringify(
      keys.map((k) => ({
        id: k.id,
        name: k.name,
        type: k.type,
        tags: k.tags,
        hasKey: Boolean(k.api_key),
      })),
    ),
  );
  throw new Error("Could not find publishable/anon key");
}

const env = [
  `NEXT_PUBLIC_SUPABASE_URL=https://${REF}.supabase.co`,
  `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable.api_key}`,
  `NEXT_PUBLIC_SITE_URL=http://localhost:3000`,
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, ".env.local"), env, { encoding: "utf8" });
console.log("env_written", true);
console.log("key_type", publishable.type ?? publishable.name);
