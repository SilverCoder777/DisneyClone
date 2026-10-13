import Link from "next/link";
import Logo from "@/components/Logo";
import { requireUser } from "@/lib/auth";
import { logout } from "@/app/actions";
export default async function Account() {
  const user = await requireUser();
  return (
    <main className="auth-page">
      <Logo />
      <section className="auth-box">
        <div className="eyebrow">VOTRE ESPACE</div>
        <h1>Mon compte</h1>
        <p className="muted">Connecté avec</p>
        <p className="account-email">{user.email}</p>
        <div className="account-links">
          <Link className="secondary" href="/profiles">
            Gérer mes profils →
          </Link>
          <Link className="secondary" href="/browse">
            Retour au catalogue →
          </Link>
          <form action={logout}>
            <button className="primary">Se déconnecter</button>
          </form>
        </div>
        <p className="muted">
          Compte de démonstration gratuit. Aucun abonnement ni paiement.
        </p>
      </section>
    </main>
  );
}
