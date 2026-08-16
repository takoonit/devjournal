import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

test("publishing ownership is explicit and anonymous projects require public entries", () => {
    const schema = read("supabase/schema.sql");
    const migration = read("supabase/migrations/202608100001_publishing_source_ids.sql");

    expect(schema).not.toMatch(/seed_owner_on_first_signup|auto_seed_owner/);
    expect(migration).toMatch(/drop trigger if exists seed_owner_on_first_signup/);
    expect(migration).toMatch(/owner_settings_single_owner/);
    expect(`${schema}\n${migration}`).toMatch(/exists\s*\([\s\S]*entries[\s\S]*is_public\s*=\s*true/);
});
