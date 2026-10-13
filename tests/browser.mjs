import { chromium } from "playwright-core";
import assert from "node:assert/strict";
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  headless: true,
  args: ["--no-sandbox"],
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const base = process.env.TEST_BASE_URL || "http://localhost:5174";
const email = `test-${Date.now()}@example.com`;
const password = "Unique-test-password-123";
try {
  await page.goto(base + "/browse");
  await page.waitForURL("**/login");
  await page.goto(base + "/signup");
  await page.getByLabel("Votre prénom").fill("Test Camille");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await page.waitForURL("**/profiles");
  await page.getByRole("button", { name: "Test Camille" }).click();
  await page.waitForURL("**/browse");
  await page.locator(".catalogue-nav").waitFor();
  await page.getByRole("button", { name: "Recherche", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Rechercher un titre" })
    .fill("Avatar");
  await page.locator(".title-card").click();
  await page
    .getByRole("button", { name: "Ajouter à ma liste", exact: true })
    .click();
  await page.getByRole("button", { name: "Dans ma liste" }).waitFor();
  await page.getByRole("button", { name: "Fermer", exact: true }).click();
  await page.getByRole("button", { name: "Ma liste", exact: true }).click();
  assert.equal(await page.locator(".title-card").count(), 1);
  await page.reload();
  await page.getByRole("button", { name: "Ma liste", exact: true }).click();
  assert.equal(await page.locator(".title-card").count(), 1);
  await page.goto(base + "/profiles");
  await page.getByRole("button", { name: "Ajouter un profil" }).click();
  await page.getByLabel("Nom du profil").fill("Enfant");
  await page.getByLabel("Profil enfant").check();
  await page
    .getByRole("button", { name: "Créer le profil", exact: true })
    .click();
  await page.locator(".profile-tile").filter({ hasText: "Enfant" }).click();
  await page.waitForURL("**/browse");
  await page.locator(".catalogue-nav").waitFor();
  assert.equal(await page.locator(".title-card").count(), 6);
  await page.getByRole("button", { name: "Ma liste", exact: true }).click();
  assert.equal(await page.locator(".title-card").count(), 0);
  await page.goto(base + "/account");
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await page.waitForURL("**/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByLabel("Mot de passe").fill("Wrong-test-password-123");
  await page.getByRole("button", { name: /^Se connecter/ }).click();
  await page.getByRole("alert").waitFor();
  assert.ok(page.url().endsWith("/login"));
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: /^Se connecter/ }).click();
  await page.waitForURL("**/profiles");
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator(".profile-tile")
    .filter({ hasText: "Test Camille" })
    .click();
  await page.waitForURL("**/browse");
  await page.locator(".catalogue-nav").waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: "/tmp/disney-next-mobile.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({
    path: "/tmp/disney-next-desktop.png",
    fullPage: true,
  });
  const cookie = (await context.cookies()).find((c) => c.name === "profile");
  assert.ok(cookie);
  const other = await browser.newContext();
  const otherPage = await other.newPage();
  await otherPage.goto(base + "/signup");
  await otherPage.getByLabel("Votre prénom").fill("Autre compte");
  await otherPage.getByLabel("Adresse e-mail").fill("other-" + email);
  await otherPage.getByLabel("Mot de passe").fill(password);
  await otherPage.getByRole("button", { name: "Créer mon compte" }).click();
  await otherPage.waitForURL("**/profiles");
  await other.addCookies([{ name: "profile", value: cookie.value, url: base }]);
  await otherPage.goto(base + "/browse");
  await otherPage.waitForURL("**/profiles");
  assert.equal(
    await otherPage
      .locator(".profile-tile")
      .filter({ hasText: "Test Camille" })
      .count(),
    0,
  );
  await other.close();
  const artworkResponse = await page.request.get(base + "/artwork/space.svg");
  assert.ok(artworkResponse.ok());
  assert.ok((await artworkResponse.text()).includes("<svg"));
  assert.deepEqual(errors, []);
  console.log(
    "PASS: route protection, signup, profile selection, search, persistent favorites, child filter, profile isolation, logout, invalid-password rejection, login, cross-account access rejection, local artwork, mobile overflow, no browser errors",
  );
} catch (e) {
  console.log(errors);
  console.log((await page.locator("body").innerText()).slice(0, 2000));
  await page.screenshot({ path: "/tmp/disney-next-failure.png" });
  throw e;
} finally {
  await browser.close();
}
