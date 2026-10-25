# Presentación Ejecutiva — Práctica 6: Automatización de Pruebas E2E
**Universidad Nacional de San Agustín de Arequipa (UNSA)**  
**Facultad de Ingeniería de Producción y Servicios — Escuela Profesional de Ingeniería de Sistemas**  
**Curso:** Calidad de Software (Cuarto Año)  
**Docente:** M. en C. Jesús Martín Silva Fernández  
**Normativa:** ISO/IEC/IEEE 29119 (Partes 1 a 5) & ISO/IEC 25010:2023  

---

<!-- slide -->
## Diapositiva 1: Portada, Propósito y Alcance del Proyecto

### Proyecto de Calidad de Software
* **Tema:** Capítulo 6 — Automatización de Pruebas de Software con Playwright Test.
* **Sistema Bajo Prueba (SUT):** [SauceDemo Web Application](https://www.saucedemo.com/) (Sauce Labs).
* **Equipo de Trabajo (5 Integrantes):**
  1. Suclle Suca, Michael Benjamin *(Rol 1: Planificación, Requisitos y Trazabilidad)*
  2. Fernandez Huarca, Rodrigo Alexander *(Rol 2: Diseño de Casos y Línea Base Manual)*
  3. Meza Vizcarra, Cielo Cristal *(Rol 3: Automatización T01–T05 y Acciones Base)*
  4. Borda Espinoza, Gabriela Nayely *(Rol 4: Automatización T06–T11 y Data-Driven)*
  5. Ccoscco Alvis, Italo Frankdux *(Rol 5: Integración T12, Métricas, Trazas y Cierre)*

### Propósito y Alcance Técnico
* Implementar una suite de pruebas End-to-End (E2E) reproducible, modular y desasociada de datos.
* Validar 6 requisitos académicos críticos (R1 a R6) mediante 12 casos de prueba ejecutados sobre Chromium.
* Evidenciar repetibilidad mediante 3 pasadas independientes sin reintentos automáticos (`workers=1`, `retries=0`).

---

<!-- slide -->
## Diapositiva 2: Arquitectura de la Suite y Mapeo Normativo

### Separación de Responsabilidades (ISO/IEC/IEEE 29119-5:2024)
* **Keyword & Actions Layer (POM):**
  * `LoginPage.js`: Encapsula autenticación, credenciales y captura de mensajes de error.
  * `InventoryPage.js`: Gestiona catálogo, ordenamiento numérico de precios y badges.
  * `CartPage.js`: Controla persistencia de ítems y navegación al checkout.
  * `CheckoutPage.js`: Valida datos obligatorios, consistencia aritmética de subtotales/impuestos y orden final.
* **Data-Driven Layer:** Datos desacoplados en `data/testData.json` (usuarios, productos, importes y oráculos).
* **Driver & Engine:** Playwright Test v1.64 sobre protocolo DevTools/Chromium (`headless: true`).

```
  [ testData.json ] (Datos / Oráculos)
         │
         ▼
  [ automatizacion.spec.js ] (Orquestador 12 Casos T01-T12)
         │
         ▼
  [ Page Object Model (POM) ] (LoginPage, InventoryPage, CartPage, CheckoutPage)
         │
         ▼
  [ Playwright Test Engine ] ──► [ Chromium (SauceDemo.com) ]
         │
         ▼
  [ Evidencias: HTML Report, JUnit XML, Trazas, Screenshots ]
```

---

<!-- slide -->
## Diapositiva 3: Cobertura de Requisitos y Diseño de Casos

| Requisito Académico | Caso | Tipo | Oráculo Verificable Independiente | Estado |
|---|---|---|---|:---:|
| **R1: Autenticación** | `T01` | Positivo | URL `/inventory.html$` y catálogo visible | ✅ Pass |
| **R1: Autenticación** | `T02` | Negativo | Error *"Username and password do not match"*, no avanza | ✅ Pass |
| **R1: Autenticación** | `T03` | Negativo | Error *"Sorry, this user has been locked out"*, no avanza | ✅ Pass |
| **R1: Autenticación** | `T04` | Negativo | Error *"Username is required"* con campos vacíos | ✅ Pass |
| **R2: Ordenamiento** | `T05` | Funcional | Secuencia numérica no decreciente completa: $p[i] \le p[i+1]$ | ✅ Pass |
| **R3: Gestión Carrito** | `T06` | Funcional | Badge del carrito se incrementa a `1` | ✅ Pass |
| **R3: Gestión Carrito** | `T07` | Funcional | Badge desaparece (`toHaveCount(0)`) al retirar producto | ✅ Pass |
| **R3: Gestión Carrito** | `T08` | Funcional | Badge muestra `2` y ambos ítems persisten en la vista del carrito | ✅ Pass |
| **R4: Checkout Datos** | `T09` | Negativo | Error *"First Name is required"* al omitir nombre | ✅ Pass |
| **R4: Checkout Datos** | `T10` | Negativo | Error *"Postal Code is required"* al omitir código postal | ✅ Pass |
| **R5: Importes y Compra** | `T11` | Financiero | Subtotal = $\sum p_i$; Total = Subtotal + Tax ($\pm 0.01$); Confirmación visible | ✅ Pass |
| **R6: Sesión y Acceso** | `T12` | Seguridad | Logout exitoso; acceso directo a `/inventory.html` denegado | ✅ Pass |

---

<!-- slide -->
## Diapositiva 4: Resultados de las 3 Pasadas y Métricas de Calidad

### Resumen de Ejecución Repetible (`workers=1`, `retries=0`)

| Métrica de Calidad | Corrida 01 | Corrida 02 | Corrida 03 | Meta Docente / Cumplimiento |
|---|:---:|:---:|:---:|:---:|
| **Casos Ejecutados** | 12 / 12 | 12 / 12 | 12 / 12 | 100% de la suite |
| **Tasa de Aprobación** | **100% (12/12)** | **100% (12/12)** | **100% (12/12)** | Meta $\ge 83.3\%$ (**Superada**) |
| **Duración Total** | 13.81 s | 13.57 s | 13.98 s | Promedio: **13.79 s** |
| **Inestabilidad (Flaky)** | **0.0%** | **0.0%** | **0.0%** | 0 casos con resultado oscilante |
| **Cobertura Requisitos** | 6 / 6 (100%) | 6 / 6 (100%) | 6 / 6 (100%) | 100% trazabilidad a R1–R6 |

### Análisis de Retorno de Inversión (ROI)
* **Tiempo manual por pasada (12 casos):** ~15 minutos (900 s).
* **Tiempo automatizado por pasada:** 13.79 segundos.
* **Ahorro neto por pasada de regresión:** ~14.77 minutos (**98.4% de reducción**).
* **Punto de equilibrio inicial:** Con un costo de desarrollo de la suite de 180 min, la inversión se amortiza a partir de la **pasada 13** de regresión continua.

---

<!-- slide -->
## Diapositiva 5: Diagnóstico, Decisión de Aceptación y Aportes

### Clasificación de Incidentes y Comportamientos Observados
* **Defectos del Producto:** 0 defectos observados en los flujos evaluados bajo contrato estándar.
* **Fallos de Script / Entorno:** 0 fallos; localizadores estables mediante selectores semánticos `[data-test]`.
* **Límites Declarados:** No incluye pruebas de carga, seguridad de penetración ni análisis estático de código fuente (ISO/IEC 5055).

### Decisión Técnica Sustentada
> **DECISIÓN: ACEPTACIÓN DEL ALCANCE EVALUADO**  
> Se emite dictamen favorable debido a que el 100% de los casos obligatorios y complementarios se ejecutaron con éxito consistente, con 0% de inestabilidad en 3 pasadas independientes, trazabilidad completa de oráculos y preservación de artefactos reproducibles.

### Matriz de Aportes del Equipo
* **Rol 1 (M. Suclle):** Plan de pruebas, definición de alcance R1–R6, matriz de trazabilidad y gobernanza.
* **Rol 2 (R. Fernandez):** Especificación de los 12 casos de prueba, línea base manual y particiones.
* **Rol 3 (C. Meza):** Implementación de LoginPage, InventoryPage y automatización de T01–T05.
* **Rol 4 (G. Borda):** Implementación de CartPage, CheckoutPage, automatización T06–T11 y Data-Driven.
* **Rol 5 (I. Ccoscco):** Automatización de T12, orquestador de corridas, métricas de regresión e informe final.
