import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers";
import { home } from "../pages/homePage";

test.beforeEach("Busca un pasaje", async ({ page }) => {
  const nro_pax = 2; // cantidad de pasajeros
  // Paso 1: Navegar a la página principal
  await page.goto("/");
  console.log("Navega a la página principal");

  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator(home.origin).click();
  await page
    .getByRole("textbox", { name: home.originName })
    .fill("Capital federal");
  await page.getByRole("treeitem").nth(0).click();
  console.log("Selecciona origen");

  await page
    .getByRole("textbox", { name: home.destinationName })
    .fill("cordoba");
  await page.getByRole("treeitem").nth(0).click();
  console.log("Selecciona destino");

  await page.getByPlaceholder("Ida").click();

  await utils.selectDate(page, 3);
  console.log("Ingresa fechas");

  await page.locator("#pasajeros").selectOption(`${nro_pax}`);
  console.log("Ingresa cantidad de pasajeros");

  await page.getByRole("button", { name: "Buscar" }).click();
  console.log("Ejecuta la búsqueda");

  // Espera y maneja el modal si aparece
  const modal = page.locator('#modal-alert');
  const modalVisible = await modal.isVisible();

  if (modalVisible) {
      // Verifica si el modal contiene el texto esperado
      const modalText = await modal.locator('.modal-body').innerText();
      if (modalText.includes('No encontramos opciones para tu viaje. Intentá con otra fecha, origen o destino. Si vas a la Costa, recordá que algunas localidades no tienen terminal, pero podés viajar a la más cercana.')) {
          console.warn('No se encontraron pasajes para la búsqueda.');
          // Finaliza el test exitosamente si aparece el modal con el texto correcto
          return;
      }
  }
});

test(
  "@modificar Modifica un pasaje",
  {
    annotation: {
      type: "Positive",
      description: "Modifica un pasaje buscado",
    },
  },
  async ({ page }) => {
    // Paso 4 : Modifica la búsqueda
    await page.getByText("Modificar").click();
    await page
      .locator("#modal-buscador div")
      .filter({ hasText: "Modificá tu búsqueda" })
      .nth(1)
      .click();
    await page.getByLabel("Ida y vuelta").check();
    await page.getByPlaceholder("Vuelta").click();
    await utils.selectDate(page, 6);
    await page.getByRole("link", { name: "Actualizar búsqueda" }).click();
    await page.waitForLoadState('load');
    console.log('Actualiza la búsqueda')

    // Pas 5: Ordena pasajes por más temprano
    await page.getByText("Ordenar por más temprano más").click();
    await page.getByRole("option", { name: "menor precio" }).click();
    console.log('Ordena por precio')
    await expect(page.locator("#servicios")).toBeVisible();
  }
);
