# 🚌 Pasajes Frontend - E2E Testing con Playwright

Suite de pruebas automatizadas end-to-end para [Central de Pasajes](https://www.centraldepasajes.com.ar/) utilizando [Playwright](https://playwright.dev/).

## 📋 Requisitos

- Node.js (>=14.x)
- npm

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/mdoguinz27/pasajes-frontend.git
cd pasajes-frontend

# Instalar dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

## ▶️ Ejecución de Tests

### Ejecutar todos los tests
```bash
npm run prod
```

### Ejecutar test específico por tag
```bash
npm run prod --tag @ida
npm run prod --tag @vuelta
npm run prod --tag @modificar
npm run prod --tag @caso
```

### Ejecutar archivo específico
```bash
npx playwright test BusquedaSoloIda.spec.js
npx playwright test BusquedaIdayVuelta.spec.js
```

---

## 🧪 Descripción de Tests

### `@ida` - Búsqueda Solo Ida
**Archivo:** `tests/web/scenarios/BusquedaSoloIda.spec.js`

| Paso | Acción |
|------|--------|
| 1 | Navega a la página principal |
| 2 | Selecciona origen: Buenos Aires |
| 3 | Selecciona destino: Córdoba |
| 4 | Selecciona fecha de ida (5 días adelante) |
| 5 | Selecciona 3 pasajeros |
| 6 | Ejecuta búsqueda |
| 7 | Selecciona primer boleto disponible |
| 8 | Selecciona asientos para 3 pasajeros |
| 9 | Hace clic en Continuar |

---

### `@vuelta` - Búsqueda Ida y Vuelta
**Archivo:** `tests/web/scenarios/BusquedaIdayVuelta.spec.js`

| Paso | Acción |
|------|--------|
| 1 | Navega a la página principal |
| 2 | Selecciona origen: Capital Federal |
| 3 | Selecciona destino: Bariloche |
| 4 | Activa opción "Ida y vuelta" |
| 5 | Selecciona fecha ida (2 días) y vuelta (5 días) |
| 6 | Selecciona 2 pasajeros |
| 7 | Ejecuta búsqueda |
| 8 | Selecciona boleto de IDA + asientos |
| 9 | Selecciona boleto de VUELTA + asientos |

---

### `@modificar` - Modificar Búsqueda
**Archivo:** `tests/web/scenarios/ModificarBusqueda.spec.js`

| Paso | Acción |
|------|--------|
| 1 | Realiza búsqueda inicial (Capital Federal → Córdoba) |
| 2 | Hace clic en "Modificar" |
| 3 | Cambia a "Ida y vuelta" |
| 4 | Agrega fecha de vuelta |
| 5 | Actualiza búsqueda |
| 6 | Ordena resultados por menor precio |
| 7 | Verifica que los resultados se muestren |

---

### `@caso` - Caso Requerido (Challenge)
**Archivo:** `tests/web/scenarios/CasoRequerido.spec.js`

| Paso | Acción |
|------|--------|
| 1 | Navega a la página principal |
| 2 | Selecciona origen: Capital Federal |
| 3 | Selecciona destino: Bariloche |
| 4 | Activa "Ida y vuelta" |
| 5 | Selecciona fechas (2 días ida, 6 días vuelta) |
| 6 | Selecciona 1 pasajero |
| 7 | Ejecuta búsqueda y verifica resultados |

---

## 📁 Estructura del Proyecto

```
pasajes-frontend/
├── tests/
│   ├── common/                    # Recursos compartidos
│   └── web/
│       ├── pages/                 # Page Objects
│       │   ├── homePage.js        # Selectores de la página principal
│       │   ├── productPage.js     # Selectores de página de producto
│       │   └── resultsPage.js     # Selectores de resultados
│       ├── scenarios/             # Tests E2E
│       │   ├── BusquedaSoloIda.spec.js
│       │   ├── BusquedaIdayVuelta.spec.js
│       │   ├── CasoRequerido.spec.js
│       │   └── ModificarBusqueda.spec.js
│       └── utils/
│           └── helpers.js         # Funciones reutilizables
├── screenshots/                   # Capturas automáticas
├── playwright-report/             # Reportes HTML
├── test-results/                  # Videos y traces
├── playwright.config.js           # Configuración Playwright
└── .env                          # Variables de entorno
```

---

## 🔧 Funciones Helper

| Función | Descripción |
|---------|-------------|
| `selectDate(page, offsetDays)` | Selecciona una fecha en el calendario (offset en días desde hoy) |
| `selectSeat(page, pasajeros)` | Selecciona N asientos disponibles en el mapa |
| `seleccionarBoleto(page, tramo, nro_pax)` | Selecciona boleto, asientos y continúa al siguiente paso |

---

## 📊 Reportes

Los reportes HTML se generan y abren automáticamente después de cada ejecución.

**Ver trace de un test fallido:**
```bash
npx playwright show-trace test-results/[nombre-del-test]/trace.zip
```

---

## ⚙️ Configuración

### Variables de Entorno (`.env`)
```
PROD_URL=https://www.centraldepasajes.com.ar/
```

### Playwright Config
- **Timeout:** 120 segundos
- **Navegador:** Chromium
- **Video:** Activado
- **Trace:** Activado
- **Headless:** Solo en CI

---

## 🎯 Decisiones de Diseño

1. **Page Object Pattern** - Selectores centralizados en archivos separados para facilitar mantenimiento
2. **Funciones reutilizables** - `helpers.js` contiene lógica común (fechas, asientos, boletos)
3. **Manejo de modales** - Tests manejan gracefully cuando no hay disponibilidad de pasajes
4. **Tags para filtrado** - Permite ejecutar tests específicos sin correr toda la suite
5. **Screenshots automáticos** - Captura al final de cada test para debugging
6. **Videos y traces** - Habilitados para diagnóstico de fallos

---

## 📝 Notas

- Los tests dependen de la disponibilidad real de pasajes en el sitio
- Si no hay pasajes disponibles, el test termina exitosamente mostrando el modal informativo
- Las fechas se calculan dinámicamente desde la fecha actual
