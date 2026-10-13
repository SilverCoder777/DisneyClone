import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { randomBytes } from "node:crypto";
import { db, type Profile } from "./db";
import { digest } from "./security.mjs";
export async function getUser() {
  const token = (await cookies()).get("session")?.value;
  if (!token) return null;
  return db
    .prepare(
      "SELECT users.id,users.email FROM sessions JOIN users ON users.id=sessions.user_id WHERE sessions.token=? AND sessions.expires>?",
    )
    .get(digest(token), Date.now()) as
    { id: string; email: string } | undefined;
}
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/login");
  return user;
}
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  db.prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
  db.prepare("INSERT INTO sessions VALUES(?,?,?)").run(
    digest(token),
    userId,
    Date.now() + 7 * 86400000,
  );
  const jar = await cookies();
  jar.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  });
  jar.delete("profile");
}
export async function currentProfile() {
  const user = await requireUser();
  const id = (await cookies()).get("profile")?.value;
  const p = db
    .prepare("SELECT * FROM profiles WHERE id=? AND user_id=?")
    .get(id || "", user.id) as Profile | undefined;
  if (!p) redirect("/profiles");
  return p;
}
