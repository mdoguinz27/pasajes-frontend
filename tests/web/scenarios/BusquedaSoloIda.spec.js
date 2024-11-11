import { test, expect } from "@playwright/test";
import * as utils from "../utils/helpers"


test("@ida Busca pasaje solo ida", {  
  annotation: {
    type: 'e2e',
    description: 'Busca pasaje solo ida para 3 personas'
  }
}, async ({ page }) => {

  const nro_pax=3 // cantidad de pasajeros

  // Paso 1: Navegar a la página principal
  await page.goto('/')
  console.log("Navega a la página principal");
  
  // Paso 2 : Ingresa datos de búsqueda de pasaje
  await page.locator('#select2-PadOrigen-container').click();
  await page.getByRole('textbox', { name: 'Ingresá desde dónde viajás' }).fill('buenos aires');
  await page.getByRole('treeitem').nth(0).click();
  console.log('Selecciona origen')

  await page.getByRole('textbox', { name: 'Ingresá hacia dónde viajás' }).fill('cordoba');  
  await page.getByRole('treeitem').nth(0).click();
  await page.getByPlaceholder('Ida').click();
  console.log('Selecciona destino')

  await utils.selectDate(page, 5)
  console.log('Ingresa fechas')

  await page.locator('#pasajeros').selectOption(`${nro_pax}`);
  console.log('Ingresa cantidad de pasajeros')

  await page.getByRole('button', { name: 'Buscar' }).click();
  console.log('Ejecuta la búsqueda')

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

   // Si no aparece el modal, sigue con el flujo normal
   await expect(page.locator('#servicios')).toBeVisible();
   await page.locator('#servicios div').locator('#LkbComprar').nth(0).click();
   console.log('Selecciona el primer boleto');
  
  await page.waitForTimeout(6000);

   await utils.nro_pasajeros(page, nro_pax);
   console.log(`Selecciona asiento para ${nro_pax} pasajeros`);
   await page.getByRole('link', { name: 'Continuar' }).click();
});