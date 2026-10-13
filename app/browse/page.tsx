import { currentProfile } from "@/lib/auth";
import { db } from "@/lib/db";
import { titles } from "@/lib/catalog";
import Catalogue from "@/components/Catalogue";
export default async function Browse() {
  const profile = await currentProfile();
  const favorites = db
    .prepare("SELECT title_id FROM favorites WHERE profile_id=?")
    .all(profile.id) as { title_id: string }[];
  return (
    <Catalogue
      profile={{ ...profile }}
      titles={titles.filter((t) => !profile.kids || t.age <= 6)}
      initialFavorites={favorites.map((f) => f.title_id)}
    />
  );
}
