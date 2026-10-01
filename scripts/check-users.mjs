import fs from "node:fs";

const auth = JSON.parse(
  fs.readFileSync(
    "C:/Users/PC/.cursor/projects/c-Adam-Repos-AIMDB-AIMDB-Website/mcp-auth.json",
    "utf8",
  ),
);
const token = auth.supabase.tokens.access_token;
const ref = "rkqgcuvmxupyeppefwkt";

const r = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `
      select u.email, u.raw_app_meta_data->>'role' as app_role,
             p.role, p.is_member
      from auth.users u
      join public.profiles p on p.id = u.id
      order by u.created_at;
    `,
  }),
});
console.log(JSON.stringify(await r.json(), null, 2));
