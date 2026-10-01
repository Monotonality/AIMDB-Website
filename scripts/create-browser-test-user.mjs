import fs from "node:fs";

const auth = JSON.parse(
  fs.readFileSync(
    "C:/Users/PC/.cursor/projects/c-Adam-Repos-AIMDB-AIMDB-Website/mcp-auth.json",
    "utf8",
  ),
);
const env = fs.readFileSync(".env.local", "utf8");
const url = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)[1].trim();
const token = auth.supabase.tokens.access_token;
const ref = "rkqgcuvmxupyeppefwkt";

const keys = await fetch(`https://api.supabase.com/v1/projects/${ref}/api-keys`, {
  headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
}).then((r) => r.json());

const service = keys.find(
  (k) => k.name === "service_role" || k.tags?.includes("service_role"),
);
if (!service?.api_key) throw new Error("service role key missing");

const headers = {
  apikey: service.api_key,
  Authorization: `Bearer ${service.api_key}`,
  "Content-Type": "application/json",
};

const email = "aimdb-browser-test@utdallas.edu";
const password = "AimdbTest9!";

const created = await fetch(`${url}/auth/v1/admin/users`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    email,
    password,
    email_confirm: true,
  }),
}).then(async (r) => ({ status: r.status, body: await r.json() }));

console.log("create_status", created.status);
console.log("role", created.body?.user?.app_metadata?.role ?? created.body?.app_metadata?.role);
console.log("id", created.body?.user?.id ?? created.body?.id ?? null);
console.log("error", created.body?.error_code || created.body?.msg || created.body?.message || null);
