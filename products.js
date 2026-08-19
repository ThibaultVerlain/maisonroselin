/*
  ╔══════════════════════════════════════════════════════════════╗
  ║  VITRINE NAYREN — IL N'Y A PLUS RIEN À MODIFIER ICI           ║
  ╠══════════════════════════════════════════════════════════════╣
  ║                                                              ║
  ║  Les pièces affichées viennent de Marlo.                      ║
  ║                                                              ║
  ║  Une pièce apparaît sur le site si, dans Marlo :              ║
  ║    - son statut est « En vente »                              ║
  ║    - elle a au moins une photo                                ║
  ║                                                              ║
  ║  Elle disparaît dès que tu la passes en « Vendu ».            ║
  ║  Les 6 pièces les plus récentes sont affichées.               ║
  ║                                                              ║
  ║  Aucun prix n'est affiché : le contact se fait en direct.     ║
  ║                                                              ║
  ╚══════════════════════════════════════════════════════════════╝
*/

const VITRINE = {
  endpoint: "https://zchqzikgjvbikwrmlrpm.supabase.co/rest/v1/vitrine?select=*",
  cle: "sb_publishable_mq4S5ENJe0F1CECnvxuIfQ_KYncl9m2",

  // Où mène le bouton de chaque pièce.
  // WhatsApp construit la clientèle privée. Pour basculer sur l'email,
  // remplace par : "mailto:contact@nayren.com"
  contactLien: "https://wa.me/33756839656",
  contactLibelle: "Disponible",
};

/* Compose la ligne de description sous le modèle.
   Exemple : "Vinyle, noir — Taille 38" */
function decrire(p) {
  const matiere = [p.material, p.color].filter(Boolean).join(", ");
  const taille = p.size && p.size.trim() ? "Taille " + p.size.trim() : "";
  return [matiere, taille].filter(Boolean).join(" — ");
}

/* Va chercher les pièces dans Marlo et les met au format attendu par script.js.
   Lève une erreur si l'appel échoue — script.js affiche alors le repli. */
async function chargerPieces() {
  const reponse = await fetch(VITRINE.endpoint, {
    headers: { apikey: VITRINE.cle },
    cache: "no-store",
  });
  if (!reponse.ok) throw new Error("Vitrine indisponible (" + reponse.status + ")");

  const lignes = await reponse.json();

  return lignes.map((p) => ({
    marque: p.brand,
    modele: p.model || p.title,
    matiere: decrire(p),
    image: p.image,
    disponible: true,
    canal: VITRINE.contactLibelle,
    lien: VITRINE.contactLien,
  }));
}
