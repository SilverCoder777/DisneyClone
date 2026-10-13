import Link from "next/link";
export default function NotFound() {
  return (
    <main className="auth-page">
      <section className="auth-box">
        <div className="eyebrow">404 · HORS DU SCÉNARIO</div>
        <h1>
          Cette histoire
          <br />
          n’existe pas.
        </h1>
        <Link className="primary" href="/">
          Retour à l’accueil →
        </Link>
      </section>
    </main>
  );
}
