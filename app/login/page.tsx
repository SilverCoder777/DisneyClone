import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import Logo from "@/components/Logo";
import AuthForm from "@/components/AuthForm";
export default async function Login() {
  if (await getUser()) redirect("/profiles");
  return (
    <main className="auth-page">
      <Logo />
      <section className="auth-box">
        <div className="eyebrow">VOTRE PROCHAINE HISTOIRE VOUS ATTEND</div>
        <h1>
          Bon retour
          <br />
          <em>parmi nous.</em>
        </h1>
        <p className="muted">
          Connectez-vous pour retrouver vos profils et votre liste.
        </p>
        <AuthForm mode="login" />
      </section>
      <p className="legal">
        Démonstration indépendante · Aucun compte Disney officiel
      </p>
    </main>
  );
}
