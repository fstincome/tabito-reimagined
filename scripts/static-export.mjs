/**
 * Génère un site 100 % statique dans `dist/static/`.
 *
 * Étapes :
 *   1. `NITRO_PRESET=node-server vite build` a déjà produit dist/client + dist/server
 *   2. on démarre le serveur Node compilé sur un port local
 *   3. on télécharge le HTML de chaque page publique
 *   4. on écrit chaque page dans dist/static/<route>/index.html
 *   5. on copie les fichiers statiques (assets, favicon, robots.txt)
 *
 * Le résultat peut être servi par n'importe quel serveur web (Apache, Nginx…).
 * Les données (sites, blog, galerie…) sont chargées côté navigateur depuis le
 * backend, donc le contenu reste à jour sans reconstruire le site.
 */
import { spawn } from "node:child_process";
import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CLIENT = path.join(ROOT, "dist/client");
const SERVER = path.join(ROOT, "dist/server/index.mjs");
const OUT = path.join(ROOT, "dist/static");
const PORT = 3987;

const ROUTES = [
  "/",
  "/apropos",
  "/mission",
  "/vision",
  "/valeurs",
  "/principes",
  "/equipe",
  "/smedlab",
  "/blog",
  "/evenements",
  "/emplois",
  "/financements",
  "/formations",
  "/destinations",
  "/villes",
  "/circuits",
  "/bouquets",
  "/guides",
  "/galerie",
  "/partenaires",
  "/contacts",
  "/login",
  "/dashboard",
];

if (!existsSync(SERVER)) {
  console.error(
    "dist/server/index.mjs introuvable. Lancez d'abord : NITRO_PRESET=node-server vite build",
  );
  process.exit(1);
}

const child = spawn(process.execPath, [SERVER], {
  env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1" },
  stdio: ["ignore", "inherit", "inherit"],
});

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/`);
      if (res.ok) return;
    } catch {
      /* pas encore prêt */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("Le serveur de rendu n'a pas démarré.");
}

try {
  await waitForServer();
  await mkdir(OUT, { recursive: true });
  await cp(CLIENT, OUT, { recursive: true });

  for (const route of ROUTES) {
    const res = await fetch(`http://127.0.0.1:${PORT}${route}`);
    if (!res.ok) {
      console.warn(`⚠︎  ${route} → ${res.status}, page ignorée`);
      continue;
    }
    const html = await res.text();
    const dir = route === "/" ? OUT : path.join(OUT, route.slice(1));
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, "index.html"), html, "utf8");
    console.log(`✓ ${route}`);
  }

  // Repli SPA : tout chemin inconnu retombe sur la page d'accueil rendue.
  await writeFile(path.join(OUT, "404.html"), await readFile(path.join(OUT, "index.html")), "utf8");

  console.log(`\nSite statique prêt dans dist/static — à déployer tel quel.`);
} finally {
  child.kill("SIGKILL");
}
