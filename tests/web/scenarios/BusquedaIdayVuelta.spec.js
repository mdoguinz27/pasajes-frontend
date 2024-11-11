import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers"

test("@vuelta Búsqueda Ida y Vuelta", {  
  annotation: {
    type: 'Negative',
    description: 'Busca pasaje ida y vuelta para 2 personas. Este test tiene altas posibilidades de fallar'
  }
}, async ({ page }) => {
  
  const nro_pax=2 // cantidad de pasajeros

  // Paso 1: Navegar a la página principal
  await page.goto('/')
  console.log("Navega a la página principal");
  
  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator('#select2-PadOrigen-container').click();
  await page.getByRole('textbox', { name: 'Ingresá desde dónde viajás' }).fill('capital federal');
  await page.getByRole('treeitem').nth(0).click();
  console.log('Selecciona origen')

  await page.getByRole('textbox', { name: 'Ingresá hacia dónde viajás' }).fill('bariloche');
  await page.getByRole('treeitem').nth(0).click();
  console.log('Selecciona destino')

  await page.getByText('Ida y vuelta').click();
  await page.getByPlaceholder('Ida').click();
  await utils.selectDate(page, 5, 10) // 5 días después de hoy como fecha de ida, 10 días después de hoy como fecha de regreso
  console.log('Ingresa fechas')

  await page.locator('#pasajeros').selectOption(`${nro_pax}`);
  console.log('Ingresa cantidad de pasajeros')

  await page.getByRole('button', { name: 'Buscar' }).click();
  console.log('Ejecuta la búsqueda')  

  // Espera si aparece el modal de que no hay pasajes disponibles
  const modal = page.locator('#modal-alert');
  const modalVisible = await modal.isVisible();

  if (modalVisible) {
      // Verifica si el modal contiene el texto esperado
      const modalText = await modal.locator('.modal-body').innerText();
      if (modalText.includes('No encontramos opciones para tu viaje. Intentá con otra fecha, origen o destino. Si vas a la Costa, recordá que algunas localidades no tienen terminal, pero podés viajar a la más cercana.')) {
          console.log('No se encontraron pasajes para la búsqueda.');
          return;
      }
  }

  // Si no aparece el modal, sigue con el flujo normal
  await expect(page.locator('#servicios')).toBeVisible();
  await page.locator('#servicios div').locator('#LkbComprar').nth(0).click();
  console.log('Selecciona el primer boleto');
 
 await page.waitForTimeout(6000);

  await utils.nro_pasajeros(page, nro_pax);
  console.log(`Selecciona asiento para ${nro_pax} pasajeros`);
  await page.getByRole('link', { name: 'Continuar' }).click();

});


