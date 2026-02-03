import { expect } from '@playwright/test';
import { product } from '../pages/productPage';
import { results } from "../pages/resultsPage";

export const selectSeat = async (page, pasajeros) => {
  // Seleccionamos los botones habilitados (con la clase 'grid free')
  const botonesHabilitados = page.locator(product.seatingPax);

  // Esperar a que al menos un asiento esté disponible
  try {
    await botonesHabilitados.first().waitFor({ state: 'visible', timeout: 15000 });
  } catch {
    console.log("No hay asientos disponibles o no se cargaron.");
    return false;
  }

  // Comprobamos cuántos botones hay disponibles
  const cantidadBotones = await botonesHabilitados.count();
  if (cantidadBotones === 0) {
    console.log("No hay asientos disponibles.");
    return false;
  }

  // Limitar la selección al número de pasajeros solicitado
  const botonesASeleccionar = Math.min(pasajeros, cantidadBotones);

  for (let i = 0; i < botonesASeleccionar; i++) {
    await botonesHabilitados.nth(i).click();
    await page.waitForLoadState('load');
    console.log(`Selecciona asiento ${i + 1}`);
  }

  return true;
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
  const dateCell = page.getByRole('cell', { name: day, exact: true }).locator('div');
  await expect(dateCell).toBeVisible({ timeout: 10000 });
  await dateCell.click();
}

export const seleccionarBoleto = async (page, tramo, nro_pax) => {
  // Esperar a que los resultados sean visibles
  await expect(page.locator(results.resultsTickets)).toBeVisible({ timeout: 30000 });

  // Selecciona el primer boleto disponible
  const boletosDisponibles = page.locator('#servicios div').locator(results.ticket);
  await boletosDisponibles.first().waitFor({ state: 'visible', timeout: 15000 });
  await boletosDisponibles.nth(0).click();
  console.log(`Selecciona boleto para ${tramo}`);

  await page.waitForLoadState('load');

  // Selecciona asientos según el número de pasajeros
  const seatsSelected = await selectSeat(page, nro_pax);

  if (!seatsSelected) {
    console.log(`No se pudieron seleccionar asientos para ${tramo}`);
    return;
  }

  // Esperar a que el botón Continuar esté visible
  const continuarBtn = page.getByRole('link', { name: 'Continuar' });

  try {
    await continuarBtn.waitFor({ state: 'visible', timeout: 20000 });
    await continuarBtn.click({ force: true });
    console.log(`[${tramo}] Selecciona asiento para ${nro_pax} pasajeros`);
  } catch (error) {
    // Intentar buscar por texto alternativo
    const continuarAlt = page.locator('a:has-text("Continuar")');
    await continuarAlt.first().click({ force: true });
    console.log(`[${tramo}] Selecciona asiento para ${nro_pax} pasajeros (alt)`);
  }

  await page.waitForLoadState('load');
}
