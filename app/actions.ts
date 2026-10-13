"use server";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { randomUUID } from "node:crypto";
import { db, rateLimit } from "@/lib/db";
import { createSession, requireUser, currentProfile } from "@/lib/auth";
import { hashPassword, verifyPassword, digest } from "@/lib/security.mjs";
import { titles } from "@/lib/catalog";
const dummyPasswordHash = hashPassword("invalid-dummy-password");
export type AuthState = { error: string };
export async function authenticate(
  mode: "signup" | "login",
  _: AuthState,
  form: FormData,
): Promise<AuthState> {
  const email = String(form.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(form.get("password") || "");
  if (email.length > 254 || !/^\S+@\S+\.\S+$/.test(email))
    return { error: "Saisissez une adresse e-mail valide." };
  if (password.length < 12 || password.length > 128)
    return {
      error: "Le mot de passe doit contenir entre 12 et 128 caractères.",
    };
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`auth-ip:${ip}`) || !rateLimit(`auth-email:${email}`))
    return { error: "Trop de tentatives. Réessayez dans 15 minutes." };
  let user = db
    .prepare("SELECT id,password FROM users WHERE email=?")
    .get(email) as { id: string; password: string } | undefined;
  if (mode === "signup") {
    if (user)
      return {
        error: "Impossible de créer ce compte. Essayez de vous connecter.",
      };
    const name = String(form.get("name") || "").trim();
    if (name.length < 1 || name.length > 24)
      return { error: "Le nom du profil doit contenir de 1 à 24 caractères." };
    const id = randomUUID();
    db.exec("BEGIN");
    try {
      db.prepare("INSERT INTO users VALUES(?,?,?,?)").run(
        id,
        email,
        hashPassword(password),
        Date.now(),
      );
      db.prepare("INSERT INTO profiles(id,user_id,name) VALUES(?,?,?)").run(
        randomUUID(),
        id,
        name,
      );
      db.exec("COMMIT");
    } catch {
      db.exec("ROLLBACK");
      return { error: "Impossible de créer le compte. Réessayez." };
    }
    user = { id, password: "" };
  } else {
    const valid = verifyPassword(password, user?.password || dummyPasswordHash);
    if (!user || !valid)
      return { error: "Adresse e-mail ou mot de passe incorrect." };
  }
  await createSession(user.id);
  redirect("/profiles");
}
export async function logout() {
  const jar = await cookies();
  const token = jar.get("session")?.value;
  if (token)
    db.prepare("DELETE FROM sessions WHERE token=?").run(digest(token));
  jar.delete("session");
  jar.delete("profile");
  redirect("/login");
}
export async function selectProfile(form: FormData) {
  const user = await requireUser();
  const id = String(form.get("id"));
  if (
    !db
      .prepare("SELECT id FROM profiles WHERE id=? AND user_id=?")
      .get(id, user.id)
  )
    throw new Error("Profil inaccessible");
  (await cookies()).set("profile", id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 86400,
  });
  redirect("/browse");
}
export async function addProfile(
  _: AuthState,
  form: FormData,
): Promise<AuthState> {
  const user = await requireUser();
  const name = String(form.get("name") || "").trim();
  if (!name || name.length > 24)
    return { error: "Choisissez un nom de 1 à 24 caractères." };
  const count = db
    .prepare("SELECT COUNT(*) AS n FROM profiles WHERE user_id=?")
    .get(user.id) as { n: number };
  if (count.n >= 7) return { error: "Vous pouvez créer jusqu’à 7 profils." };
  const avatar = Math.min(
    5,
    Math.max(0, Math.floor(Number(form.get("avatar")) || 0)),
  );
  db.prepare("INSERT INTO profiles VALUES(?,?,?,?,?)").run(
    randomUUID(),
    user.id,
    name,
    avatar,
    form.get("kids") === "on" ? 1 : 0,
  );
  revalidatePath("/profiles");
  return { error: "" };
}
export async function deleteProfile(form: FormData) {
  const user = await requireUser();
  const count = db
    .prepare("SELECT COUNT(*) AS n FROM profiles WHERE user_id=?")
    .get(user.id) as { n: number };
  if (count.n <= 1) return;
  db.prepare("DELETE FROM profiles WHERE id=? AND user_id=?").run(
    String(form.get("id")),
    user.id,
  );
  revalidatePath("/profiles");
}
export async function toggleFavorite(id: string) {
  const p = await currentProfile();
  const title = titles.find((t) => t.id === id);
  if (!title || (p.kids && title.age > 6))
    throw new Error("Titre inaccessible");
  const exists = db
    .prepare("SELECT 1 FROM favorites WHERE profile_id=? AND title_id=?")
    .get(p.id, id);
  if (exists)
    db.prepare("DELETE FROM favorites WHERE profile_id=? AND title_id=?").run(
      p.id,
      id,
    );
  else db.prepare("INSERT INTO favorites VALUES(?,?)").run(p.id, id);
  revalidatePath("/browse");
  return !exists;
}
