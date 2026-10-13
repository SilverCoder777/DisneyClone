import Link from "next/link";
export default function Logo() {
  return (
    <Link href="/" className="logo" aria-label="Accueil Disney Plus">
      Disney<span>+</span>
    </Link>
  );
}
