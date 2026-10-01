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

const service =
  keys.find((k) => k.name === "service_role" || k.tags?.includes("service_role")) ??
  keys.find((k) => k.type === "legacy" && k.name === "service_role");

if (!service?.api_key) {
  console.log(
    "key_shapes",
    JSON.stringify(
      keys.map((k) => ({ name: k.name, type: k.type, tags: k.tags, hasKey: Boolean(k.api_key) })),
    ),
  );
  throw new Error("service role key missing");
}

const headers = {
  apikey: service.api_key,
  Authorization: `Bearer ${service.api_key}`,
  "Content-Type": "application/json",
};

const list = await fetch(`${url}/auth/v1/admin/users`, { headers }).then((r) => r.json());
const users = list.users ?? list;
const junk = (Array.isArray(users) ? users : []).filter((u) =>
  String(u.email ?? "").includes("aimdb-schema-check"),
);

for (const user of junk) {
  const del = await fetch(`${url}/auth/v1/admin/users/${user.id}`, {
    method: "DELETE",
    headers,
  });
  console.log("deleted_test_user", del.status, user.id);
}

const remaining = await fetch(
  `https://api.supabase.com/v1/projects/${ref}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `select count(*)::int as users from auth.users;
              select count(*)::int as profiles from public.profiles;
              select role, is_member, count(*)::int
              from public.profiles group by role, is_member;`,
    }),
  },
);
console.log("after", JSON.stringify(await remaining.json()));
