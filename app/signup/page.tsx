import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
export default async function Signup() {
  if (await getUser()) redirect("/profiles");
  return (
    <main className="auth-page">
      <Logo />
      <section className="auth-box">
        <div className="eyebrow">UN UNIVERS À VOUS</div>
        <h1>
          La magie
          <br />
          <em>commence ici.</em>
        </h1>
        <p className="muted">
          Créez gratuitement votre espace et votre premier profil.
        </p>
        <AuthForm mode="signup" />
      </section>
      <p className="legal">
        Utilisez un mot de passe unique pour cette démonstration.
      </p>
    </main>
  );
}
