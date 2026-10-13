import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
const folder = process.env.DATA_DIR || path.join(process.cwd(), ".data");
mkdirSync(folder, { recursive: true });
const globalDb = globalThis as unknown as { disneyDb?: DatabaseSync };
export const db =
  globalDb.disneyDb ?? new DatabaseSync(path.join(folder, "app.sqlite"));
if (process.env.NODE_ENV !== "production") globalDb.disneyDb = db;
db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
CREATE TABLE IF NOT EXISTS users(id TEXT PRIMARY KEY,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS profiles(id TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,name TEXT NOT NULL,avatar INTEGER NOT NULL DEFAULT 0,kids INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS sessions(token TEXT PRIMARY KEY,user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS favorites(profile_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,title_id TEXT NOT NULL,PRIMARY KEY(profile_id,title_id));
CREATE TABLE IF NOT EXISTS attempts(key TEXT PRIMARY KEY,count INTEGER NOT NULL,expires INTEGER NOT NULL);`);
export type Profile = {
  id: string;
  user_id: string;
  name: string;
  avatar: number;
  kids: number;
};
export function rateLimit(key: string) {
  const now = Date.now();
  db.prepare("DELETE FROM attempts WHERE expires < ?").run(now);
  db.prepare(
    "INSERT INTO attempts(key,count,expires) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
  ).run(key, now + 15 * 60 * 1000);
  const row = db.prepare("SELECT count FROM attempts WHERE key=?").get(key) as {
    count: number;
  };
  return row.count <= 15;
}
