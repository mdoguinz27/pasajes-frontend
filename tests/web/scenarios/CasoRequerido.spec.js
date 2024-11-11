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
  await page.goto('/')
  console.log("Navega a la página principal");
  
  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator(home.origin).click();
  await page.getByRole('textbox', { name: 'Ingresá desde dónde viajás' }).fill('buenos aires');
  await page.getByRole('treeitem').nth(0).click();
  console.log('Selecciona origen')

  await page.getByRole('textbox', { name: 'Ingresá hacia dónde viajás' }).fill('la plata');  
  await page.getByRole('treeitem').nth(0).click();
  await page.getByPlaceholder('Ida').click();
  console.log('Selecciona destino')

  await utils.selectDate(page, 5)
  console.log('Ingresa fechas')

  await page.locator('#pasajeros').selectOption(`${nro_pax}`);
  console.log('Ingresa cantidad de pasajeros')

  await page.getByRole('button', { name: 'Buscar' }).click();
  console.log('Ejecuta la búsqueda')

   // Espera y maneja el modal de producto no disponible, si aparece
   const modal = page.locator('#modal-alert');
   const modalVisible = await modal.isVisible();

   if (modalVisible) {
       const modalText = await modal.locator('.modal-body').innerText();
       if (modalText.includes('No encontramos opciones para tu viaje. Intentá con otra fecha, origen o destino. Si vas a la Costa, recordá que algunas localidades no tienen terminal, pero podés viajar a la más cercana.')) {
           console.warn('No se encontraron pasajes para la búsqueda.');
           return;
       }
   }

   // Pas 3: Ordena pasajes
   await page.getByText("Ordenar por más temprano más").click();
   await page.getByRole("option", { name: "menor precio" }).click();
   console.log('Ordena por precio')
   await expect(page.locator("#servicios")).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
   const screenshotPath = `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;  
   // Capturar screenshot al final del test
   await page.screenshot({ path: screenshotPath, fullPage: true });
   console.log(`Screenshot guardado en: ${screenshotPath}`);
 });