// Usage: node scripts/run-sql.mjs <file.sql>
import fs from "node:fs";

const AUTH_PATH =
  "C:/Users/PC/.cursor/projects/c-Adam-Repos-AIMDB-AIMDB-Website/mcp-auth.json";
const REF = "rkqgcuvmxupyeppefwkt";

const file = process.argv[2];
if (!file) throw new Error("Pass a .sql file path.");

const token = JSON.parse(fs.readFileSync(AUTH_PATH, "utf8")).supabase.tokens
  .access_token;

const res = await fetch(
  `https://api.supabase.com/v1/projects/${REF}/database/query`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: fs.readFileSync(file, "utf8") }),
  },
);

const text = await res.text();
console.log(res.status, text);
if (!res.ok) process.exit(1);
