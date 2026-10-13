"use client";
import { useEffect, useRef, useState, useTransition } from "react";
import Link from "next/link";
import {
  Home,
  Search,
  Plus,
  Film,
  Clapperboard,
  X,
  Check,
  ChevronRight,
  User,
  Play,
} from "lucide-react";
import Logo from "./Logo";
import { type Title, artwork } from "@/lib/catalog";
import { type Profile } from "@/lib/db";
import { toggleFavorite } from "@/app/actions";
const symbols = ["✦", "☾", "⚡", "❋", "✿", "☀"];
export default function Catalogue({
  profile,
  titles,
  initialFavorites,
}: {
  profile: Profile;
  titles: Title[];
  initialFavorites: string[];
}) {
  const [section, setSection] = useState("Accueil"),
    [query, setQuery] = useState(""),
    [brand, setBrand] = useState(""),
    [favorites, setFavorites] = useState(initialFavorites),
    [detail, setDetail] = useState<Title | null>(null),
    [error, setError] = useState(""),
    [pending, start] = useTransition();
  const dialog = useRef<HTMLDialogElement>(null);
  const hero = titles[0];
  useEffect(() => {
    if (detail) dialog.current?.showModal();
    else dialog.current?.close();
  }, [detail]);
  const list = titles.filter(
    (t) =>
      (section !== "Ma liste" || favorites.includes(t.id)) &&
      (section !== "Films" || t.type === "Film") &&
      (section !== "Séries" || t.type === "Série") &&
      (!brand || t.brand === brand) &&
      `${t.name} ${t.brand}`.toLowerCase().includes(query.toLowerCase()),
  );
  function navigate(s: string) {
    setSection(s);
    setBrand("");
    setQuery("");
  }
  function save(t: Title) {
    setError("");
    start(async () => {
      try {
        const added = await toggleFavorite(t.id);
        setFavorites((f) =>
          added
            ? [...f.filter((id) => id !== t.id), t.id]
            : f.filter((id) => id !== t.id),
        );
      } catch {
        setError("Impossible de modifier votre liste. Réessayez.");
      }
    });
  }
  return (
    <>
      <header className="catalogue-nav">
        <Logo />
        <nav>
          {[
            { name: "Accueil", Icon: Home },
            { name: "Recherche", Icon: Search },
            { name: "Ma liste", Icon: Plus },
            { name: "Films", Icon: Film },
            { name: "Séries", Icon: Clapperboard },
          ].map(({ name, Icon }) => (
            <button
              key={name}
              className={section === name ? "active" : ""}
              onClick={() => navigate(name)}
            >
              <Icon size={17} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <Link className="profile-link" href="/profiles">
          <span>{profile.name}</span>
          <div className={`mini-avatar a${profile.avatar}`}>
            {symbols[profile.avatar]}
          </div>
        </Link>
        <Link href="/account" className="account-icon" aria-label="Mon compte">
          <User size={20} />
        </Link>
      </header>
      <main className="catalogue-main">
        {section === "Accueil" && !brand && (
          <section
            className="catalogue-hero"
            style={{
              backgroundColor: hero.color,
              backgroundImage: `linear-gradient(90deg,#090d19f5,#090d1960),linear-gradient(0deg,#090d19,transparent 70%),url('${artwork(hero.image, 2000)}')`,
            }}
          >
            <div className="eyebrow">
              {profile.kids ? "LA MAGIE POUR LES PETITS" : "À L’AFFICHE"}{" "}
              <span className="pill">{hero.brand}</span>
            </div>
            <h1>{hero.name}</h1>
            <div className="metadata">
              {hero.year}
              <span>{hero.age}+</span>
              {hero.duration}
              <span>HD</span>
            </div>
            <p>{hero.description}</p>
            <div className="hero-buttons">
              <button className="primary" onClick={() => setDetail(hero)}>
                <Play size={17} fill="currentColor" />
                Découvrir
              </button>
              <button
                className="round-button"
                aria-label={
                  favorites.includes(hero.id)
                    ? "Retirer de ma liste"
                    : "Ajouter à ma liste"
                }
                disabled={pending}
                onClick={() => save(hero)}
              >
                {favorites.includes(hero.id) ? <Check /> : <Plus />}
              </button>
            </div>
            <div className="hero-note">
              BIENVENUE {profile.name.toUpperCase()} · VOTRE CINÉMA PERSONNEL
            </div>
          </section>
        )}
        <div className="catalogue-content">
          {section === "Accueil" && (
            <div className="brand-grid">
              {[
                "Disney",
                "Pixar",
                "Marvel",
                "Star Wars",
                "National Geographic",
                "Star",
              ].map((b, i) => (
                <button
                  className={`brand brand-${i} ${brand === b ? "selected" : ""}`}
                  key={b}
                  onClick={() => setBrand(brand === b ? "" : b)}
                >
                  {b}
                </button>
              ))}
            </div>
          )}
          <section className="catalogue-section">
            <div className="section-heading">
              <div>
                <div className="eyebrow">
                  {brand ? "VOTRE UNIVERS" : "CHOISIS POUR VOUS"}
                </div>
                <h2>
                  {brand ||
                    (
                      {
                        Accueil: "Vos prochains coups de cœur",
                        Recherche: "Trouvez votre prochaine histoire",
                        "Ma liste": "Votre liste",
                        Films: "Les films à découvrir",
                        Séries: "Encore un épisode ?",
                      } as Record<string, string>
                    )[section]}
                </h2>
              </div>
              <span className="count">
                {list.length} titre{list.length > 1 ? "s" : ""}
              </span>
            </div>
            {section === "Recherche" && (
              <div className="search-box">
                <Search size={22} />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Film, série ou univers…"
                  aria-label="Rechercher un titre"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label="Effacer la recherche"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            <div className="titles-grid">
              {list.map((t) => (
                <button
                  className="title-card"
                  key={t.id}
                  onClick={() => setDetail(t)}
                  style={{
                    backgroundImage: `linear-gradient(0deg,#080e1af2,transparent),url('${artwork(t.image, 800)}')`,
                    backgroundColor: t.color,
                  }}
                >
                  <small>{t.brand}</small>
                  <h3>{t.name}</h3>
                  <span>
                    {t.year} · {t.type} · {t.age}+
                  </span>
                  {favorites.includes(t.id) && (
                    <span className="saved-badge">
                      <Check size={14} />
                    </span>
                  )}
                </button>
              ))}
            </div>
            {!list.length && (
              <div className="empty-state">
                <Film size={40} />
                <h3>
                  {section === "Ma liste"
                    ? "Votre prochaine histoire est à portée de clic."
                    : "Aucun titre trouvé."}
                </h3>
                <p>
                  {section === "Ma liste"
                    ? "Ajoutez des titres depuis leurs fiches pour les retrouver ici."
                    : "Essayez une autre recherche ou explorez un autre univers."}
                </p>
                <button
                  className="secondary"
                  onClick={() => navigate("Accueil")}
                >
                  Explorer le catalogue <ChevronRight size={16} />
                </button>
              </div>
            )}
          </section>
          {section === "Accueil" && !brand && (
            <section className="editorial">
              <div>
                <div className="eyebrow">UNE LISTE QUI VOUS RESSEMBLE</div>
                <h2>
                  Vos histoires.
                  <br />
                  <em>À retrouver, à partager.</em>
                </h2>
                <p>
                  Gardez vos coups de cœur à portée de main.
                  <br />
                  Votre liste est sauvegardée pour ce profil.
                </p>
                <button
                  className="secondary"
                  onClick={() => navigate("Ma liste")}
                >
                  Retrouver ma liste <ChevronRight size={16} />
                </button>
              </div>
              <span className="editorial-mark">Disney+</span>
            </section>
          )}
        </div>
      </main>
      <footer>
        <Logo />
        <p>
          Démonstration indépendante · Pas de lecture vidéo · Illustrations non
          officielles
        </p>
        <Link href="/account">Mon compte</Link>
      </footer>
      <dialog
        ref={dialog}
        onCancel={() => setDetail(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDetail(null);
        }}
        className="title-dialog"
      >
        <button
          className="close"
          onClick={() => setDetail(null)}
          aria-label="Fermer"
        >
          <X />
        </button>
        {detail && (
          <>
            <div
              className="detail-art"
              style={{
                backgroundColor: detail.color,
                backgroundImage: `linear-gradient(0deg,#121b2d,transparent),url('${artwork(detail.image)}')`,
              }}
            />
            <div className="detail-content">
              <div className="eyebrow">
                {detail.brand} · {detail.type}
              </div>
              <h2>{detail.name}</h2>
              <div className="metadata">
                {detail.year}
                <span>{detail.age}+</span>
                {detail.duration}
              </div>
              <p>{detail.description}</p>
              <button
                className="primary"
                disabled={pending}
                onClick={() => save(detail)}
              >
                {favorites.includes(detail.id) ? (
                  <Check size={18} />
                ) : (
                  <Plus size={18} />
                )}{" "}
                {pending
                  ? "Enregistrement…"
                  : favorites.includes(detail.id)
                    ? "Dans ma liste"
                    : "Ajouter à ma liste"}
              </button>
              {error && (
                <p className="error" role="alert">
                  {error}
                </p>
              )}
              <p className="demo-note">
                Cette fiche présente le titre. La lecture vidéo n’est pas
                disponible dans cette démonstration.
              </p>
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
