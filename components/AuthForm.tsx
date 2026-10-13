"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import { authenticate } from "@/app/actions";
export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const [state, action, pending] = useActionState(
    authenticate.bind(null, mode),
    { error: "" },
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form action={action} className="auth-form">
      {mode === "signup" && (
        <label>
          Votre prénom
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={24}
            autoComplete="given-name"
            placeholder="Comment vous appeler ?"
          />
        </label>
      )}
      <label>
        Adresse e-mail
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="vous@exemple.fr"
        />
      </label>
      <label>
        Mot de passe
        <input
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={12}
          maxLength={128}
          autoComplete={mode === "signup" ? "new-password" : "current-password"}
          placeholder="12 caractères minimum"
        />
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <button className="primary" disabled={pending}>
        {pending
          ? "Un instant…"
          : mode === "signup"
            ? "Créer mon compte"
            : "Se connecter"}{" "}
        →
      </button>
      <p className="muted">
        {mode === "signup" ? "Déjà un compte ?" : "Première visite ?"}{" "}
        <Link href={mode === "signup" ? "/login" : "/signup"}>
          {mode === "signup" ? "Se connecter" : "Créer un compte"}
        </Link>
      </p>
    </form>
  );
}
