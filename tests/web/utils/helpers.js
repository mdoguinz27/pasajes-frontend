// web/utils/helpers.js
import { expect } from '@playwright/test';
import { geoModal, closeModalButton } from '../pages/homePage';
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
  
  
  
