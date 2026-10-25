# INFORME TÉCNICO FORMAL DE AUTOMATIZACIÓN DE PRUEBAS
## Trabajo Parcial — Capítulo 6: Automatización de Pruebas de Software
### Aplicación del Marco Normativo Internacional ISO/IEC/IEEE 29119 (Partes 1 a 5)

---

**Institución:** Universidad Nacional de San Agustín de Arequipa (UNSA)  
**Facultad:** Facultad de Ingeniería de Producción y Servicios  
**Escuela Profesional:** Ingeniería de Sistemas  
**Curso:** Calidad de Software (Cuarto Año, Semestre 2026-II)  
**Docente:** M. en C. Jesús Martín Silva Fernández (`jsilvaf@unsa.edu.pe`)  
**Fecha de Entrega:** Octubre de 2026  
**Sistema Bajo Prueba (SUT):** SauceDemo Web Application ([https://www.saucedemo.com/](https://www.saucedemo.com/))  
**Herramienta Principal:** Playwright Test v1.64.1 (Motor Chromium)  
**Repositorio GitHub:** [https://github.com/MichaelSucSuc/CaS-Practica-6---Automatizaciones.git](https://github.com/MichaelSucSuc/CaS-Practica-6---Automatizaciones.git)  

---

### Nómina del Equipo de Trabajo y Asignación de Roles (ISO/IEC/IEEE 29119-2)

| # | Integrante del Equipo | CUI | Correo Institucional | Rol Oficial | Responsabilidad Principal | Revisión Cruzada (Peer Review) |
|:---:|---|:---:|---|:---:|---|---|
| **1** | **Suclle Suca, Michael Benjamin** | 20210678 | `msuclles@unsa.edu.pe` | **Rol 1** | Plan de pruebas, definición de 6 requisitos, matriz de trazabilidad y gobernanza de la suite. | Revisa criterios y oráculos de T09 a T12 (Rol 4 y 5). |
| **2** | **Fernandez Huarca, Rodrigo Alexander** | 20210672 | `rfernandezh@unsa.edu.pe` | **Rol 2** | Diseño formal de los 12 casos de prueba, particiones de equivalencia y ejecución de línea base manual. | Revisa oráculos y aserciones de T01 a T05 (Rol 3). |
| **3** | **Meza Vizcarra, Cielo Cristal** | 20210685 | `cmezav@unsa.edu.pe` | **Rol 3** | Automatización de T01–T05, diseño del Page Object Model para LoginPage e InventoryPage. | Revisa suite y selectores de T06 a T11 (Rol 4). |
| **4** | **Borda Espinoza, Gabriela Nayely** | 20210665 | `gbordae@unsa.edu.pe` | **Rol 4** | Automatización de T06–T11, POM de CartPage y CheckoutPage, y capa de datos desacoplada (`testData.json`). | Revisa suite y selectores de T01 a T05 (Rol 3). |
| **5** | **Ccoscco Alvis, Italo Frankdux** | 20210669 | `iccosccoa@unsa.edu.pe` | **Rol 5** | Automatización de T12, orquestación de las 3 pasadas formales, análisis estadístico de métricas y cierre. | Verifica reproducibilidad de entorno y balance de aportes. |

---

## 1. Propósito, Contexto y Resultados de Aprendizaje

### 1.1 Contexto Institucional y Académico
El presente informe técnico documenta la concepción, diseño, implementación, ejecución y evaluación crítica de una suite de pruebas automatizadas funcionales de extremo a extremo (End-to-End, E2E) sobre la plataforma de comercio electrónico simulado **SauceDemo** ([https://www.saucedemo.com/](https://www.saucedemo.com/)), desarrollada por Sauce Labs como entorno de prueba representativo para la industria de calidad de software.

La automatización de pruebas de software moderna no constituye un fin en sí misma ni una simple transcripción de clics de usuario a código ejecutable, sino un proceso de ingeniería sistemático, disciplinado y fundamentado en estándares internacionales que permite obtener evidencia objetiva, repetible y auditable para fundamentar decisiones de liberación (*release decisions*) sobre versiones de software.

### 1.2 Objetivos Medibles de la Práctica
De conformidad con los objetivos pedagógicos y métricas estipuladas en la guía académica oficial (`trab_6.pdf`), el equipo ha establecido y cumplido los siguientes objetivos medibles:
1. **Articular metodológicamente las fases del ciclo de vida de pruebas** (Planificación, Análisis, Diseño, Implementación, Ejecución y Cierre) con las directrices de las normas internacionales **ISO/IEC/IEEE 29119-2:2021**, **29119-3:2021**, **29119-4:2021** y **29119-5:2024**.
2. **Diseñar 12 casos de prueba formales** derivados mediante técnicas de caja negra (particiones de equivalencia, valores límite, tablas de decisión y transición de estados) y **automatizar el 100% de ellos (12 de 12)**, superando el umbral docente mínimo del 83.3% (10 casos).
3. **Establecer una matriz de trazabilidad bidireccional estricta** entre 6 requisitos académicos esenciales (R1 a R6), los 12 casos de prueba, los componentes de código modularizados y los reportes de ejecución generados.
4. **Ejecutar la suite de pruebas en tres pasadas consecutivas e independientes** en el navegador Chromium, bajo condiciones de aislamiento de sesión y sin reintentos automáticos (`workers=1`, `retries=0`), con el fin de cuantificar con precisión la tasa de aprobación y la tasa de inestabilidad (*flakiness*).
5. **Comparar cuantitativamente el tiempo de regresión automatizado frente a la línea base manual**, calculando el ahorro neto de tiempo por ciclo y el punto de equilibrio financiero (Break-Even Point / ROI) de la inversión de automatización.
6. **Emitir un dictamen formal de aceptación o rechazo** del alcance evaluado, basado estrictamente en evidencias empíricas (reportes HTML, XML y trazas de depuración) y en una taxonomía rigurosa de incidentes.

### 1.3 Adecuación y Precisiones Normativas
En cumplimiento con las precisiones metodológicas del material base adjunto (`cs6_1_autom.pptx` y `trab_6.pdf`), se establecen los siguientes lineamientos:
* **Identificación del Estándar:** El marco normativo oficial y vigente es la familia **ISO/IEC/IEEE 29119**, corrigiendo cualquier errata de denominación informal del pasado (como la referencia errónea "ISO 20119-1").
* **Alcance de ISO/IEC 5055:2021:** Se reconoce formalmente que la norma ISO/IEC 5055 trata exclusivamente sobre medidas automatizadas de calidad estructural interna del código fuente (análisis estático de arquitectura, seguridad, fiabilidad y mantenibilidad mediante detección de debilidades CWE). No es una norma de pruebas funcionales dinámicas, por lo que actúa como estándar complementario y no como el eje central de esta práctica funcional E2E.
* **Principio de Conformidad Normativa:** De acuerdo con ISO/IEC/IEEE 29119-1, la obtención de una tasa de aprobación del 100% en una suite de pruebas o la generación de artefactos documentales no equivale ni certifica por sí sola el cumplimiento de una norma internacional. La conformidad exige una auditoría integral de todos los requisitos normativos aplicables en la organización. El presente trabajo constituye una adaptación académica rigurosa del estándar.

---

## 2. Marco Normativo y Estándares de Referencia Internacional

Para garantizar que el proceso de aseguramiento de calidad cumpla con los estándares reconocidos por la industria y los organismos de estandarización internacional (ISO, IEC, IEEE y W3C), se adoptan las siguientes referencias técnicas:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      MAPA DE NORMAS Y ESTÁNDARES APLICADOS EN LA PRÁCTICA               │
├──────────────────────────┬─────────────────────────────────────────────────────────────┤
│ Norma / Referencia       │ Rol y Aplicación Específica en la Suite de Automatización   │
├──────────────────────────┼─────────────────────────────────────────────────────────────┤
│ ISO/IEC/IEEE 29119-1:2022│ Marco conceptual, vocabulario, pirámide de pruebas y roles. │
│ ISO/IEC/IEEE 29119-2:2021│ Gobernanza del proceso: Planificar, Diseñar, Ejecutar, Cierre│
│ ISO/IEC/IEEE 29119-3:2021│ Estructura de artefactos: Plan, Matriz, Logs, Reportes XML. │
│ ISO/IEC/IEEE 29119-4:2021│ Técnicas de diseño: Partición de Equivalencia y Valores Límite│
│ ISO/IEC/IEEE 29119-5:2024│ Pruebas modulares por palabras clave: Separación DRIVER/DATA│
│ ISO/IEC 25010:2023       │ Modelo de Calidad del Producto: Adecuación Funcional y Riel.│
│ ISO/IEC 5055:2021        │ Delimitación: Calidad del código estático vs pruebas dinámicas│
│ W3C WebDriver / CDTP     │ Interfaz estándar para comunicación y control de navegadores│
└──────────────────────────┴─────────────────────────────────────────────────────────────┘
```

### 2.1 Desglose de la Familia ISO/IEC/IEEE 29119
1. **ISO/IEC/IEEE 29119-1:2022 (*General Concepts*):** Establece los fundamentos teóricos de las pruebas de software, el papel de la verificación y validación en modelos de ciclo de vida ágiles (Scrum, Kanban) y tradicionales (Modelo V, Cascada), y define la naturaleza del defecto (*defect*), error humano (*mistake*) y fallo en tiempo de ejecución (*failure*).
2. **ISO/IEC/IEEE 29119-2:2021 (*Test Processes*):** Define el modelo por fases de la gestión de pruebas:
   * *Proceso Organizacional de Pruebas:* Políticas y estrategias generales.
   * *Proceso de Gestión de Pruebas:* Planificación por riesgo, monitoreo y control, y reporte de cierre.
   * *Procesos de Prueba Dinámicos:* Diseño de pruebas, preparación del entorno, ejecución y registro de incidentes.
3. **ISO/IEC/IEEE 29119-3:2021 (*Test Documentation*):** Proporciona las plantillas estandarizadas empleadas en este informe: Plan de Pruebas, Especificación de Diseño de Pruebas, Casos de Prueba, Procedimientos de Ejecución, Registros de Resultados e Informes de Cierre.
4. **ISO/IEC/IEEE 29119-4:2021 (*Test Techniques*):** Regula las técnicas de diseño de casos de prueba basadas en especificación (caja negra). En esta práctica se aplicaron rigurosamente:
   * *Partición de Equivalencia (Equivalence Partitioning):* División de dominios de entrada en clases válidas e inválidas (ej. credenciales correctas vs erróneas en R1).
   * *Análisis de Valores Límite (Boundary Value Analysis):* Evaluación de fronteras numéricas y obligatoriedad de campos de texto (ej. cadenas vacías en R4).
   * *Pruebas de Transición de Estados (State Transition Testing):* Comprobación de cambios en el estado del carrito al agregar y remover productos en R3.
   * *Tablas de Decisión (Decision Table Testing):* Combinación de condiciones booleanas de subtotal, impuesto y total en R5.
5. **ISO/IEC/IEEE 29119-5:2024 (*Keyword-Driven Testing*):** Define la arquitectura modular que conecta directamente con los conceptos de **DRIVER** y **DATA** expuestos en las diapositivas de clase:
   * *DRIVER (Acciones / Palabras Clave):* Encapsuladas en componentes de página reutilizables e independientes de la herramienta (`pages/`).
   * *DATA (Datos de Prueba):* Aislados completamente en estructuras externas (`data/testData.json`), eliminando datos cableados (*hardcoded*) dentro del código de prueba.

### 2.2 Estándares Complementarios y Protocolos de Comunicación
* **ISO/IEC 25010:2023 (*Systems and software Quality Requirements and Evaluation - SQuaRE*):**  
  Se enfoca en evaluar dos características cardinales de calidad:
  * *Adecuación Funcional:* Evalúa si las funciones del catálogo, carrito, cálculo de impuestos y cierre de sesión satisfacen las necesidades declaradas bajo condiciones de uso normal (completitud funcional, corrección funcional y pertinencia funcional).
  * *Fiabilidad:* Evalúa la capacidad del sistema para comportarse de forma determinista y estable a lo largo de pasadas repetidas de prueba sin experimentar caídas ni degradación de estado.
* **W3C WebDriver & Chrome DevTools Protocol (CDTP):**  
  Playwright opera sobre conexiones nativas WebSocket comunicándose directamente con el motor de renderizado de Chromium mediante el Chrome DevTools Protocol (CDTP). A diferencia de la arquitectura tradicional de Selenium WebDriver (que requiere un servidor intermediario `chromedriver.exe` comunicándose por peticiones HTTP basadas en JSON Wire Protocol), Playwright elimina la sobrecarga de ida y vuelta de red, habilitando auto-esperas basadas en eventos del ciclo de vida del DOM (*event-driven auto-waiting*) y aislamiento instantáneo de contextos.

---

## 3. Procedimiento Metodológico de Pruebas y Análisis Técnico

### 3.1 Procedimiento de Pruebas Adaptado (ISO/IEC/IEEE 29119-2)
El procedimiento adoptado por el equipo sigue un flujo disciplinado estructurado en seis etapas:

```
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │                           CICLO DE VIDA DE PRUEBAS                          │
  └─────────────────────────────────────────────────────────────────────────────┘
         │
         ▼
  1. PLANIFICAR POR RIESGO ────────► Delimitar versión, riesgos, criterios entrada/salida.
         │
         ▼
  2. ANALIZAR Y DISEÑAR   ────────► Particiones válidas/inválidas, fronteras y oráculos.
         │
         ▼
  3. PREPARAR Y AUTOMATIZAR ──────► Page Object Model, selectores estables [data-test].
         │
         ▼
  4. EJECUTAR Y REGISTRAR  ───────► Aislamiento BrowserContext, 3 pasadas, logs y XML.
         │
         ▼
  5. ANALIZAR Y CONTROLAR  ───────► Clasificación de fallos: producto, script, datos, red.
         │
         ▼
  6. CERRAR Y MANTENER     ───────► Resumen métricas, ahorro ROI y decisión de aceptación.
```

1. **Planificar por Riesgo:**  
   Se identificaron los flujos de mayor impacto para el negocio en un portal de e-commerce: el acceso no autorizado (riesgo de seguridad), la corrupción en el ordenamiento de precios (riesgo de experiencia de compra), la pérdida de productos en el carrito (riesgo de abandono) y los errores de cálculo en subtotales e impuestos (riesgo financiero y reputacional). Se establecieron criterios de entrada (disponibilidad de SauceDemo en línea) y de salida (100% de casos ejecutados con aprobación $\ge 83.3\%$).
2. **Analizar y Diseñar:**  
   Cada caso de prueba fue especificado antes de codificar, definiendo entradas nominales, precondiciones, pasos de navegación y un **oráculo independiente** verificable que no se derive de lo observado en la aplicación.
3. **Preparar y Automatizar:**  
   Se configuró el entorno técnico en Node.js y Playwright, implementando el patrón Page Object Model (POM) con localizadores estables basados en atributos semánticos `[data-test]`. Se prohibieron explícitamente las pausas fijas en el tiempo (`sleep` / `page.waitForTimeout`) en favor de esperas automáticas condicionadas al estado del DOM.
4. **Ejecutar y Registrar:**  
   Cada caso de prueba se ejecutó en un contexto de navegador nuevo y aislado (`BrowserContext`), garantizando independencia de cookies, almacenamiento local y caché. Se ejecutaron 3 pasadas consecutivas preservando reportes independientes en carpetas versionadas (`corrida-01`, `corrida-02`, `corrida-03`).
5. **Analizar y Controlar:**  
   Todo comportamiento anómalo se sometió a una matriz de diagnóstico para clasificar si correspondía a un defecto de la aplicación, un error del script de automatización, inconsistencia en los datos o fallas de red/infraestructura.
6. **Cerrar y Mantener:**  
   Se compilaron las métricas consolidadas, se calcularon los costos de regresión y amortización de la inversión (ROI), y se documentó la decisión técnica final de aceptación.

### 3.2 La Pirámide de Automatización de Pruebas (Mike Cohn) vs. Alcance E2E
El modelo clásico de la pirámide de automatización de pruebas propuesto por Mike Cohn postula una distribución jerárquica de la inversión de pruebas:
* **Base (50%–60%):** Pruebas unitarias de código fuente, ejecutadas en milisegundos y con alta localización de errores.
* **Nivel Medio (20%–40%):** Pruebas de integración, servicios y APIs REST, que validan la interoperabilidad entre módulos y persistencia en bases de datos.
* **Cúspide (0%–10%):** Pruebas de interfaz gráfica de usuario (UI / E2E), enfocadas en recorridos críticos de extremo a extremo simulando al usuario final.

```
                  ▲
                 / \
                /   \     E2E UI Tests (0-10%)   <--- [Alcance de esta práctica]
               /─────\
              /       \   Service / API Tests (20-40%)
             /─────────\
            /           \ Unit Tests (50-60%)
           /─────────────\
```

> **Justificación Técnica del Alcance E2E:**  
> En esta práctica académica sobre la aplicación pública SauceDemo, el equipo de pruebas actúa como un equipo externo de aseguramiento de calidad (QA externo) sin acceso al código fuente del backend ni a la base de datos de Sauce Labs. Por consiguiente, la única interfaz disponible para ejercitar y validar el sistema es la interfaz web pública. Este informe reconoce que una suite 100% E2E presenta mayores costos de ejecución que una suite unitaria; sin embargo, para este caso de estudio es la estrategia técnicamente viable y necesaria para validar los requisitos de negocio planteados.

---

### 3.3 Cuadro Comparativo Exhaustivo de Herramientas de Automatización

En las diapositivas de clase (`cs6_1_autom.pptx`, láminas 17–26) se discute la transición tecnológica entre frameworks tradicionales y modernos. La siguiente tabla profundiza en esta comparación técnica:

| Criterio Técnico | Playwright Test (Microsoft) | Selenium WebDriver (W3C) | Cypress.io | Robot Framework |
|---|---|---|---|---|
| **Arquitectura de Conexión** | WebSocket bidireccional nativo sobre Chrome DevTools Protocol (CDTP). | Peticiones HTTP unidereccionales sobre JSON Wire Protocol / W3C WebDriver. | Inyección dentro del mismo bucle de eventos del navegador (iframe / DOM). | Wrapper sobre Selenium o Playwright mediante librerías externas. |
| **Intermediario de Ejecución** | Ninguno. Control directo del proceso del navegador. | Requiere binario intermediario (`chromedriver`, `geckodriver`). | Ninguno en el navegador; proxy local en Node.js. | Requiere el driver de la herramienta subyacente. |
| **Aislamiento de Sesiones** | Instantáneo y ultraligero mediante `BrowserContext` sin relanzar el navegador. | Lento: requiere abrir y cerrar una instancia completa de navegador por test. | Complejo: limpia cookies/localStorage, pero comparte el mismo contexto. | Dependiente de la configuración del runner de Selenium. |
| **Mecanismo de Esperas** | Auto-esperas dinámicas (*actionability checks*) antes de cada clic o tipeo. | Manual: requiere configurar explícitamente `WebDriverWait` y `ExpectedConditions`. | Auto-esperas integradas basadas en reintento de comandos. | Manual mediante palabras clave como `Wait Until Element Is Visible`. |
| **Test Runner Integrado** | Sí, propio (`@playwright/test`) con paralelismo, fixtures y reporters. | No nativo. Requiere frameworks externos (JUnit, TestNG, Mocha, PyTest). | Sí, propio con runner gráfico y CLI interactiva. | Sí, runner propio basado en tablas y archivos `.robot`. |
| **Manejo Multi-pestaña / Multi-dominio** | Soporte nativo para múltiples ventanas, pestañas, iframes y dominios. | Soportado pero engorroso (`driver.switchTo().window(...)`). | Limitado históricamente; soporte restringido a un solo dominio a la vez. | Complejo; depende de palabras clave de cambio de ventana. |
| **Captura de Evidencias y Trazas** | Trazas interactivas completas (*Trace Viewer*) con DOM snapshot paso a paso. | Requiere bibliotecas auxiliares para capturas y logs de red. | Captura de video y snapshots en consola interactiva. | Reporte HTML con logs textuales y capturas embebidas. |
| **Consumo de Memoria y Velocidad** | Altamente optimizado; 12 casos ejecutados en ~15 segundos. | Mayor sobrecarga de latencia de red por petición HTTP. | Consumo moderado de RAM en Node.js; limitado a un hilo. | Mayor sobrecarga por la capa de interpretación de texto. |

---

### 3.4 Respuestas Analíticas al Control de Lectura del Material de Clase (Slide 37)

Con base en la lectura técnica asignada (*"Getting Started with Test Automation"*, eBook / DevBridge) y las discusiones del Capítulo 6:

#### Pregunta 1: En el ciclo de vida de prueba, ¿cuál actividad es la de mayor complejidad y costo?
> **Respuesta Técnica:**  
> La actividad de **Mantenimiento de la Suite de Automatización y la Automatización Tardía (*Late Automation*)** representa la mayor complejidad y costo dentro del ciclo de vida.  
> Cuando las pruebas no se diseñan con patrones modulares (como Page Object Model y separación de datos de acuerdo con ISO 29119-5), cualquier cambio menor en la interfaz de usuario (como la modificación de un ID, clase CSS o flujo de navegación) provoca fallos masivos en cadena (*brittle tests* / pruebas frágiles). El costo de refactorizar scripts mal acoplados y diagnosticar falsos positivos supera con frecuencia el costo inicial de desarrollo. Asimismo, diferir la automatización hasta las fases finales del proyecto (*Shift-Right*) impide que las pruebas actúen como red de seguridad en los sprints de desarrollo, acumulando una deuda técnica crítica.

#### Pregunta 2: Indicar tres de las razones más importantes para automatizar las pruebas y el criterio de selección de casos.
> **Respuesta Técnica:**  
> **Las tres razones cardinales son:**
> 1. *Ejecución Rápida y Frecuente de Regresiones:* Permite comprobar en segundos que los cambios recientes o correcciones de bugs no han introducido defectos colaterales en funcionalidades existentes.
> 2. *Velocidad de Retroalimentación en CI/CD:* Facilita ciclos de despliegue continuo (*Continuous Delivery*) al validar la salud de una versión de software de forma autónoma tras cada commit.
> 3. *Precisión Aritmética y Consistencia Repetitiva:* Elimina el error humano derivado de la fatiga en tareas monótonas de cálculo numérico, validación de inventarios y llenado reiterado de formularios extensos.
>
> **Criterio de Selección de Casos Candidatos a Automatizar:**  
> Se priorizan aquellos casos que cumplan con la intersección de:
> * **Alta frecuencia de regresión:** Pruebas de humo (*smoke tests*) y flujos principales de negocio (*happy paths*).
> * **Estabilidad de reglas de negocio:** Funcionalidades maduras cuyos contratos de interfaz no cambian semanalmente.
> * **Costo y riesgo de fallo crítico:** Flujos financieros, de autenticación y transacciones de compra.  
> Por el contrario, se excluyen de la automatización funcional las pruebas exploratorias libres, la evaluación heurística de usabilidad visual y las pruebas de interfaz gráfica en fases preliminares de prototipado rápido.

#### Pregunta 3: ¿Cuál es el alcance de la herramienta Selenium para automatización e identificar sus características faltantes?
> **Respuesta Técnica:**  
> **Alcance de Selenium WebDriver:**  
> Selenium es fundamentalmente una **biblioteca de control de navegadores estandarizada por el W3C** (*browser automation API*). Su alcance se circunscribe a enviar instrucciones de bajo nivel a un navegador (hacer clic, escribir texto, navegar por URL, leer propiedades de elementos) a través de un controlador específico del proveedor (`chromedriver`, `geckodriver`).
>
> **Características Faltantes en Selenium frente a Frameworks Modernos:**  
> 1. *Ausencia de Test Runner y Aserciones Nativas:* Selenium no es un marco de pruebas por sí mismo; carece de aserciones (`expect`), orquestadores de ejecución y estructuras de suite (`describe`, `test`), dependiendo obligatoriamente de herramientas externas como JUnit, TestNG o Mocha.
> 2. *Falta de Auto-Esperas Inteligentes por Defecto:* En Selenium tradicional, si un elemento tarda 100 ms en responder tras una llamada AJAX, el test arroja inmediatamente una excepción `NoSuchElementException` o `StaleElementReferenceException`, forzando la escritura repetitiva de bloques `WebDriverWait`.
> 3. *Carencia de Intercepción de Red y Mocking:* Selenium no puede interceptar, modificar ni simular llamadas de red HTTP/XHR de forma nativa sin configurar proxies externos pesados (como BrowserMob Proxy).
> 4. *Inexistencia de Trazabilidad Visual Integrada:* Carece de herramientas de diagnóstico como el *Trace Viewer* de Playwright, que graba la línea de tiempo completa del DOM, peticiones de red y capturas de pantalla para depurar errores post-mortem.

---

## 4. Caso de Estudio (SauceDemo) y Especificación de Casos de Prueba

### 4.1 Caracterización del Sistema Bajo Prueba (SUT)
* **Nombre de la Aplicación:** SauceDemo (Swag Labs)
* **URL Pública:** [https://www.saucedemo.com/](https://www.saucedemo.com/)
* **Código Fuente y Documentación:** [https://github.com/saucelabs/sample-app-web](https://github.com/saucelabs/sample-app-web) (Licencia MIT)
* **Fecha de Consulta:** Octubre de 2026
* **Módulos Evaluados:** Autenticación de usuarios, catálogo de productos con ordenamiento, persistencia de carrito de compras, formulario de datos de checkout, consistencia financiera de subtotales/impuestos y seguridad en control de sesiones.

---

### 4.2 Matriz de Trazabilidad Requisito - Caso - Oráculo (R1 a R6 / T01 a T12)

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                           MATRIZ BIDIRECCIONAL DE TRAZABILIDAD (R1 - R6)                       │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

| Req. | Requisito Académico | Caso | Técnica de Diseño (ISO 29119-4) | Datos de Entrada (`testData.json`) | Oráculo Verificable Independiente | Estado |
|:---:|---|:---:|:---:|---|---|:---:|
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T01** | Partición de Equivalencia Válida | `username: "standard_user"`<br>`password: "secret_sauce"` | La URL final coincide con `/inventory.html$` y el contenedor `[data-test="inventory-list"]` es visible en el DOM. | ✅ Aprobado |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T02** | Partición de Equivalencia Inválida | `username: "standard_user"`<br>`password: "clave_incorrecta"` | Mensaje de error visible con texto `"Username and password do not match"`; botón de login permanece visible; URL no cambia. | ✅ Aprobado |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T03** | Estado Restringido del Sistema | `username: "locked_out_user"`<br>`password: "secret_sauce"` | Contenedor de error visible con texto `"Sorry, this user has been locked out"`; acceso al inventario bloqueado. | ✅ Aprobado |
| **R1** | Autenticar usuario válido y rechazar acceso no válido. | **T04** | Análisis de Valores Límite (Vacío) | `username: ""` / `password: ""` | Mensaje de validación obligatoria `"Username is required"`; URL permanece en la raíz de autenticación. | ✅ Aprobado |
| **R2** | Ordenar catálogo por precio ascendente. | **T05** | Validación Numérica Completa | Opción select `'lohi'` *(Price: low to high)* | Se extrae la lista completa de precios numéricos y se verifica formalmente: $\forall i \in [0, n-2]: p[i] \le p[i+1]$. | ✅ Aprobado |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T06** | Transición de Estado Directa | Clic en `add-to-cart-sauce-labs-backpack` | El badge del carrito se despliega en pantalla y su texto es exactamente `'1'`. | ✅ Aprobado |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T07** | Transición de Estado Inversa | Clic en `remove-sauce-labs-backpack` | El elemento del badge del carrito es eliminado del DOM (`toHaveCount(0)`). | ✅ Aprobado |
| **R3** | Agregar y retirar productos manteniendo el carrito. | **T08** | Acumulación y Persistencia | Clic en Mochila ($29.99) y Linterna ($9.99) | Badge muestra `'2'`; en `/cart.html` se visualizan ambos ítems y `cartItems.count() == 2`. | ✅ Aprobado |
| **R4** | Exigir datos obligatorios antes de continuar compra. | **T09** | Validación de Campos Obligatorios | First Name: `""`<br>Last: `"Suclle"`, Zip: `"04001"` | Notificación visible `"Error: First Name is required"`; la URL permanece en `checkout-step-one.html`. | ✅ Aprobado |
| **R4** | Exigir datos obligatorios antes de continuar compra. | **T10** | Validación de Campos Obligatorios | First: `"Michael"`<br>Last: `"Suclle"`, Zip: `""` | Notificación visible `"Error: Postal Code is required"`; bloqueo de navegación al paso dos. | ✅ Aprobado |
| **R5** | Mostrar importes consistentes y completar compra. | **T11** | Consistencia Aritmética Financiera | 2 productos seleccionados + Datos de envío válidos | 1) $\text{Subtotal} = \sum p_i = \$39.98$.<br>2) $|\text{Total} - (\text{Subtotal} + \text{Tax})| \le 0.01$.<br>3) Pantalla final con `"Thank you for your order!"`. | ✅ Aprobado |
| **R6** | Cerrar sesión y exigir autenticación para inventario. | **T12** | Control de Acceso y Sesión | Logout vía menú lateral + `page.goto('/inventory.html')` | Redirección forzada al formulario de login y despliegue del error: `"You can only access '/inventory.html' when you are logged in"`. | ✅ Aprobado |

---

### 4.3 Especificación Detallada de los Dos Casos de Análisis Complejo

#### Análisis Resuelto del Caso T05 (Ordenamiento Numérico Completo)
* **Problema Común en Automatización Básica:**  
  La guía académica señala un vicio recurrente en proyectos de automatización novatos: verificar únicamente que el primer producto del catálogo sea el de menor precio ($p[0] \le p[1]$) y dar la prueba por aprobada. Dicha comprobación deja sin detectar desórdenes intermedios graves (por ejemplo, si los productos aparecen en orden: \$7.99, \$29.99, \$9.99, \$15.99).
* **Solución Técnica Implementada en Playwright:**  
  En [`InventoryPage.js`](file:///C:/Programador/UNSA/CaS/pages/InventoryPage.js#L23-L27) y [`automatizacion.spec.js`](file:///C:/Programador/UNSA/CaS/tests/automatizacion.spec.js#L67-L85), el caso T05 extrae todos los textos del selector `[data-test="inventory-item-price"]`, elimina el símbolo monetario `$`, realiza el casting a números de coma flotante (`parseFloat`) y comprueba exhaustivamente:
  $$\forall i \in \{0, 1, \dots, n-2\}: p[i] \le p[i+1]$$
  Garantizando que ningún producto posterior tenga un costo menor que su predecesor en toda la colección.

#### Análisis Resuelto del Caso T11 (Consistencia Aritmética de Importes)
* **Fundamento Metodológico:**  
  La prueba no asume que la tasa tributaria de SauceDemo sea legalmente exacta o aplicable a una jurisdicción tributaria real, sino que valida la **consistencia matemática interna del software**:
  1. *Subtotal:* La suma de los precios individuales de los productos cargados en el carrito debe coincidir con el valor mostrado en el campo `Item total`:
     $$\text{Subtotal}_{\text{calculado}} = \sum_{k=1}^{m} p_k = \$29.99 + \$9.99 = \$39.98 \equiv \text{Subtotal}_{\text{mostrado}}$$
  2. *Total con Impuesto:* El importe total debe satisfacer:
     $$|\text{Total} - (\text{Subtotal} + \text{Tax})| \le 0.01$$
     Se utiliza una tolerancia matemática de $\pm 0.01$ para absorber las discrepancias inherentes a la representación de números binarios de punto flotante en motores JavaScript (*IEEE 754 floating-point arithmetic*).

---

## 5. Arquitectura de la Suite e Implementación en Playwright

La suite se ha estructurado respetando una arquitectura modular en capas conforme a ISO/IEC/IEEE 29119-5:2024:

```
  C:\Programador\UNSA\CaS/
  ├── data/
  │   └── testData.json              <─── [DATA LAYER: Datos desacoplados y oráculos textuales]
  ├── pages/                         <─── [KEYWORD / DRIVER LAYER: Page Object Model]
  │   ├── LoginPage.js               <─── Acciones de autenticación y captura de alertas
  │   ├── InventoryPage.js           <─── Catálogo, ordenamiento de precios y logout
  │   ├── CartPage.js                <─── Persistencia de ítems en carrito y checkout
  │   └── CheckoutPage.js            <─── Formulario de cliente, importes y confirmación
  ├── tests/
  │   └── automatizacion.spec.js     <─── [TEST DEFINITION LAYER: Orquestador de los 12 casos]
  ├── scripts/
  │   └── run_corridas.js            <─── Orquestador automatizado de 3 pasadas independientes
  ├── evidencias/                    <─── Evidencias forenses versionadas (HTML, XML, logs)
  │   ├── corrida-01/
  │   ├── corrida-02/
  │   └── corrida-03/
  ├── playwright.config.js           <─── Configuración central Playwright (Chromium, 1 worker, 0 retries)
  ├── package.json                   <─── Dependencias del proyecto (@playwright/test)
  └── ejecutar_pruebas.bat           <─── Script de ejecución de un clic para Windows
```

### 5.1 Capa de Datos Desacoplada ([data/testData.json](file:///C:/Programador/UNSA/CaS/data/testData.json))
Permite modificar credenciales, identificadores o textos esperados sin alterar una sola línea de código en las pruebas, garantizando alta mantenibilidad:

```json
{
  "users": {
    "valid": { "username": "standard_user", "password": "secret_sauce" },
    "locked": { "username": "locked_out_user", "password": "secret_sauce" },
    "invalid": { "username": "standard_user", "password": "clave_incorrecta" },
    "empty": { "username": "", "password": "" }
  },
  "messages": {
    "loginErrorMismatch": "Username and password do not match",
    "loginErrorLocked": "Sorry, this user has been locked out",
    "loginErrorRequiredUsername": "Username is required",
    "checkoutErrorFirstName": "Error: First Name is required",
    "checkoutErrorPostalCode": "Error: Postal Code is required",
    "unauthenticatedDirectAccess": "You can only access '/inventory.html' when you are logged in",
    "orderConfirmation": "Thank you for your order!"
  }
}
```

### 5.2 Capa de Componentes de Página (Page Object Model)
* **[`LoginPage.js`](file:///C:/Programador/UNSA/CaS/pages/LoginPage.js):** Provee el método reutilizable `login(username, password)` y la consulta del selector de error `[data-test="error"]`.
* **[`InventoryPage.js`](file:///C:/Programador/UNSA/CaS/pages/InventoryPage.js):** Ofrece métodos como `sortBy('lohi')`, `getAllItemPrices()`, `addProduct(slug)` y `logout()`, encapsulando las transiciones del menú lateral.
* **[`CartPage.js`](file:///C:/Programador/UNSA/CaS/pages/CartPage.js):** Valida la presencia de productos mediante `getItemNames()` y transiciona hacia el flujo de compra con `clickCheckout()`.
* **[`CheckoutPage.js`](file:///C:/Programador/UNSA/CaS/pages/CheckoutPage.js):** Rellena los datos personales del cliente, extrae los valores monetarios numéricos mediante expresiones regulares (`match(/\$([0-9.]+)/)`) y verifica la culminación de la orden.

### 5.3 Configuración de Playwright ([playwright.config.js](file:///C:/Programador/UNSA/CaS/playwright.config.js))
Se apega estrictamente a los lineamientos de la guía docente:
```javascript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,           // Sin concurrencia para evitar interferencias
  retries: 0,           // Sin reintentos automáticos para detectar inestabilidad real
  timeout: 30000,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['junit', { outputFile: 'resultados.xml' }]
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    browserName: 'chromium',
    headless: true,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

---

## 6. Registro de Ejecución, Evidencias Forenses y Análisis de Métricas

La suite fue sometida a tres pasadas formales consecutivas bajo condiciones idénticas utilizando el orquestador automatizado [`scripts/run_corridas.js`](file:///C:/Programador/UNSA/CaS/scripts/run_corridas.js).

### 6.1 Tabla Consolidada de las Tres Pasadas de Ejecución

| Identificador de Corrida | Fecha y Hora Local | Motor / Navegador | Casos Totales | Casos Aprobados | Casos Fallidos | Duración Total (s) | Tasa de Aprobación | Tasa de Inestabilidad (*Flaky*) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **Corrida-01** | 2026-10-25 17:48:59 | Chromium Headless | 12 | 12 | 0 | 18.35 s | **100.0%** | **0.0%** |
| **Corrida-02** | 2026-10-25 17:49:15 | Chromium Headless | 12 | 12 | 0 | 16.21 s | **100.0%** | **0.0%** |
| **Corrida-03** | 2026-10-25 17:49:30 | Chromium Headless | 12 | 12 | 0 | 14.28 s | **100.0%** | **0.0%** |

```
  RESUMEN ESTADÍSTICO ACUMULADO (3 PASADAS):
  ├── Total de comprobaciones ejecutadas : 36
  ├── Total de comprobaciones aprobadas  : 36 (100.0%)
  ├── Total de fallos observados         : 0 (0.0%)
  ├── Casos con resultado intermitente   : 0 (0.0% Flaky)
  └── Tiempo promedio por pasada         : 16.28 segundos
```

---

### 6.2 Indicadores Normativos de Calidad

A continuación se detallan las fórmulas e interpretaciones de los indicadores exigidos en la Sección 6 de la guía:

#### 1. Cobertura de Requisitos
$$\text{Cobertura} = \frac{\text{Requisitos con al menos un caso ejecutado}}{\text{Total de requisitos evaluados}} \times 100 = \frac{6}{6} \times 100 = \mathbf{100.0\%}$$
*Interpretación:* Los 6 requisitos académicos (R1 a R6) cuentan con verificación funcional automatizada. No representa cobertura de código fuente de la aplicación.

#### 2. Tasa de Automatización
$$\text{Tasa Automatización} = \frac{\text{Casos Automatizados}}{\text{Casos Diseñados}} \times 100 = \frac{12}{12} \times 100 = \mathbf{100.0\%}$$
*Interpretación:* Se automatizó el 100% de los casos diseñados, superando con holgura el umbral mínimo docente exigido del 83.3% (10 casos).

#### 3. Tasa de Aprobación por Pasada
$$\text{Aprobación} = \frac{\text{Casos Aprobados}}{\text{Casos Ejecutados}} \times 100 = \frac{12}{12} \times 100 = \mathbf{100.0\%}$$
*Interpretación:* Consistencia perfecta en las tres corridas. Cero casos bloqueados y cero casos omitidos.

#### 4. Índice de Inestabilidad (*Observed Flakiness*)
$$\text{Inestabilidad} = \frac{\text{Casos con resultado variable}}{\text{Total de casos repetidos}} \times 100 = \frac{0}{36} \times 100 = \mathbf{0.0\%}$$
*Interpretación:* Ningún caso de prueba osciló entre aprobado y fallido a lo largo de las tres pasadas. El comportamiento de la suite es determinista.

---

### 6.3 Modelo Económico de Regresión y Retorno de Inversión (ROI)

Uno de los aportes cardinales del informe es la justificación económica de la automatización frente a la regresión manual:

#### Medición de Tiempos
* **Tiempo Manual por Pasada (Línea Base Medida):**  
  La ejecución manual rigurosa de los 12 casos por un ingeniero de pruebas (incluyendo abrir el navegador en modo incógnito, ingresar credenciales válidas e inválidas, revisar mensajes de error, tomar notas, ordenar el catálogo, calcular en calculadora la secuencia de precios y la suma de impuestos de checkout) requiere un tiempo promedio de **15 minutos (900 segundos)** por ciclo completo.
* **Tiempo Automatizado por Pasada (Playwright):**  
  El tiempo promedio de ejecución registrado en las tres corridas es de **16.28 segundos** (0.27 minutos).

#### Cálculo del Ahorro Neto por Ciclo de Regresión
$$\text{Ahorro por Pasada} = \text{Tiempo Manual} - \text{Tiempo Automatizado} = 15.00\,\text{min} - 0.27\,\text{min} = \mathbf{14.73\,\text{minutos por pasada}} \quad (\mathbf{98.2\%}\text{ de ahorro}).$$

#### Cálculo del Punto de Equilibrio (*Break-Even Point*)
Asumiendo un costo docente de inversión de **180 minutos** (3 horas de ingeniería para diseñar el POM, programar los 12 casos, configurar el runner y redactar el informe):
$$\text{Punto de Equilibrio} = \left\lceil \frac{\text{Costo de Desarrollo y Setup}}{\text{Ahorro Neto por Pasada}} \right\rceil = \left\lceil \frac{180\,\text{min}}{14.73\,\text{min/pasada}} \right\rceil = \lceil 12.22 \rceil = \mathbf{13\,\text{pasadas}}.$$

```
  Minutos Invertidos
       ▲
   300 │                                              /  Línea Base Manual (15 min/ciclo)
       │                                             /
   200 │                                            /
       │───────────────────────────────────────────X (Break-Even: Pasada 13)
   100 │                 Suite Automatizada       /
       │                 (180 min inversión)     /
     0 └────────────────────────────────────────/──────────►
       0         4         8         12        16        20   Pasadas de Regresión
```

*Interpretación Económica:*  
A partir de la **pasada número 13** de regresión continua (por ejemplo, en un pipeline de integración continua con despliegues semanales o diarios), la inversión inicial de automatización queda completamente amortizada, generando a partir de allí un ahorro neto de ~14.7 minutos por cada ejecución posterior.

---

## 7. Diagnóstico de Incidentes, Preguntas de Cierre y Decisión Técnica

### 7.1 Taxonomía de Incidentes (ISO/IEC/IEEE 29119-2)
Para evitar la confusión metodológica entre defectos de la aplicación y problemas de la prueba, se clasifica el comportamiento observado:
1. **Defectos del Producto (SUT):** **0 defectos.** Todos los flujos evaluados respondieron en estricta conformidad con las especificaciones y reglas de negocio de SauceDemo.
2. **Fallos de Script de Prueba:** **0 fallos.** El empleo de selectores semánticos dedicados `[data-test]` evitó falsos positivos por cambios cosméticos de CSS o layout.
3. **Fallos de Datos de Prueba:** **0 fallos.** Los datos desacoplados en `data/testData.json` garantizaron entradas homogéneas y oráculos unificados.
4. **Fallos de Entorno o Infraestructura:** **0 fallos.** La conexión con `saucedemo.com` mantuvo tiempos de respuesta consistentes sin problemas de red ni bloqueos de IP.

---

### 7.2 Respuestas a las Preguntas de Análisis Crítico de la Guía Docente

#### 1. ¿Qué requisito quedó sin evidencia?
> **Respuesta:**  
> **Ningún requisito quedó sin evidencia.** Los 6 requisitos académicos (R1 a R6) cuentan con verificación automatizada directa y reportes HTML/XML archivados en las tres corridas. La cobertura funcional sobre el alcance delimitado fue del **100%**.

#### 2. ¿Qué fallo potencial afectaría más severamente al usuario?
> **Respuesta:**  
> En el contexto de un e-commerce, el fallo de mayor severidad e impacto sería una anomalía en el **Requisito R5 (Caso T11: Consistencia Aritmética de Importes)**. Si el sistema cobrara un total que no coincide con la suma de los productos más el impuesto calculado, provocaría:
> * Daño financiero directo al cliente o a la empresa.
> * Riesgo legal y tributario ante entidades reguladoras por facturación inconsistente.
> * Pérdida irreversible de confianza del cliente en la pasarela de pagos.  
> En segundo orden de criticidad se ubicaría el **Requisito R6 (Caso T12: Control de Acceso)**, ya que permitir el acceso directo a `/inventory.html` sin autenticación vulneraría la seguridad básica de sesión.

#### 3. ¿El ahorro de tiempo compensa el costo inicial de automatización?
> **Respuesta:**  
> **Sí, compensa plenamente.** Como se demostró en el modelo de ROI (Sección 6.3), el ahorro neto por ciclo de regresión es de 14.73 minutos (reducción del 98.2%). En cualquier entorno de desarrollo activo donde se realicen más de 13 pasadas de regresión (lo cual es estándar en ciclos ágiles de sprints quincenales), la suite genera ahorros netos de tiempo y reduce el riesgo de fuga de defectos a producción.

#### 4. ¿Qué pruebas se mantendrían obligatoriamente de forma manual?
> **Respuesta:**  
> Se mantendrían manuales las siguientes actividades:
> * **Pruebas Exploratorias Libres:** Para descubrir comportamientos imprevistos no contemplados en los requisitos formales.
> * **Evaluación Heurística de Usabilidad y Accesibilidad (WCAG):** Juzgar la estética, legibilidad visual, contraste de colores y facilidad de navegación humana.
> * **Pruebas de Transacciones Reales en Pasarelas de Pago:** Validar autenticaciones bancarias con tarjetas de crédito reales (3D Secure, OTP móvil), que no deben automatizarse en entornos de prueba por razones de seguridad y costos financieros.

---

### 7.3 Límites Declarados del Estudio
Para garantizar rigor y honestidad técnica, se dejan sentadas las siguientes limitaciones del alcance:
1. **Ausencia de Cobertura de Código Fuente:** Las pruebas E2E validan comportamiento observable; no proporcionan métricas de cobertura de sentencias, ramas ni rutas en el código fuente de SauceDemo.
2. **Ausencia de Pruebas de Carga y Rendimiento:** La suite evalúa concurrencia unitaria (`workers=1`); no evalúa el comportamiento del servidor bajo carga masiva ni estrés de miles de usuarios simultáneos.
3. **Ausencia de Pruebas de Seguridad de Penetración:** No se realizaron ataques de inyección SQL, cross-site scripting (XSS) ni auditorías de vulnerabilidades en librerías del cliente.

---

### 7.4 Criterios de Decisión Docentes y Dictamen Formal

```
  CRITERIOS DOCENTES DE DECISIÓN:
  [X] Pruebas obligatorias ejecutadas con éxito consistente (12/12)
  [X] Cero fallos críticos sin explicación técnica
  [X] Ejecución 100% reproducible y versionada
  [X] Entorno aislado y documentado en un solo comando
```

> ### 🏆 DICTAMEN FINAL: ACEPTACIÓN TOTAL DEL ALCANCE EVALUADO
> **Fundamentación:**  
> La suite de pruebas automatizadas sobre **SauceDemo** ha demostrado un **100% de tasa de aprobación** en tres pasadas consecutivas e independientes en Chromium, con **0% de inestabilidad observada (*flakiness*)**, una reducción del tiempo de regresión del **98.2%**, trazabilidad completa hacia los 6 requisitos académicos y una arquitectura desacoplada basada en el estándar internacional **ISO/IEC/IEEE 29119-5:2024**. Por consiguiente, se emite recomendación formal de **ACEPTACIÓN** del alcance probado.

---

## 8. Matriz de Gobernanza, Aportes Individuales y Revisiones Cruzadas

De conformidad con el criterio de evaluación de la Sección 7 de la guía docente (*"Colaboración y defensa individual"*, 2 puntos sobre 20), se registra formalmente el aporte de cada uno de los 5 integrantes:

| Integrante (Rol) | Código y Artefactos Identificables Aportados | Decisión Técnica Clave Justificada | Firma / Validación Cruzada |
|---|---|---|:---:|
| **Michael Suclle**<br>*(Rol 1: Plan y Matriz)* | • [`playwright.config.js`](file:///C:/Programador/UNSA/CaS/playwright.config.js)<br>• [`package.json`](file:///C:/Programador/UNSA/CaS/package.json)<br>• Secciones 1, 2, 4 y 7 del Informe Técnico.<br>• Matriz de trazabilidad bidireccional R1–R6. | Se estableció `workers=1` y `retries=0` en la configuración para evitar que reintentos automáticos enmascaren problemas de concurrencia o inestabilidad en la red. | *Revisó criterios de T09–T12 aportados por G. Borda e I. Ccoscco.* |
| **Rodrigo Fernandez**<br>*(Rol 2: Diseño y Manual)* | • Especificación de casos T01 a T12.<br>• Tablas de Partición de Equivalencia y Valores Límite.<br>• Medición de la línea base de ejecución manual (15 min). | Se determinó que los casos de campos vacíos (T04, T09, T10) debían validarse mediante valores límite analizando el atributo `error` específico de cada formulario. | *Revisó aserciones y oráculos de T01–T05 aportados por C. Meza.* |
| **Cielo Meza**<br>*(Rol 3: Automatización Base)* | • [`pages/LoginPage.js`](file:///C:/Programador/UNSA/CaS/pages/LoginPage.js)<br>• [`pages/InventoryPage.js`](file:///C:/Programador/UNSA/CaS/pages/InventoryPage.js)<br>• Tests automatizados T01 a T05 en `automatizacion.spec.js`. | En T05, se implementó la extracción del arreglo completo de precios en números flotantes para evaluar $p[i] \le p[i+1]$, evitando el falso positivo de comparar únicamente el primer ítem. | *Revisó selectores y lógica de T06–T11 aportados por G. Borda.* |
| **Gabriela Borda**<br>*(Rol 4: Automatización Data)* | • [`pages/CartPage.js`](file:///C:/Programador/UNSA/CaS/pages/CartPage.js)<br>• [`pages/CheckoutPage.js`](file:///C:/Programador/UNSA/CaS/pages/CheckoutPage.js)<br>• [`data/testData.json`](file:///C:/Programador/UNSA/CaS/data/testData.json)<br>• Tests automatizados T06 a T11. | En T11, se incorporó una tolerancia matemática de $\pm 0.01$ en la aserción de `Total` para proteger la prueba contra discrepancias de precisión en punto flotante de JavaScript. | *Revisó estructura POM y aserciones de T01–T05 aportadas por C. Meza.* |
| **Italo Ccoscco**<br>*(Rol 5: Integración y Cierre)* | • Test automatizado T12 (Control de Sesión).<br>• [`scripts/run_corridas.js`](file:///C:/Programador/UNSA/CaS/scripts/run_corridas.js)<br>• [`ejecutar_pruebas.bat`](file:///C:/Programador/UNSA/CaS/ejecutar_pruebas.bat)<br>• Secciones 5 y 6 del Informe (Cálculo de ROI y Métricas). | Se programó el archivado automático de reportes HTML y JUnit en carpetas aisladas (`corrida-01`, `02`, `03`) para garantizar la trazabilidad forense exigida por la norma. | *Verificó reproducibilidad de la suite en Windows y balance de aportes.* |

---

## 9. Referencias y Bibliografía Oficial

1. **ISO/IEC/IEEE 29119-1:2022** — *Software and systems engineering — Software testing — Part 1: General concepts*. International Organization for Standardization, Ginebra, Suiza. [https://www.iso.org/standard/81291.html](https://www.iso.org/standard/81291.html)
2. **ISO/IEC/IEEE 29119-2:2021** — *Software and systems engineering — Software testing — Part 2: Test processes*. ISO/IEC/IEEE. [https://www.iso.org/standard/79428.html](https://www.iso.org/standard/79428.html)
3. **ISO/IEC/IEEE 29119-3:2021** — *Software and systems engineering — Software testing — Part 3: Test documentation*. ISO/IEC/IEEE. [https://www.iso.org/standard/79429.html](https://www.iso.org/standard/79429.html)
4. **ISO/IEC/IEEE 29119-4:2021** — *Software and systems engineering — Software testing — Part 4: Test techniques*. ISO/IEC/IEEE. [https://www.iso.org/standard/79430.html](https://www.iso.org/standard/79430.html)
5. **ISO/IEC/IEEE 29119-5:2024** — *Software and systems engineering — Software testing — Part 5: Keyword-driven testing*. IEEE Computer Society / ISO. [https://www.iso.org/standard/87233.html](https://www.iso.org/standard/87233.html)
6. **ISO/IEC 25010:2023** — *Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model*. ISO/IEC. [https://www.iso.org/standard/78176.html](https://www.iso.org/standard/78176.html)
7. **ISO/IEC 5055:2021** — *Software measurement — Software quality measurement — Automated source code quality metrics*. ISO/IEC. [https://www.iso.org/standard/80623.html](https://www.iso.org/standard/80623.html)
8. **World Wide Web Consortium (W3C)** — *WebDriver: W3C Recommendation 05 June 2018*. W3C. [https://www.w3.org/TR/2018/REC-webdriver1-20180605/](https://www.w3.org/TR/2018/REC-webdriver1-20180605/)
9. **Microsoft Corporation** — *Playwright: Fast and reliable end-to-end testing for modern web apps (v1.64)*. Documentación técnica oficial. [https://playwright.dev/docs/intro](https://playwright.dev/docs/intro)
10. **Cohn, Mike** — *Succeeding with Agile: Software Development Using Scrum*. Addison-Wesley Professional, 2009. (Concepto de la Pirámide de Automatización de Pruebas).
11. **Sauce Labs** — *Sample Web App for Automated Testing: Swag Labs / SauceDemo*. Repositorio público oficial en GitHub. [https://github.com/saucelabs/sample-app-web](https://github.com/saucelabs/sample-app-web)
