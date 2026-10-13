"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="auth-page">
      <section className="auth-box">
        <h1>
          Un petit
          <br />
          contretemps.
        </h1>
        <p className="muted">
          Nous n’avons pas pu charger cette page. Réessayez dans un instant.
        </p>
        <button className="primary" onClick={reset}>
          Réessayer
        </button>
      </section>
    </main>
  );
}
