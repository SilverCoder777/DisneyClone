import Logo from "@/components/Logo";
import ProfileCreator from "@/components/ProfileCreator";
import { requireUser } from "@/lib/auth";
import { db, type Profile } from "@/lib/db";
import { selectProfile, deleteProfile, logout } from "@/app/actions";
export default async function Profiles() {
  const user = await requireUser();
  const profiles = db
    .prepare("SELECT * FROM profiles WHERE user_id=? ORDER BY rowid")
    .all(user.id) as Profile[];
  return (
    <main className="profiles-page">
      <header>
        <Logo />
        <form action={logout}>
          <button className="text-button">Déconnexion</button>
        </form>
      </header>
      <section>
        <div className="eyebrow">À CHACUN SON UNIVERS</div>
        <h1>Qui regarde ?</h1>
        <p className="muted">
          Choisissez votre profil pour retrouver vos favoris.
        </p>
        <div className="profile-grid">
          {profiles.map((p) => (
            <div key={p.id}>
              <form action={selectProfile}>
                <input type="hidden" name="id" value={p.id} />
                <button className="profile-tile">
                  <div className={`avatar a${p.avatar}`}>
                    {["✦", "☾", "⚡", "❋", "✿", "☀"][p.avatar]}
                  </div>
                  <span>{p.name}</span>
                  {!!p.kids && <small>ENFANT</small>}
                </button>
              </form>
              {profiles.length > 1 && (
                <form action={deleteProfile}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="delete-profile">Supprimer</button>
                </form>
              )}
            </div>
          ))}
          {profiles.length < 7 && <ProfileCreator />}
        </div>
        <p className="profile-note">
          Jusqu’à 7 profils. Des favoris propres à chacun.
        </p>
      </section>
    </main>
  );
}
