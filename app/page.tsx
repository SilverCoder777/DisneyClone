import Link from "next/link";
import Logo from "@/components/Logo";
import { getUser } from "@/lib/auth";
import { artwork, titles } from "@/lib/catalog";
export default async function Home() {
  const user = await getUser();
  return (
    <>
      <header className="landing-nav">
        <Logo />
        <Link href={user ? "/profiles" : "/login"} className="secondary">
          {user ? "Mon espace" : "Se connecter"}
        </Link>
      </header>
      <main>
        <section
          className="landing-hero"
          style={{
            backgroundImage: `linear-gradient(90deg,#090d19 8%,#090d19bb 45%,#090d1940),linear-gradient(0deg,#090d19,transparent 60%),url('${artwork("cinema", 2400)}')`,
          }}
        >
          <div className="eyebrow">
            <span className="glow-dot" /> LES HISTOIRES NOUS RASSEMBLENT
          </div>
          <h1>
            Un monde
            <br />
            d’histoires.
            <br />
            <em>À explorer.</em>
          </h1>
          <p>
            Les univers que vous aimez.
            <br />
            Un espace qui vous ressemble.
          </p>
          <div className="landing-actions">
            <Link className="primary" href={user ? "/profiles" : "/signup"}>
              {user ? "Retrouver mon espace" : "Créer mon compte"} →
            </Link>
            <a className="secondary" href="#univers">
              Découvrir les univers
            </a>
          </div>
          <div className="hero-note">
            GRATUIT · PROFILS PERSONNELS · FAVORIS
          </div>
          <div className="hero-index">
            01 <span>/ UN MONDE D’HISTOIRES</span>
          </div>
        </section>
        <section className="landing-content" id="univers">
          <div className="brand-grid">
            {[
              "Disney",
              "PIXAR",
              "MARVEL",
              "STAR WARS",
              "NATIONAL GEOGRAPHIC",
              "STAR",
            ].map((b, i) => (
              <Link
                key={b}
                className={`brand brand-${i}`}
                href={user ? "/browse" : "/signup"}
              >
                {b}
              </Link>
            ))}
          </div>
          <div className="section-heading">
            <div>
              <div className="eyebrow">L’AVENTURE COMMENCE ICI</div>
              <h2>Des histoires pour chaque envie.</h2>
            </div>
            <span className="muted">Tout un univers à découvrir</span>
          </div>
          <div className="landing-titles">
            {titles.slice(0, 4).map((t) => (
              <Link
                href={user ? "/browse" : "/signup"}
                key={t.id}
                className="title-card"
                style={{
                  backgroundImage: `linear-gradient(0deg,#080e1af2,transparent),url('${artwork(t.image, 800)}')`,
                  backgroundColor: t.color,
                }}
              >
                <small>{t.brand}</small>
                <h3>{t.name}</h3>
                <span>
                  {t.year} · {t.type}
                </span>
              </Link>
            ))}
          </div>
          <section className="benefits">
            <div>
              <span>01</span>
              <h3>Votre univers personnel</h3>
              <p>
                Un compte sécurisé et jusqu’à sept profils pour toute la
                famille.
              </p>
            </div>
            <div>
              <span>02</span>
              <h3>Vos prochains coups de cœur</h3>
              <p>
                Recherchez, explorez et gardez vos titres préférés dans votre
                liste.
              </p>
            </div>
            <div>
              <span>03</span>
              <h3>La magie, partout</h3>
              <p>
                Une expérience pensée pour votre téléphone, tablette et
                ordinateur.
              </p>
            </div>
          </section>
          <div className="landing-cta">
            <div className="eyebrow">FAITES PLACE À L’IMAGINATION</div>
            <h2>
              Votre prochaine histoire
              <br />
              <em>vous attend.</em>
            </h2>
            <Link className="primary" href={user ? "/profiles" : "/signup"}>
              Commencer l’aventure →
            </Link>
          </div>
        </section>
      </main>
      <footer>
        <Logo />
        <p>
          Démonstration indépendante inspirée de Disney+. Aucun streaming ni
          abonnement proposé.
        </p>
        <small>
          Les marques et titres appartiennent à leurs propriétaires respectifs.
        </small>
      </footer>
    </>
  );
}
