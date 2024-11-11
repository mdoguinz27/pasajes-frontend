# Playwright E2E Testing

Este proyecto utiliza [Playwright](https://playwright.dev/) para realizar pruebas de extremo a extremo en una aplicación web. Se incluyen dos tests principales para automatizar el flujo de compra de productos con diferentes criterios de selección y validación.

## Requisitos

- Node.js (>=14.x)
- Playwright

## Instalación

1. Clona el repositorio y navega al directorio del proyecto.

     ```bash
    git clone https://github.com/mdoguinz27/pasajes-frontend.git
    ```
     
3. Instala las dependencias con:

    ```bash
    npm install
    ```

4. Instala los navegadores necesarios para Playwright:

    ```bash
   npx playwright install
    ```

## Ejecución

Para ejecutar todos los tests, se ejeucta el siguiente comando:
    
```bash
npm run prod
 ```

En caso de querer ejecutar un caso especifico, basta con agregar el tag el cual se identifica con un @
```bash
 npm run prod -tag @ida
````

@ida para caso de BusquedaSoloIda
@vuelta para caso de BusquedaIdayVuelta
@modificar para caso donde modifica la búsqueda realizada
@caso para el caso solicitado en el challenge

## Reportes

Los reportes se visualizarán automáticamente luego de cada ejecución
![image](https://github.com/user-attachments/assets/b5c19a6b-723e-4aca-9ce3-34e2a6bf59ad)


### Justificación de las Decisiones de Diseño en la Automatización

1. **Uso de Playwright**:
   - **Rendimiento y compatibilidad multiplataforma**: Se eligió Playwright debido a su capacidad para ejecutar pruebas en múltiples navegadores (Chromium, Firefox, WebKit) y plataformas (Windows, macOS, Linux). Esto asegura que las pruebas reflejen fielmente la experiencia del usuario en diferentes entornos.

2. **Implementación de Tags Opcionales**:
   - **Flexibilidad en la ejecución de tests**: Se incorporó el uso de `tags` opcionales mediante el parámetro `--tag` para filtrar y ejecutar pruebas específicas cuando sea necesario. Esto permite a los desarrolladores concentrarse en áreas críticas sin ejecutar toda la suite.

3. **Gestión de Configuración a través de Variables de Entorno**:
   - **Separación de entornos**: La configuración de la URL base (`baseURL`) mediante variables de entorno (`ENV`) facilita la ejecución en diferentes ambientes (producción, staging) sin modificar el código. Esto garantiza una mayor flexibilidad y evita errores relacionados con entornos incorrectos.
   - **Compatibilidad con Windows y macOS**: El uso de `cross-env` asegura que los scripts funcionen correctamente en sistemas operativos con diferentes manejos de variables de entorno.

4. **Captura de Screenshots al Final de Cada Test**:
   - **Trazabilidad y diagnóstico**: Se implementó la captura automática de capturas de pantalla al final de cada prueba para facilitar la depuración en caso de fallos. Esto mejora la visibilidad del estado de la aplicación y reduce el tiempo de resolución de problemas.

5. **Funciones Reutilizables**:
   - **Modularidad y reducción de duplicación**: Se desarrollaron funciones reutilizables como `selectDate` y `selectSeat` para operaciones comunes (selección de fechas, asignación de asientos). Esto reduce la duplicación de código y facilita el mantenimiento.
   - **Abstracción para flujos complejos**: La creación de funciones específicas para manejar modales o pasos condicionales (como manejar la selección de boletos de ida y vuelta) garantiza que el código sea más legible y fácil de extender.

6. **Estrategia de Manejo de Excepciones**:
   - **Tolerancia a fallos**: En escenarios donde no se encuentran boletos, se diseñaron pruebas para capturar y manejar modales informativos, finalizando la prueba de manera exitosa si no hay disponibilidad. Esto simula mejor los flujos reales de usuario y evita fallos innecesarios.

### Beneficios de las Decisiones Tomadas:
- **Mantenibilidad**: La modularidad y reutilización del código simplifican el mantenimiento y la extensión de la suite.
- **Eficiencia**: El filtrado por etiquetas y la configuración dinámica aseguran que los desarrolladores puedan ejecutar solo las pruebas necesarias en cada entorno.
- **Confiabilidad**: La captura de errores y manejo robusto de excepciones mejora la estabilidad de las pruebas en escenarios dinámicos. 

Estas decisiones reflejan un enfoque orientado a la calidad, la flexibilidad y la eficiencia en el desarrollo de la automatización.
