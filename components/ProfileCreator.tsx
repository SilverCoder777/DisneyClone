"use client";
import { useActionState, useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { addProfile } from "@/app/actions";
const avatars = ["✦", "☾", "⚡", "❋", "✿", "☀"];
export default function ProfileCreator() {
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(addProfile, { error: "" });
  useEffect(() => {
    if (!pending && !state.error) setOpen(false);
  }, [pending, state]);
  return (
    <>
      <button className="profile-tile add" onClick={() => setOpen(true)}>
        <div>
          <Plus size={40} />
        </div>
        <span>Ajouter un profil</span>
      </button>
      {open && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-profile"
            className="profile-modal"
          >
            <button
              className="close"
              onClick={() => setOpen(false)}
              aria-label="Fermer"
            >
              <X />
            </button>
            <div className="eyebrow">UN ESPACE PERSONNEL</div>
            <h2 id="new-profile">Nouveau profil</h2>
            <form action={action} className="auth-form">
              <label>
                Nom du profil
                <input
                  name="name"
                  required
                  maxLength={24}
                  autoFocus
                  placeholder="Votre prénom"
                />
              </label>
              <label>
                Avatar
                <select name="avatar">
                  {avatars.map((a, i) => (
                    <option key={i} value={i}>
                      {a} Avatar {i + 1}
                    </option>
                  ))}
                </select>
              </label>
              <label className="checkbox">
                <input type="checkbox" name="kids" /> Profil enfant — catalogue
                adapté (6 ans et moins)
              </label>
              {state.error && (
                <p className="error" role="alert">
                  {state.error}
                </p>
              )}
              <button className="primary" disabled={pending}>
                {pending ? "Création…" : "Créer le profil"}
              </button>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
