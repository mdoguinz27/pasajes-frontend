import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers"
import { home } from "../pages/homePage";


test("@ida Busqueda pasaje Solo Ida", {
  annotation: {
    type: 'e2e',
    description: 'Busca pasaje solo ida para 3 personas'
  }
}, async ({ page }) => {

  const nro_pax = 3 // cantidad de pasajeros

  // Paso 1: Navegar a la página principal
  await page.goto('/')
  console.log("Navega a la página principal");

  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator(home.origin).click();
  await page.getByRole('textbox', { name: home.originName }).fill('buenos aires');
  await page.getByRole('treeitem').nth(0).click();
  console.log('Selecciona origen')

  await page.getByRole('textbox', { name: home.destinationName }).fill('cordoba');
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
  const modal = page.locator(home.modal);

  // Esperar un momento para que el modal pueda aparecer si no hay resultados
  try {
    await modal.waitFor({ state: 'visible', timeout: 5000 });
    // Si el modal apareció, verificar el texto
    const modalText = await modal.locator('.modal-body').innerText();
    if (modalText.includes('No encontramos opciones para tu viaje')) {
      console.warn('No se encontraron pasajes para la búsqueda.');
      return;
    }
  } catch {
    // El modal no apareció, significa que hay resultados - continuar
    console.log('Modal no apareció, continuando con la selección de boleto');
  }

  await utils.seleccionarBoleto(page, "Ida", nro_pax); // Tramo de ida
});

test.afterEach(async ({ page }, testInfo) => {
  const screenshotPath = `screenshots/${testInfo.title.replace(/\s+/g, '_')}.png`;
  // Capturar screenshot al final del test
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot guardado en: ${screenshotPath}`);
});