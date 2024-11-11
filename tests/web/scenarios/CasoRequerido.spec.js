import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers"
import { home } from "../pages/homePage";


test("@caso Busqueda pasaje Solo Ida", {  
  annotation: {
    type: 'e2e',
    description: 'Desarrollar pruebas automatizadas que validen la funcionalidad de búsqueda y la visualización de los resultados en el sitio.'
  }
}, async ({ page }) => {

  const nro_pax=1 // cantidad de pasajeros

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
  await utils.selectDate(page, 6);
  console.log("Ingresa fechas");

  await page.locator(home.paxs).selectOption(`${nro_pax}`);
  console.log("Ingresa cantidad de pasajeros");

  await page.getByRole("button", { name: "Buscar" }).click();
  console.log("Ejecuta la búsqueda");

  // Espera si aparece el modal de que no hay pasajes disponibles
  const modal = page.locator(home.modal);
  const modalVisible = await modal.isVisible();

  if (modalVisible) {
    // Verifica si el modal contiene el texto esperado
    const modalText = await modal.locator(".modal-body").innerText();
    if (
      modalText.includes(
        "No encontramos opciones para tu viaje. Intentá con otra fecha, origen o destino."
      )
    ) {
      console.log("No se encontraron pasajes para la búsqueda.");
      return;
    }
  }
 });