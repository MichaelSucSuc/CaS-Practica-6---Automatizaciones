# Práctica 6 — Automatización de Pruebas de Software (ISO/IEC/IEEE 29119)

[![Playwright Tests](https://img.shields.io/badge/Playwright-v1.64-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-v24.16-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Chromium](https://img.shields.io/badge/Browser-Chromium-4285F4?logo=google-chrome&logoColor=white)](https://www.google.com/chrome/)
[![Tests Pass](https://img.shields.io/badge/Tests-12%2F12%20Passed-brightgreen)](./evidencias/resumen_corridas.md)
[![Standard](https://img.shields.io/badge/Norma-ISO%2FIEC%2FIEEE%2029119-blue)](https://www.iso.org/standard/79428.html)

Repositorio oficial del **Trabajo Parcial — Capítulo 6: Automatización de Pruebas de Software** del curso **Calidad de Software** (Cuarto año de Ingeniería de Sistemas), Universidad Nacional de San Agustín de Arequipa (UNSA).

---

## 👥 Equipo de Trabajo (Roles ISO/IEC/IEEE 29119-2)

* **Suclle Suca, Michael Benjamin** — *Rol 1: Plan de pruebas, requisitos R1–R6 y matriz de trazabilidad*
* **Fernandez Huarca, Rodrigo Alexander** — *Rol 2: Diseño de los 12 casos y ejecución de línea base manual*
* **Meza Vizcarra, Cielo Cristal** — *Rol 3: Automatización T01–T05, LoginPage, InventoryPage y acciones base*
* **Borda Espinoza, Gabriela Nayely** — *Rol 4: Automatización T06–T11, CartPage, CheckoutPage y Data-Driven*
* **Ccoscco Alvis, Italo Frankdux** — *Rol 5: Integración T12, orquestación de 3 pasadas, métricas y cierre*

---

## 📁 Estructura del Repositorio

```text
CaS/
├── data/
│   └── testData.json              # Capa de datos y oráculos desacoplados (ISO 29119-5)
├── pages/                         # Page Object Model (POM) con acciones reutilizables
│   ├── LoginPage.js               # Acciones de autenticación y captura de errores
│   ├── InventoryPage.js           # Catálogo, ordenamiento numérico de precios y logout
│   ├── CartPage.js                # Validación de persistencia de productos en carrito
│   └── CheckoutPage.js            # Formularios, comprobaciones aritméticas y confirmación
├── tests/
│   └── automatizacion.spec.js     # Suite de 12 casos automatizados sobre 6 requisitos
├── scripts/
│   └── run_corridas.js            # Orquestador formal de las 3 pasadas sin reintentos
├── evidencias/                    # Registro histórico de las 3 pasadas
│   ├── corrida-01/                # Reporte HTML, JUnit XML y logs de la Pasada 1
│   ├── corrida-02/                # Reporte HTML, JUnit XML y logs de la Pasada 2
│   ├── corrida-03/                # Reporte HTML, JUnit XML y logs de la Pasada 3
│   ├── resumen_corridas.json      # Métricas consolidadas en formato JSON
│   └── resumen_corridas.md        # Tabla de métricas y análisis de estabilidad
├── INFORME_PRACTICA_6.md          # Informe técnico académico completo (4-6 páginas)
├── PRESENTACION.md                # Diapositivas ejecutivas (exactamente 5 láminas)
├── ejecutar_pruebas.bat           # Lanzador de un clic para Windows
├── playwright.config.js           # Configuración oficial Playwright (Chromium, 1 worker, 0 retries)
├── package.json                   # Dependencias y scripts de ejecución
└── README.md                      # Documentación del proyecto
```

---

## 🚀 Inicio Rápido y Ejecución

### Opción A: Lanzador de un solo clic (Windows)
Haz doble clic en:
```bat
ejecutar_pruebas.bat
```
El script verificará el entorno, ejecutará las 3 pasadas consecutivas y abrirá el reporte interactivo de Playwright en tu navegador.

### Opción B: Por línea de comandos

1. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Instalar binarios del navegador Chromium (si es primera vez):**
   ```bash
   npx playwright install chromium
   ```

3. **Ejecutar la suite completa de pruebas:**
   ```bash
   npm test
   ```

4. **Ejecutar formalmente las 3 pasadas de evidencia (`corrida-01`, `corrida-02`, `corrida-03`):**
   ```bash
   npm run corridas:todas
   ```

5. **Visualizar el reporte interactivo HTML:**
   ```bash
   npm run report
   ```

---

## 📊 Matriz de Cobertura de Requisitos (SauceDemo.com)

| Requisito Académico | Caso | Tipo | Descripción | Resultado |
|---|:---:|:---:|---|:---:|
| **R1: Autenticación** | `T01` | Positivo | Login válido con credenciales estándar -> Acceso a inventario | ✅ Aprobado |
| **R1: Autenticación** | `T02` | Negativo | Login con contraseña incorrecta -> Mensaje de rechazo | ✅ Aprobado |
| **R1: Autenticación** | `T03` | Negativo | Login con usuario bloqueado -> Notificación de bloqueo | ✅ Aprobado |
| **R1: Autenticación** | `T04` | Negativo | Login con campos vacíos -> Alerta de usuario obligatorio | ✅ Aprobado |
| **R2: Catálogo** | `T05` | Funcional | Ordenar por precio ascendente -> Comprobación completa $\forall i: p[i] \le p[i+1]$ | ✅ Aprobado |
| **R3: Carrito** | `T06` | Funcional | Agregar 1 producto -> Contador del badge se incrementa a 1 | ✅ Aprobado |
| **R3: Carrito** | `T07` | Funcional | Retirar producto -> Contador del badge desaparece del DOM | ✅ Aprobado |
| **R3: Carrito** | `T08` | Funcional | Agregar 2 productos -> Ambos persisten en la vista del carrito | ✅ Aprobado |
| **R4: Checkout** | `T09` | Negativo | First Name vacío en compra -> Error obligatorio | ✅ Aprobado |
| **R4: Checkout** | `T10` | Negativo | Postal Code vacío en compra -> Error obligatorio | ✅ Aprobado |
| **R5: Importes** | `T11` | Financiero | Consistencia: $\text{Subtotal} = \sum p_i$; $\text{Total} = \text{Subtotal} + \text{Tax}$ ($\pm 0.01$) | ✅ Aprobado |
| **R6: Sesión** | `T12` | Seguridad | Logout y bloqueo de acceso directo por URL al inventario | ✅ Aprobado |

---

## 📈 Resultados Consolidados de las 3 Pasadas

| Pasada | Duración | Casos Evaluados | Aprobados | Fallidos | Tasa Aprobación | Inestabilidad (Flaky) |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Corrida-01** | 13.81 s | 12 | 12 | 0 | **100%** | **0.0%** |
| **Corrida-02** | 13.57 s | 12 | 12 | 0 | **100%** | **0.0%** |
| **Corrida-03** | 13.98 s | 12 | 12 | 0 | **100%** | **0.0%** |

* **Tiempo promedio automatizado:** 13.79 segundos.
* **Tiempo manual estimado:** 15 minutos (900 segundos).
* **Ahorro neto por pasada:** 14.77 minutos (**98.4% de ahorro**).
* **Punto de equilibrio inicial:** Amortizado a partir de la pasada 13.

---

## 📑 Documentos y Entregables Principales
* [INFORME_PRACTICA_6.md](./INFORME_PRACTICA_6.md): Informe técnico de 4–6 páginas con justificación metodológica, oráculos y decisión de aceptación.
* [PRESENTACION.md](./PRESENTACION.md): Diapositivas de defensa ejecutiva (máximo 5 diapositivas).
* [evidencias/resumen_corridas.md](./evidencias/resumen_corridas.md): Registro forense de tiempos y estados por corrida.
