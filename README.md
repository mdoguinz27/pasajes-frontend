# Playwright E2E Testing

Este proyecto utiliza [Playwright](https://playwright.dev/) para realizar pruebas de extremo a extremo en una aplicación web. Se incluyen dos tests principales para automatizar el flujo de compra de productos con diferentes criterios de selección y validación.

## Requisitos

- Node.js (>=14.x)
- Playwright

## Instalación

1. Clona el repositorio y navega al directorio del proyecto.
2. Instala las dependencias con:

    ```bash
    npm install
    ```

3. Instala los navegadores necesarios para Playwright:

    ```bash
    npx playwright install
    ```

## Estructura del Proyecto

- **`pages/`**: Contiene archivos de páginas (`homePage.js`, `productPage.js`, `resultsPage.js`) que representan diferentes secciones de la aplicación.
- **`utils/`**: Contiene helpers para tareas comunes, como la función `verifyAndEnterPostalCode`.
- **`tests/`**: Contiene los archivos de test (`CasoLibre.spec.js`) con los escenarios de prueba.

## Tests

### 1. `CasoLibre`

Este test navega a la página principal, ingresa al menú "Ofertas", filtra por marca y ordena por precio, añade un producto al carrito y finaliza verificando dentro del carrito que el producto haya sido agregado

**Pasos del test**:

1. Navega a la página principal.
2. Ingresa el código postal en el modal de geolocalización.
3. Accede al menú de Ofertas.
4. Filtra por una marca específica y ordena por "Menor precio".
5. Selecciona el segundo producto del listado de resultados.
6. Verifica que el precio del producto sea visible.
7. Agrega el producto al carrito.
8. Ingresa al carrito y verifica que el botón "Finalizar Compra" esté disponible.

### 2. `Añade al carrito Heladera Samsung`

Este test busca un producto específico (Heladera Samsung) y lo añade al carrito.

**Pasos del test**:

1. Navega a la página principal.
2. Ingresa el código postal en el modal de geolocalización.
3. Busca el producto en el campo de búsqueda.
4. Selecciona el segundo producto del listado de resultados.
5. Verifica que el precio del producto sea visible.
6. Agrega el producto al carrito.
7. Ingresa al carrito y verifica que el producto esté añadido.

## Ejecución de los Tests

Para ejecutar ambos tests, utiliza el siguiente comando:

```bash
npm run test_prod            
````

Este test puede ejecutarse en 3 ambientes diferentes (qa, dev, prod) donde los 2 primeros poseen urls ficticias, al finalizar la ejecución de los tests, se abrirá automaticamente un reporte de la ejecución de los mismos

fravega-frontend
├── tests
│   ├── common
│   │   └── config.js          # Configuración general (URLs, variables compartidas, etc.)
│   ├── web
│   │   ├── pages              # Páginas organizadas por componentes de UI o áreas funcionales
│   │   │   ├── cartPage.js       # Página del carrito con selectores y métodos de interacción
│   │   │   ├── homePage.js       # Página de inicio con selectores y métodos de interacción
│   │   │   ├── productPage.js    # Página de producto con selectores y métodos de interacción
│   │   │   └── resultsPage.js    # Página de resultados con selectores y métodos de interacción
│   │   └── scenarios           # Escenarios de prueba completos, organizados por flujo o caso de uso
│   │       └── testExample.spec.js  # Ejemplo de caso de prueba (p. ej., CasoLibre.spec.js)
│   └── utils
│       └── helpers.js          # Funciones auxiliares (e.g., ingreso de código postal, waits)
└── README.md
