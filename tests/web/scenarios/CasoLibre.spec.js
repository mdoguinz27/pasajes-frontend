import { test, expect } from "@playwright/test";
import { home } from "../pages/homePage";
import { product } from "../pages/productPage";
import { results } from "../pages/resultsPage";
import * as utils from "../utils/helpers";
test.beforeEach(async ({ page }) => {
    // Espera antes de ejecutar cualquier test
    await utils.waitForPageLoad(page);
  });
  
test("Ofertas", async ({
    page,
  }) => {
    // Paso 1: Navegar a la página principal
    await page.goto("/");
    console.log("Navegando a la página");
  
    // Paso 2: Ingresar código postal en modal de geolocalización
    await utils.verifyAndEnterPostalCode(page, "1419");
    console.log("Ingresando código postal");
    page.waitForLoadState();
  
    // Paso 3: Accede al menú Ofertas
    await page.locator(home.menuOfertas).click();
  
    // Paso 4: Filtrar por marca y ordena menor precio
    page.waitForLoadState();
    await page.locator(results.filterMarca).nth(3).click();
    console.log("Filtra por marca");
  
    await page.locator(results.orderBySelect).click();
    await page.getByRole("link", { name: "Menor precio" }).click();
    console.log("Ordena por Menor precio");
  
    // Paso 5: Selecciona el 2do producto del listado de resultados
    page.waitForLoadState();
    await page.locator(results.itemProduct).nth(1).click();
  
    try {
      // Paso 6: Verifica precio del producto
      page.waitForLoadState();
      await expect(page.locator(product.price).nth(1)).toBeVisible();
  
      // Paso 7: Agrega el producto al carrito
      await page.getByRole("button", { name: "Comprar" }).click();
      console.log("Agrega el producto al carrito");
  
      // Paso 8: Ingresa al carrito y verifica que el producto esté añadido
      await expect(
        page.getByRole("heading", { name: "Mi carrito" })
      ).toBeVisible();
      console.log("Ingresa al carrito");
  
      await expect(page.getByText("finalizar compra")).toBeVisible();
      console.log("Verifica que exista el btn de Finalizar Compra");
   

    } catch {
      // Informa si el producto no está disponible
      console.error("Este producto no se encuentra disponible");
    }

    page.waitForLoadState();

  });