import { expect } from '@playwright/test';
import { product } from '../pages/productPage';
import { results } from "../pages/resultsPage";


// espera a que cargue la página
export const waitForPageLoad = async (page) => {
    await page.waitForLoadState('load');
  };
 
  // ingreso de texto
  export const safeFill = async (page, selector, text) => {
    await waitForPageLoad(page);  // Asegura que la página esté lista
    await page.fill(selector, text);
  };
  
  // click a un elemento
  export const safeClick = async (page, selector) => {
    await waitForPageLoad(page);  // Asegura que la página esté lista
    await page.click(selector);
  };
  
  export const nro_pasajeros = async (page, pasajeros) => {
    // Seleccionamos los botones habilitados (con la clase 'grid free')
    const botonesHabilitados = await page.locator(product.seatingPax);

    // Comprobamos cuántos botones hay disponibles
    const cantidadBotones = await botonesHabilitados.count();
    if (cantidadBotones === 0) {
      console.log("No hay asientos disponibles.");
      return; // Termina si no hay asientos
  }

    // Limitar la selección al número de pasajeros solicitado
    const botonesASeleccionar = Math.min(pasajeros, cantidadBotones);

    for (let i = 0; i < botonesASeleccionar; i++) {
        await botonesHabilitados.nth(i).click();
        console.log(`Selecciona asiento ${i+1}`)
    }
}

// Función que selecciona una fecha en el calendario, con opción de fecha de regreso
export const selectDate = async (page, offsetDays = 0) => {
  // Obtén la fecha actual
  const today = new Date();
  
  // Suma el offset en días (0 para hoy, 5 para 5 días después)
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offsetDays);
  
  // Obtén solo el día numérico (11, 16, etc.)
  const day = targetDate.getDate().toString();
  
  // Busca la celda en el calendario que coincida con el número del día y haz clic
  await expect(page.getByRole('cell', { name: day, exact: true }).locator('div')).toBeVisible();
  await page.getByRole('cell', { name: day, exact: true }).locator('div').click();

}

export const seleccionarBoleto = async (page, tramo, nro_pax) => {
  await expect(page.locator(results.resultsTickets)).toBeVisible();
  
  // Selecciona el primer boleto disponible
  await page.locator('#servicios div').locator(results.ticket).nth(0).click();
  console.log(`Selecciona boleto para ${tramo}`);
  
  await page.waitForLoadState('load');
  
  // Selecciona asientos según el número de pasajeros
  await nro_pasajeros(page, nro_pax);
  
  // Continuar al siguiente paso
  await page.getByRole('link', { name: 'Continuar' }).click({force:true});
  console.log(`[${tramo}] Selecciona asiento para ${nro_pax} pasajeros`);
}

  
