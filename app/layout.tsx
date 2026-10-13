import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Disney+ · Un monde d’histoires",
  description:
    "Votre espace cinéma : catalogue, profils et favoris. Démonstration indépendante inspirée de Disney+.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
