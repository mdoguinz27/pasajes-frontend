import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers";

test.beforeAll("Busca un pasaje", async ({ page }) => {
  const nro_pax = 2; // cantidad de pasajeros
  // Paso 1: Navegar a la página principal
  await page.goto("/");
  console.log("Navega a la página principal");

  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator("#select2-PadOrigen-container").click();
  await page
    .getByRole("textbox", { name: "Ingresá desde dónde viajás" })
    .fill("buenos aires");
  await page.getByRole("treeitem", { name: "/Buenos Aires/" }).click();
  console.log("Selecciona origen");

  await page
    .getByRole("textbox", { name: "Ingresá hacia dónde viajás" })
    .fill("cordoba");
  await page.getByRole("treeitem", { name: "/Cordoba/" }).click();
  await page.getByPlaceholder("Ida").click();
  console.log("Selecciona destino");

  await utils.selectDate(page, 3);
  console.log("Ingresa fechas");

  await page.locator("#pasajeros").selectOption(`${nro_pax}`);
  console.log("Ingresa cantidad de pasajeros");

  await page.getByRole("button", { name: "Buscar" }).click();
  console.log("Ejecuta la búsqueda");

  // Paso 3: Verifica disponibilidad de pasajes (resultados)
  await expect(
    page.locator("#servicios div").locator("#LkbComprar")
  ).toBeVisible();
  console.log("Pasajes disponibles");

  if (modalVisible) {
    // Verifica si el modal contiene el texto esperado
    const modalText = await modal.locator(".modal-body").innerText();
    if (
      modalText.includes(
        "No encontramos opciones para tu viaje. Intentá con otra fecha, origen o destino. Si vas a la Costa, recordá que algunas localidades no tienen terminal, pero podés viajar a la más cercana."
      )
    ) {
      console.log("No se encontraron pasajes para la búsqueda.");
      return;
    }
  }

  // Si no aparece el modal, sigue con el flujo normal
  await expect(page.locator("#servicios")).toBeVisible();
  await page.locator("#servicios div").locator("#LkbComprar").nth(0).click();
  await utils.nro_pasajeros(page, nro_pax);
  await page.getByRole("link", { name: "Continuar" }).click();
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
    await page.getByRole("cell", { name: "30" }).locator("div").click();
    await page.getByRole("link", { name: "Actualizar búsqueda" }).click();
    await expect(
      page.locator("#servicios div").locator("#LkbComprar")
    ).toBeVisible();

    // Pas 5: Ordena pasajes por más temprano
    await page.getByText("Ordenar por más temprano más").click();
    await page.getByRole("option", { name: "menor precio" }).click();
    await expect(page.locator("#servicios")).toBeVisible();
  }
);
