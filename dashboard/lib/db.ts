import fs from "fs";
import path from "path";
import { Pool } from "pg";

export interface PortfolioData {
  profile: any;
  experience: any[];
  skills: any[];
  projects: any[];
  blogs: any[];
  messages: any[];
}

function getDataFilePath(): string {
  const p1 = path.resolve(process.cwd(), "..", "data", "portfolio.json");
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), "data", "portfolio.json");
  if (fs.existsSync(p2)) return p2;
  return p1;
}

let pool: Pool | null = null;

export function getConnectionString(): string | undefined {
  return process.env.DATABASE_URL;
}

export function getPool(customConnStr?: string): Pool | null {
  const connectionString = customConnStr || process.env.DATABASE_URL;
  if (!connectionString) return null;

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
}

export async function testConnection(connStr: string): Promise<{ success: boolean; message: string }> {
  const p = getPool(connStr);
  if (!p) return { success: false, message: "Missing connection string" };

  try {
    const res = await p.query("SELECT NOW() as now");
    await p.end();
    return { success: true, message: `Connected to PostgreSQL successfully at ${res.rows[0].now}` };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed connecting to database" };
  }
}

export async function syncToSupabase(connStr: string): Promise<{ success: boolean; message: string }> {
  const p = getPool(connStr);
  if (!p) return { success: false, message: "Missing connection string" };

  try {
    await p.query(`
      CREATE TABLE IF NOT EXISTS portfolio_content (
        key VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE TABLE IF NOT EXISTS portfolio_messages (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
          INSERT INTO storage.buckets (id, name, public)
          VALUES ('portfolio-assets', 'portfolio-assets', true)
          ON CONFLICT (id) DO NOTHING;
          INSERT INTO storage.buckets (id, name, public)
          VALUES ('resumes', 'resumes', true)
          ON CONFLICT (id) DO NOTHING;
        END IF;
      END $$;
    `);

    const data = await getDashboardData();
    await p.query(
      `INSERT INTO portfolio_content (key, data) VALUES ('data', $1)
       ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW()`,
      [JSON.stringify(data)]
    );

    await p.end();

    // Persist DATABASE_URL to .env.local in root and dashboard
    try {
      const rootEnv = path.resolve(process.cwd(), "..", ".env.local");
      fs.writeFileSync(rootEnv, `DATABASE_URL="${connStr}"\n`, "utf8");
      const dashEnv = path.resolve(process.cwd(), ".env.local");
      fs.writeFileSync(dashEnv, `DATABASE_URL="${connStr}"\n`, "utf8");
    } catch (e) {
      console.warn("Could not persist to .env.local:", e);
    }

    return { success: true, message: "All portfolio content, experiences, projects, skills, and blogs successfully synced to Supabase! Connection saved to .env.local." };
  } catch (err: any) {
    return { success: false, message: err.message || "Sync failed" };
  }
}

export async function getDashboardData(): Promise<PortfolioData> {
  const p = getPool();
  if (p) {
    try {
      const res = await p.query(
        `SELECT data FROM portfolio_content WHERE key = 'data' LIMIT 1`
      );
      if (res.rows.length > 0) {
        return res.rows[0].data as PortfolioData;
      }
    } catch (err) {
      console.warn("DB query failed, falling back to local file:", err);
    }
  }

  // Fallback to local storage
  const dataPath = getDataFilePath();
  if (fs.existsSync(dataPath)) {
    try {
      return JSON.parse(fs.readFileSync(dataPath, "utf8")) as PortfolioData;
    } catch (e) {
      console.error("Error reading data file:", e);
    }
  }

  return {
    profile: {},
    experience: [],
    skills: [],
    projects: [],
    blogs: [],
    messages: []
  };
}

export async function saveDashboardData(data: PortfolioData): Promise<boolean> {
  // Save local JSON file
  try {
    const dataPath = getDataFilePath();
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing data backup:", err);
  }

  // Save to DB if pool configured
  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO portfolio_content (key, data) VALUES ('data', $1)
         ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW()`,
        [JSON.stringify(data)]
      );
      return true;
    } catch (err) {
      console.error("Failed saving to DB:", err);
    }
  }

  return true;
}

// ------------------------------------------------------------------
// Contact messages — stored apart from the content blob (see portfolio lib/db.ts)
// ------------------------------------------------------------------
export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

function getMessagesFilePath(): string {
  return path.join(path.dirname(getDataFilePath()), "messages.json");
}

export async function getMessages(): Promise<ContactMessage[]> {
  const p = getPool();
  if (p) {
    try {
      const res = await p.query(
        `SELECT id::text AS id, name, email, message, created_at
         FROM portfolio_messages ORDER BY created_at DESC LIMIT 500`
      );
      return res.rows.map((r) => ({
        ...r,
        created_at: new Date(r.created_at).toISOString(),
      }));
    } catch (err: any) {
      // Table doesn't exist until the first message arrives
      if (err?.code === "42P01") return [];
      console.error("Failed loading messages:", err);
      throw err;
    } finally {
      await p.end();
    }
  }

  const file = getMessagesFilePath();
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as ContactMessage[];
}

export async function deleteMessage(id: string): Promise<boolean> {
  const p = getPool();
  if (p) {
    try {
      const res = await p.query(`DELETE FROM portfolio_messages WHERE id = $1`, [Number(id)]);
      return (res.rowCount ?? 0) > 0;
    } finally {
      await p.end();
    }
  }

  const file = getMessagesFilePath();
  if (!fs.existsSync(file)) return false;
  const all = JSON.parse(fs.readFileSync(file, "utf8")) as ContactMessage[];
  const next = all.filter((m) => m.id !== id);
  fs.writeFileSync(file, JSON.stringify(next, null, 2), "utf8");
  return next.length !== all.length;
}
