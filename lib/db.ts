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

const DATA_FILE = path.join(process.cwd(), "data", "portfolio.json");

let pool: Pool | null = null;

function getPool(): Pool | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function initDb(): Promise<boolean> {
  const p = getPool();
  if (!p) return false;

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
    `);

    // Check if initial content exists; if not, seed from local JSON
    const res = await p.query(
      `SELECT key FROM portfolio_content WHERE key = 'data' LIMIT 1`
    );
    if (res.rows.length === 0 && fs.existsSync(DATA_FILE)) {
      const localData = JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
      await p.query(
        `INSERT INTO portfolio_content (key, data) VALUES ('data', $1)
         ON CONFLICT (key) DO UPDATE SET data = $1, updated_at = NOW()`,
        [JSON.stringify(localData)]
      );
    }
    return true;
  } catch (err) {
    console.warn("Could not connect to Supabase DB:", err);
    return false;
  }
}

export async function getPortfolioData(): Promise<PortfolioData> {
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
      console.warn("DB query failed, falling back to local storage:", err);
    }
  }

  // Local fallback
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")) as PortfolioData;
    } catch (e) {
      console.error("Error reading data file:", e);
    }
  }

  // Fallback to static data
  const { profile, experience, skills, projects, blogs } = await import(
    "./data"
  );
  return { profile, experience, skills, projects, blogs, messages: [] };
}

export async function savePortfolioData(data: PortfolioData): Promise<boolean> {
  // Always write to local file as backup
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing local data backup:", err);
  }

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
      console.error("Failed saving to Supabase DB:", err);
    }
  }

  return true;
}

export async function saveMessage(msg: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const data = await getPortfolioData();
  data.messages = data.messages || [];
  data.messages.unshift({
    id: Date.now().toString(),
    ...msg,
    created_at: new Date().toISOString(),
  });
  await savePortfolioData(data);

  const p = getPool();
  if (p) {
    try {
      await p.query(
        `INSERT INTO portfolio_messages (name, email, message) VALUES ($1, $2, $3)`,
        [msg.name, msg.email, msg.message]
      );
    } catch (err) {
      console.warn("Could not insert message to DB table:", err);
    }
  }
  return true;
}
