# INFORME TÉCNICO DE AUTOMATIZACIÓN DE PRUEBAS
## Trabajo Parcial — Capítulo 6: Automatización de Pruebas de Software
**Curso:** Calidad de Software • Cuarto Año de Ingeniería de Sistemas  
**Institución:** Universidad Nacional de San Agustín de Arequipa (UNSA)  
**Docente:** M. en C. Jesús Martín Silva Fernández  
**Norma Central:** Familia ISO/IEC/IEEE 29119 (Partes 1 a 5)  
**Fecha:** Octubre de 2026  

---

### Integrantes del Equipo y Asignación de Roles (ISO/IEC/IEEE 29119-2)

| Integrante | Rol | Responsabilidad Principal | Revisión Cruzada Asignada |
|---|:---:|---|---|
| **Suclle Suca, Michael Benjamin** | **1** | Plan de pruebas, definición de 6 requisitos y matriz de trazabilidad. | Revisa criterios y oráculos de T09 a T12. |
| **Fernandez Huarca, Rodrigo Alexander** | **2** | Diseño de los 12 casos de prueba y ejecución de la línea base manual. | Revisa oráculos y aserciones del integrante 3. |
| **Meza Vizcarra, Cielo Cristal** | **3** | Automatización de T01–T05, LoginPage, InventoryPage y acciones comunes. | Revisa suite y selectores del integrante 4. |
| **Borda Espinoza, Gabriela Nayely** | **4** | Automatización de T06–T11, CartPage, CheckoutPage y datos desacoplados. | Revisa suite y selectores del integrante 3. |
| **Ccoscco Alvis, Italo Frankdux** | **5** | Automatización de T12, orquestación de 3 pasadas, métricas y cierre. | Verifica reproducibilidad y balance de aportes. |

---

## 1. Propósito y Resultados de Aprendizaje

