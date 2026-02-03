import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers";
import { home } from "../pages/homePage";

test(
  "@vuelta Búsqueda pasaje Ida y Vuelta",
  {
    annotation: {
      type: "e2e",
      description:
        "Busca pasaje ida y vuelta para 2 personas",
    },
  },
  async ({ page }) => {
    const nro_pax = 2; // cantidad de pasajeros

    // Paso 1: Navegar a la página principal
    await page.goto("/");
    console.log("Navega a la página principal");

    // Paso 2 : Ingresa datos de búsqueda de pasaje
    await page.locator(home.origin).click();
    await page
      .getByRole("textbox", { name: home.originName })
      .fill("capital federal");
    await page.getByRole("treeitem").nth(0).click();
    console.log("Selecciona origen");

    await page
      .getByRole("textbox", { name: home.destinationName })
      .fill("bariloche");
    await page.getByRole("treeitem").nth(0).click();
    console.log("Selecciona destino");

    await page.getByText(home.roundTrip).click();
    await page.getByPlaceholder("Ida").click();
    await utils.selectDate(page, 2);
    await page.getByPlaceholder("Vuelta").click();
    await utils.selectDate(page, 5);
    console.log("Ingresa fechas");

    await page.locator(home.paxs).selectOption(`${nro_pax}`);
    console.log("Ingresa cantidad de pasajeros");

    await page.getByRole("button", { name: "Buscar" }).click();
    console.log("Ejecuta la búsqueda");

    // Espera si aparece el modal de que no hay pasajes disponibles
    const modal = page.locator(home.modal);

    // Esperar un momento para que el modal pueda aparecer si no hay resultados
    try {
      await modal.waitFor({ state: 'visible', timeout: 5000 });
      // Si el modal apareció, verificar el texto
      const modalText = await modal.locator(".modal-body").innerText();
      if (modalText.includes("No encontramos opciones para tu viaje")) {
        console.log("No se encontraron pasajes para la búsqueda.");
        return;
      }
    } catch {
      // El modal no apareció, significa que hay resultados - continuar
      console.log('Modal no apareció, continuando con la selección de boleto');
    }

    // Si no aparece el modal, sigue con el flujo normal
    await utils.seleccionarBoleto(page, "Ida", nro_pax); // Tramo de ida
    await utils.seleccionarBoleto(page, "Vuelta", nro_pax); // Tramo de vuelta
  }
);

test.afterEach(async ({ page }, testInfo) => {
  const screenshotPath = `screenshots/${testInfo.title.replace(
    /\s+/g,
    "_"
  )}.png`;
  // Capturar screenshot al final del test
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot guardado en: ${screenshotPath}`);
});
