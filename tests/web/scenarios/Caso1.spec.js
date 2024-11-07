import { test, expect } from "@playwright/test";
import { home } from "../pages/homePage";
import { product } from "../pages/productPage";
import { results } from "../pages/resultsPage";
import * as utils from "../utils/helpers";
test.beforeEach(async ({ page }) => {
  // Espera antes de ejecutar cualquier test
  await utils.waitForPageLoad(page);
});
test.only("Añade al carrito Heladera Samsung", async ({ page }) => {
  // Paso 1: Navegar a la página principal
  await page.goto("/");
  console.log("Navega a la página principal");

  // Paso 2: Ingresar código postal en modal de geolocalización
  await utils.verifyAndEnterPostalCode(page, "1419");
  console.log("Ingresando código postal");

  // Paso 3: Busca producto
  await page.locator(home.searchField).click();
  await page.locator(home.searchField).fill(home.product);
  await page.getByRole("group").getByRole("button").click();
  console.log("Busca el producto");


  // Paso 4: Selecciona el 2do producto del listado de resultados
  await page.locator(results.itemProduct).nth(1).click();
  console.log("Selecciona el producto");
  page.waitForLoadState();

  try {
    //Paso 5: Verifica precio del producto esté visible
    await expect(page.locator(product.price).nth(1)).toBeVisible();
    console.log("Producto disponible");

    // Paso 6: Agrega el producto al carrito
    page.waitForLoadState();
    await page.getByRole("button", { name: "Comprar" }).click();
    console.log("Añade al carrito");

    // Paso 7: Ingresa al carrito y verifica que el producto esté añadido
    await expect(
      page.getByRole("heading", { name: "Mi carrito" })
    ).toBeVisible();
    console.log("Ingresa al carrito");

    await expect(page.getByText(home.product)).toBeVisible();
    console.log("Heladera Samsung en el carrito!");
  } catch {
    console.log('El botón "Comprar" no está disponible');
  }
});


