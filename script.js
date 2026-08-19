/*
  Ce fichier construit la grille automatiquement à partir de products.js.
  Tu n'as normalement pas besoin d'y toucher.
*/

/* ── Hero : découpe le wordmark en lettres révélées en cascade ── */
(function () {
  const wm = document.querySelector(".hero-wordmark");
  if (!wm) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const text = wm.textContent.trim();
  wm.textContent = "";
  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "ltr";
    span.textContent = ch;
    if (reduce) { span.style.opacity = "1"; span.style.transform = "none"; }
    else { span.style.animationDelay = (0.15 + i * 0.08) + "s"; }
    wm.appendChild(span);
  });
})();

/* ── Révélation au scroll (cartes + blocs .reveal) ── */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  // observe les blocs marqués reveal + les cartes (ajoutées plus bas)
  window.__revealObserver = io;
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

/* ── Message de repli : jamais de grille vide ── */
function afficherRepli(grid) {
  grid.style.display = "block";
  grid.innerHTML = "";
  const p = document.createElement("p");
  p.className = "section-note";
  p.innerHTML =
    'Sélection en cours de renouvellement.<br>' +
    'Écrivez à <a href="mailto:contact@nayren.com">contact@nayren.com</a>.';
  grid.appendChild(p);
}

(async function () {
  const grid = document.getElementById("grid");
  if (!grid || typeof chargerPieces !== "function") return;

  let PIECES;
  try {
    PIECES = await chargerPieces();
  } catch (e) {
    afficherRepli(grid);
    return;
  }
  if (!PIECES.length) {
    afficherRepli(grid);
    return;
  }

  PIECES.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "card";
    card.style.transitionDelay = ((i % 3) * 0.09) + "s";

    // Visuel
    const visual = document.createElement("div");
    visual.className = "card-visual" + (p.image ? "" : " empty");
    if (p.image) {
      const img = document.createElement("img");
      img.src = p.image;
      img.alt = p.marque + " " + p.modele;
      img.loading = "lazy";
      visual.appendChild(img);
    }
    if (p.disponible === false) {
      const sold = document.createElement("div");
      sold.className = "card-sold";
      sold.textContent = "Vendu";
      visual.appendChild(sold);
    }
    card.appendChild(visual);

    // Corps
    const body = document.createElement("div");
    body.className = "card-body";

    const brand = document.createElement("div");
    brand.className = "card-brand";
    brand.textContent = p.marque;
    body.appendChild(brand);

    const model = document.createElement("div");
    model.className = "card-model";
    model.textContent = p.modele;
    body.appendChild(model);

    if (p.matiere) {
      const mat = document.createElement("div");
      mat.className = "card-matiere";
      mat.textContent = p.matiere;
      body.appendChild(mat);
    }

    // Bouton
    if (p.disponible === false) {
      const cta = document.createElement("span");
      cta.className = "card-cta disabled";
      cta.textContent = "Vendu";
      body.appendChild(cta);
    } else {
      const cta = document.createElement("a");
      cta.className = "card-cta";
      cta.href = p.lien || "#";
      cta.target = "_blank";
      cta.rel = "noopener";
      cta.textContent = (p.canal ? p.canal : "Découvrir") + " \u2192";
      body.appendChild(cta);
    }

    card.appendChild(body);
    grid.appendChild(card);

    // Révélation au scroll
    if (window.__revealObserver) {
      window.__revealObserver.observe(card);
    } else {
      card.classList.add("in"); // reduced-motion : visible direct
    }
  });
})();
