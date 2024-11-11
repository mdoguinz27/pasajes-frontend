import { expect } from '@playwright/test';
import { geoModal } from '../pages/homePage';
import { product } from '../pages/productPage';

export async function closeGeoModal(page) {
    await expect(page.locator(geoModal)).toBeVisible();
    await page.locator(closeModalButton).click();
}
// Función para añadir el código postal en el modal
export async function verifyAndEnterPostalCode(page, code) {
    await page.locator(product.postalCodeField).fill(code);
    await page.locator(product.postalCodeField).press('Enter');
}

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
    const botonesHabilitados = await page.locator('div.grid.free a');

    // Comprobamos cuántos botones hay disponibles
    const cantidadBotones = await botonesHabilitados.count();

    // Limitar la selección al número de pasajeros solicitado
    const botonesASeleccionar = Math.min(pasajeros, cantidadBotones);

    // Hacemos clic en los primeros 'botonesASeleccionar' botones habilitados
    for (let i = 0; i < botonesASeleccionar; i++) {
        await botonesHabilitados.nth(i).click();
    }
}

// Función que selecciona una fecha en el calendario, con opción de fecha de regreso
export const selectDate = async (page, offsetDays = 0, returnOffsetDays = null) => {
  // Obtén la fecha actual
  const today = new Date();
  
  // Suma el offset en días (0 para hoy, 5 para 5 días después)
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + offsetDays);
  
  // Obtén solo el día numérico (11, 16, etc.)
  const day = targetDate.getDate().toString();
  
  // Busca la celda en el calendario que coincida con el número del día y haz clic
  await page.getByRole('cell', { name: day, exact: true }).locator('div').click();
  await page.waitForTimeout(6000);

  // Si hay una fecha de regreso (returnOffsetDays), selecciona también esa fecha
  if (returnOffsetDays !== null) {
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + returnOffsetDays);
    const returnDay = returnDate.getDate().toString();

    // Selecciona la fecha de regreso en el calendario
    await page.getByRole('cell', { name: returnDay, exact: true }).locator('div').click();
  }
}


  