El presente trabajo implementa y evalúa una suite de pruebas automatizadas End-to-End (E2E) para la aplicación web pública **SauceDemo** ([https://www.saucedemo.com/](https://www.saucedemo.com/)), proporcionada por Sauce Labs como entorno de referencia académica para validación funcional.

Siguiendo las directrices del Capítulo 6 del curso y la normativa internacional **ISO/IEC/IEEE 29119**, el equipo ha diseñado e implementado una solución técnica orientada a:
1. **Justificar la viabilidad de la automatización** frente a la ejecución manual en función del riesgo, la frecuencia de regresión y el costo de mantenimiento.
2. **Diseñar casos de prueba con oráculos independientes y verificables**, desasociados de los resultados observados durante la ejecución.
3. **Implementar una arquitectura modular basada en separación de acciones y datos** conforme a ISO/IEC/IEEE 29119-5:2024 (*Keyword-Driven Testing*) y el patrón *Page Object Model* (POM).
4. **Demostrar reproducibilidad y estabilidad** mediante la ejecución formal de tres pasadas consecutivas en Chromium sin reintentos automáticos (`workers=1`, `retries=0`).
5. **Emitir una decisión técnica fundamentada** sobre la aceptación o rechazo del alcance evaluado, distinguiendo incidentes reales de discrepancias del entorno o del script de prueba.

---

## 2. Marco Normativo y Estándares de Referencia

La práctica se rige bajo un conjunto de normas internacionales de ingeniería de software para asegurar rigor metodológico:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FAMILIA ISO/IEC/IEEE 29119                      │
├─────────────────┬──────────────────────────────────────────────────────┤
│ 29119-1:2022    │ Conceptos generales, vocabulario y definiciones.     │
│ 29119-2:2021    │ Procesos de prueba: Planificación, Diseño, Ejecución │
│                 │ y Cierre del Ciclo de Vida de Pruebas.               │
│ 29119-3:2021    │ Plantillas de documentación: Plan, Casos, Reportes.  │
│ 29119-4:2021    │ Técnicas de diseño de pruebas (caja negra y límites).│
│ 29119-5:2024    │ Pruebas modulares dirigidas por palabras clave/datos.│
├─────────────────┼──────────────────────────────────────────────────────┤
│ ISO/IEC 25010   │ Evaluación de características de calidad: Adecuación │
│ :2023           │ Funcional (Completitud, Corrección) y Fiabilidad.   │
├─────────────────┼──────────────────────────────────────────────────────┤
│ ISO/IEC 5055    │ Distinción metodológica: Medidas de código fuente    │
│ :2021           │ (análisis estático) vs. pruebas dinámicas E2E.       │
├─────────────────┼──────────────────────────────────────────────────────┤
│ W3C WebDriver / │ Estándar de comunicación y control de navegadores    │
│ DevTools CDTP   │ modernos mediante conexiones directas por WebSocket. │
└─────────────────┴──────────────────────────────────────────────────────┘
```

> **Aclaración de Conformidad:** De acuerdo con la guía docente, la aprobación del 100% de los casos o la generación de reportes automáticos no certifica por sí sola la conformidad integral con la norma ISO/IEC/IEEE 29119, la cual exige auditoría y cumplimiento de todos los requisitos normativos del sistema. La presente entrega constituye una adaptación académica rigurosa del proceso normativo.

---

## 3. Procedimiento de Pruebas y Arquitectura Técnica

### 3.1 Entorno Tecnológico y Herramientas
* **Framework:** Playwright Test v1.64.1 (Microsoft).
* **Plataforma de Ejecución:** Node.js v24.16.0 sobre Windows 10/11 x64.
* **Navegador Destino:** Chromium v1248 (Chrome for Testing 156.0.8078.4).
* **Parámetros de Estabilidad:** `--workers=1 --retries=0` (garantiza ejecución determinista y secuencial en un solo hilo sin enmascaramiento de fallas intermitentes).
* **Formatos de Evidencia:** HTML interactivo (`playwright-report`), JUnit XML (`resultados.xml`), trazas de depuración (`trace: on`) y capturas automáticas ante fallos (`screenshot: only-on-failure`).

### 3.2 Arquitectura Modular de Separación de Acciones y Datos (ISO/IEC/IEEE 29119-5)
Para evitar que los scripts de prueba dependan de cadenas de texto dispersas o selectores acoplados, la suite se estructura en tres capas desacopladas:

1. **Capa de Datos de Prueba (`data/testData.json`):** Contiene usuarios de prueba (`valid`, `locked`, `invalid`, `empty`), catálogo de productos, importes nominales y los oráculos textuales de mensajes esperados.
2. **Capa de Abstracción de Páginas / POM (`pages/`):**
   * [`LoginPage.js`](file:///C:/Programador/UNSA/CaS/pages/LoginPage.js): Encapsula la interacción con campos de credenciales y botón de submit.
   * [`InventoryPage.js`](file:///C:/Programador/UNSA/CaS/pages/InventoryPage.js): Modela catálogo, selectores de ordenamiento, botones de añadir/remover y menú de cierre de sesión.
   * [`CartPage.js`](file:///C:/Programador/UNSA/CaS/pages/CartPage.js): Gestiona la lista de productos en el carrito, persistencia y enlace a checkout.
   * [`CheckoutPage.js`](file:///C:/Programador/UNSA/CaS/pages/CheckoutPage.js): Controla el formulario de datos personales (Step One), el desglose financiero (Step Two) y la confirmación final.
3. **Capa de Ejecución y Oráculos (`tests/automatizacion.spec.js`):** Orquesta los 12 casos mediante aserciones estrictas de Playwright (`expect`), sin lógica de navegación directa en los tests.

---

## 4. Matriz de Trazabilidad y Diseño de Casos de Prueba

Se diseñaron **12 casos de prueba** con una cobertura del 100% sobre los **6 requisitos académicos** estipulados en la guía:

```
  [ Requisitos Académicos ] ──► [ Casos de Prueba T01-T12 ] ──► [ Scripts Playwright ] ──► [ Evidencias XML / HTML ]
```

| ID | Requisito Académico | Caso | Técnica de Diseño | Datos de Entrada | Oráculo Verificable Independiente |
|:---:|---|:---:|:---:|---|---|
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T01** | Partición Válida | `standard_user` / `secret_sauce` | URL final `/inventory.html$` y contenedor `[data-test="inventory-list"]` visible. |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T02** | Partición Inválida | `standard_user` / `clave_incorrecta` | Formulario visible, URL no cambia y error contiene `"Username and password do not match"`. |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T03** | Estado del Sistema | `locked_out_user` / `secret_sauce` | Error visible con texto exacto `"Sorry, this user has been locked out"`, acceso bloqueado. |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T04** | Valor Límite / Vacío | `""` / `""` | Alerta obligatoria con mensaje `"Username is required"`, URL retenida en login. |
| **R2** | Ordenar catálogo por precio ascendente. | **T05** | Validación Numérica Completa | Opción select `'lohi'` | Extracción de todos los precios de los productos y comprobación de secuencia: $\forall i: p[i] \le p[i+1]$. |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T06** | Transición de Estado | Click en `add-to-cart-sauce-labs-backpack` | Contador del badge del carrito visible con texto exacto `'1'`. |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T07** | Transición Inversa | Click en `remove-sauce-labs-backpack` | Contador del badge desaparece del DOM (`toHaveCount(0)`). |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T08** | Acumulación Múltiple | Agregar Mochila + Linterna | Badge muestra `'2'`; en `/cart.html` ambos títulos persisten y `itemCount == 2`. |
| **R4** | Exigir datos obligatorios antes de continuar compra. | **T09** | Validación de Campos | First Name: `""`, Last: `"Suclle"`, Zip: `"04001"` | Error en pantalla `"Error: First Name is required"`, URL retenida en `checkout-step-one.html`. |
| **R4** | Exigir datos obligatorios antes de continuar compra. | **T10** | Validación de Campos | First: `"Michael"`, Last: `"Suclle"`, Zip: `""` | Error en pantalla `"Error: Postal Code is required"`, bloqueo de avance a Step Two. |
| **R5** | Mostrar importes consistentes y completar compra. | **T11** | Verificación Aritmética | Mochila ($29.99) + Linterna ($9.99) + Datos válidos | 1) $\text{Subtotal} = \sum p_i = \$39.98$.<br>2) $|\text{Total} - (\text{Subtotal} + \text{Tax})| \le 0.01$.<br>3) Mensaje final: `"Thank you for your order!"`. |
| **R6** | Cerrar sesión y exigir autenticación para inventario. | **T12** | Control de Acceso / Sesión | Logout vía menú + Navegación directa a `/inventory.html` | Redirección forzada a login, formulario visible y mensaje: `"You can only access '/inventory.html' when you are logged in"`. |

### 4.1 Análisis Detallado de los Casos Complejos (Ejemplos Resueltos)
* **Caso T05 (Catálogo Ascendente):** La guía advierte que verificar únicamente el primer producto no garantiza ordenación (podría existir una anomalía intermedia). El script [`tests/automatizacion.spec.js`](file:///C:/Programador/UNSA/CaS/tests/automatizacion.spec.js#L67-L85) parsea la lista completa de precios como números flotantes y valida formalmente mediante un bucle que ningún precio sea mayor que el subsiguiente.
* **Caso T11 (Consistencia Financiera):** La comprobación no asume que la tasa tributaria de SauceDemo sea legalmente exacta, sino que valida la coherencia aritmética interna del sistema: la suma de ítems coincide con el subtotal mostrado, y el total pagado equivale exactamente al subtotal más el impuesto calculado con una tolerancia matemática de $\pm 0.01$.

---

## 5. Ejecución, Evidencias y Análisis de Métricas (3 Pasadas)

La suite fue ejecutada en tres pasadas consecutivas bajo configuración idéntica mediante el orquestador [`scripts/run_corridas.js`](file:///C:/Programador/UNSA/CaS/scripts/run_corridas.js), preservando reportes independientes en `./evidencias/`:

### 5.1 Registro Formal de las Tres Pasadas (ISO/IEC/IEEE 29119-3)

| Identificador | Fecha y Hora (UTC-5) | Casos Totales | Casos Aprobados | Casos Fallidos | Duración (s) | Tasa de Aprobación | Tasa de Inestabilidad |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Corrida-01** | 2026-10-25 18:12:47 | 12 | 12 | 0 | 13.81 s | **100.0%** | 0.0% |
| **Corrida-02** | 2026-10-25 18:13:01 | 12 | 12 | 0 | 13.57 s | **100.0%** | 0.0% |
| **Corrida-03** | 2026-10-25 18:13:15 | 12 | 12 | 0 | 13.98 s | **100.0%** | 0.0% |

### 5.2 Indicadores Clave de Calidad de la Suite

```
  Cobertura de Requisitos : [████████████████████] 100.0% (6/6 requisitos evaluados)
  Tasa de Automatización : [████████████████████] 100.0% (12/12 casos automatizados - Meta: >= 83.3%)
  Aprobación Acumulada   : [████████████████████] 100.0% (36/36 ejecuciones exitosas)
  Inestabilidad (Flaky)  : [                    ]   0.0% (0 casos oscilantes)
```

1. **Cobertura de Requisitos:** $\frac{6 \text{ requisitos evaluados}}{6 \text{ requisitos}} \times 100 = \mathbf{100.0\%}$.
2. **Tasa de Automatización:** $\frac{12 \text{ casos automatizados}}{12 \text{ casos diseñados}} \times 100 = \mathbf{100.0\%}$ (Supera holgadamente el mínimo docente de 83.3%).
3. **Tasa de Aprobación por Pasada:** $\frac{12}{12} \times 100 = \mathbf{100.0\%}$ en todas las corridas.
4. **Inestabilidad Observada (Flakiness):** $\frac{0 \text{ casos variables}}{36 \text{ ejecuciones repetidas}} \times 100 = \mathbf{0.0\%}$.

### 5.3 Análisis Económico: Tiempo de Regresión y Punto de Equilibrio (ROI)
* **Tiempo de Ejecución Manual Estimado:** La ejecución manual rigurosa de los 12 casos (navegar, ingresar credenciales, validar visualmente mensajes de error, calcular sumas numéricas de ordenamiento y comprobación de impuestos) toma en promedio **15 minutos** por pasada (900 segundos).
* **Tiempo de Ejecución Automatizada:** Promedio de **13.79 segundos** por pasada.
* **Ahorro Neto de Regresión por Pasada:**
  $$\text{Ahorro} = 900\,\text{s} - 13.79\,\text{s} = 886.21\,\text{s} \approx \mathbf{14.77\,\text{minutos por ciclo}} \quad (\mathbf{98.4\%}\text{ de reducción}).$$
* **Cálculo del Punto de Equilibrio (Break-Even Point):**  
  Asumiendo un costo docente estándar de desarrollo, refactorización y configuración de la suite de **180 minutos** (3 horas hombre):
  $$\text{Punto de Equilibrio} = \left\lceil \frac{180\,\text{min}}{14.77\,\text{min/pasada}} \right\rceil = \mathbf{13\,\text{pasadas}}.$$
  A partir de la pasada número 13 de regresión en un ciclo de integración continua (CI/CD), la inversión inicial en automatización resulta financieramente rentable para el proyecto.

---

## 6. Clasificación de Incidentes y Límites del Estudio

### 6.1 Clasificación de Fallos e Incidentes Observados
Conforme al procedimiento de análisis y control de ISO/IEC/IEEE 29119-2, los eventos observados se categorizan formalmente:
* **Defectos del Producto:** **0 defectos detectados.** Los 12 comportamientos evaluados en SauceDemo respondieron en estricta conformidad con el contrato funcional esperado.
* **Fallos de Script de Prueba:** **0 fallos.** Los localizadores basados en atributos dedicados `[data-test]` evitaron fragilidad ante cambios de layout o estilos CSS.
* **Fallos de Datos de Prueba:** **0 fallos.** Los datos aislados en `testData.json` garantizaron independencia y reproducibilidad.
* **Fallos de Entorno o Infraestructura:** **0 fallos.** La conexión HTTPS hacia `saucedemo.com` se mantuvo estable con latencias por acción inferiores a 300 ms.

### 6.2 Límites Declarados del Estudio
Para evitar conclusiones erróneas sobre la calidad total del software, se declaran los siguientes límites metodológicos:
1. **Ausencia de Cobertura de Código Fuente:** Las pruebas E2E evalúan el comportamiento observable desde la interfaz gráfica; no miden cobertura de sentencias ni ramas en el código del servidor o cliente.
2. **Ausencia de Pruebas No Funcionales:** No se realizaron pruebas de rendimiento bajo carga concurrente, estrés ni consumo de memoria.
3. **Ausencia de Pruebas de Seguridad y Penetración:** La suite no evalúa inyección SQL, vulnerabilidades XSS ni resistencia a ataques de sesión.
4. **Alcance E2E Restringido:** Se priorizó el nivel superior de la pirámide de pruebas (E2E) por disponibilidad de la aplicación en la nube; no sustituye la base de pruebas unitarias o de integración.

---

## 7. Criterios de Aceptación y Decisión Técnica Sustentada

### Criterios de Decisión Aplicados
* **Criterio 1:** Ejecución exitosa y reproducible de todos los casos de prueba obligatorios.
* **Criterio 2:** 0% de fallos críticos sin resolver o sin explicación técnica.
* **Criterio 3:** Disponibilidad completa de versiones, dependencias y comandos reproducibles en un solo clic.

### Dictamen Final
> ### ✅ DECISIÓN FORMAL: ACEPTACIÓN DEL ALCANCE EVALUADO
> **Sustentación:**  
> La suite de pruebas automatizadas sobre **SauceDemo** ha demostrado un **100% de tasa de aprobación** en tres ejecuciones independientes consecutivas sin reintentos automáticos, con una cobertura total de los 6 requisitos académicos (R1 a R6) y 0% de inestabilidad (*flakiness*). La separación estricta entre acciones reutilizables (POM) y datos garantiza mantenibilidad a largo plazo, satisfaciendo los criterios pedagógicos y normativos de la práctica.

---

## 8. Registro de Aportes y Gobernanza del Equipo

| Integrante | Rol | Código y Artefactos Entregados | Decisión Técnica Justificada |
|---|:---:|---|---|
| **Suclle Suca, Michael Benjamin** | 1 | `playwright.config.js`, `INFORME_PRACTICA_6.md`, Matriz de Trazabilidad R1–R6. | Se eligió `workers=1` y `retries=0` para asegurar que las pruebas reflejen la estabilidad real del sistema sin enmascarar fallos intermitentes. |
| **Fernandez Huarca, Rodrigo Alexander** | 2 | Casos T01–T12 en informe, tablas de partición de equivalencia y línea base manual. | Se adoptó la técnica de valores límite para los campos de autenticación y checkout, identificando mensajes de error específicos por campo. |
| **Meza Vizcarra, Cielo Cristal** | 3 | [`pages/LoginPage.js`](file:///C:/Programador/UNSA/CaS/pages/LoginPage.js), [`pages/InventoryPage.js`](file:///C:/Programador/UNSA/CaS/pages/InventoryPage.js), tests T01 a T05. | En T05 se implementó la extracción completa de precios en un arreglo numérico para verificar $p[i] \le p[i+1]$, evitando el falso positivo de comparar solo el primer ítem. |
| **Borda Espinoza, Gabriela Nayely** | 4 | [`pages/CartPage.js`](file:///C:/Programador/UNSA/CaS/pages/CartPage.js), [`pages/CheckoutPage.js`](file:///C:/Programador/UNSA/CaS/pages/CheckoutPage.js), [`data/testData.json`](file:///C:/Programador/UNSA/CaS/data/testData.json), tests T06 a T11. | En T11 se utilizó una tolerancia matemática de $\pm 0.01$ en la comprobación del total para prevenir errores de redondeo de punto flotante en JavaScript. |
| **Ccoscco Alvis, Italo Frankdux** | 5 | Test T12, [`scripts/run_corridas.js`](file:///C:/Programador/UNSA/CaS/scripts/run_corridas.js), [`ejecutar_pruebas.bat`](file:///C:/Programador/UNSA/CaS/ejecutar_pruebas.bat), consolidado de métricas. | Se implementó el archivado automático de reportes HTML y JUnit en subcarpetas separadas (`corrida-01`, `corrida-02`, `corrida-03`) para garantizar trazabilidad forense. |

---

## 9. Referencias y Bibliografía Oficial
1. **ISO/IEC/IEEE 29119-1:2022** — *Software and systems engineering — Software testing — Part 1: General concepts*.
2. **ISO/IEC/IEEE 29119-2:2021** — *Part 2: Test processes*.
3. **ISO/IEC/IEEE 29119-3:2021** — *Part 3: Test documentation*.
4. **ISO/IEC/IEEE 29119-4:2021** — *Part 4: Test techniques*.
5. **ISO/IEC/IEEE 29119-5:2024** — *Part 5: Keyword-driven testing*.
6. **ISO/IEC 25010:2023** — *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*.
7. **ISO/IEC 5055:2021** — *Software measurement — Software quality measurement — Automated source code quality metrics*.
8. **Microsoft Corporation** — *Playwright Documentation: Fast and reliable end-to-end testing for modern web apps*, [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro).
