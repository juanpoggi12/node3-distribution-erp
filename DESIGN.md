---
name: El Bayo Distribuciones
description: Mesa de trabajo operativa para pedidos, preparación y stock mayorista.
colors:
  deep-warehouse: "#102d25"
  warehouse-green: "#173d32"
  action-green: "#205443"
  operational-green: "#276a54"
  green-wash: "#edf6f2"
  canvas: "#f2f4f1"
  surface: "#ffffff"
  ink: "#17231e"
  ink-soft: "#405149"
  muted: "#68766f"
  line: "#d9e0dc"
  line-strong: "#bcc8c2"
  warehouse-amber: "#b87b31"
  amber-wash: "#f7ead8"
  warning: "#8a5a12"
  warning-wash: "#fff3d9"
  danger: "#a63d35"
  danger-wash: "#f9e7e5"
typography:
  display:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "clamp(31px, 4vw, 52px)"
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "22px"
    fontWeight: 750
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 750
    lineHeight: 1.3
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Manrope, Segoe UI, sans-serif"
    fontSize: "12px"
    fontWeight: 750
    lineHeight: 1
rounded:
  sm: "8px"
  md: "11px"
  lg: "15px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "18px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.action-green}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "9px"
    padding: "9px 14px"
    height: "40px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "9px"
    padding: "9px 14px"
    height: "40px"
  field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "9px"
    padding: "9px 11px"
    height: "42px"
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "20px 21px"
---

# Design System: El Bayo Distribuciones

## Overview

**Creative North Star: "La Mesa del Depósito"**

El sistema se siente como una mesa de trabajo ordenada: sobria, resistente y preparada para decidir con rapidez. El verde profundo concentra la navegación y las acciones operativas; el blanco y el gris verdoso sostienen tablas y formularios legibles; el ámbar aparece con moderación para señalar el siguiente paso.

El documento físico es parte de la identidad, no un apéndice. Las superficies de papel, la numeración tabular y la composición A4 conectan la pantalla con la tarea concreta de armar, controlar e imprimir pedidos. La interfaz privilegia el reconocimiento inmediato sobre la ornamentación.

**Key Characteristics:**

- Verde de depósito y papel cálido como pareja dominante.
- Jerarquía fuerte, lenguaje directo y densidad operativa controlada.
- Bordes finos, esquinas suaves y elevación reservada para elementos que flotan.
- Cantidades, códigos y totales siempre visibles y fáciles de comparar.

## Colors

La paleta combina verdes forestales de baja saturación con neutros fríos; el ámbar aporta una señal cálida y escasa.

### Primary

- **Verde Depósito Profundo:** estructura la barra lateral, la navegación móvil y los mensajes de confirmación.
- **Verde de Acción:** identifica botones primarios y decisiones de avance.
- **Verde Operativo:** comunica enlaces, focos, códigos y progreso sin competir con la acción principal.

### Secondary

- **Ámbar de Bulto:** marca la acción recomendada y el monograma. Su calidez conecta con cajas, papel y trabajo físico.
- **Lavado Ámbar:** crea una superficie destacada sin convertir todo el panel en una alerta.

### Neutral

- **Lienzo de Depósito:** fondo general ligeramente verdoso que separa naturalmente las superficies blancas.
- **Papel Limpio:** superficie principal de paneles, formularios y documentos.
- **Tinta de Inventario:** texto principal de alto contraste.
- **Tinta Suave y Texto Secundario:** niveles de apoyo para descripciones y metadatos.
- **Línea de Estantería:** bordes y divisores discretos; la variante fuerte delimita controles interactivos.

### Named Rules

**The Amber Means Next Rule.** El ámbar se reserva para la acción recomendada, el monograma o una advertencia; nunca compite con varias llamadas simultáneas.

**The Operational Contrast Rule.** Códigos, nombres, cantidades y estados usan tinta o verde con contraste alto; ningún dato central depende del gris tenue.

## Typography

**Display Font:** Manrope (con Segoe UI y sans-serif como respaldo)  
**Body Font:** Manrope (con Segoe UI y sans-serif como respaldo)

**Character:** Una sola familia sans serif mantiene el producto práctico y contemporáneo. El carácter surge de una escala compacta, pesos firmes y cifras tabulares, no de mezclar tipografías decorativas.

### Hierarchy

- **Display** (800, escala fluida, 1.04): estado operativo dominante y mensajes de primer viewport; máximo aproximado de 16 caracteres por línea.
- **Headline** (750, 22px, 1.2): títulos de pantalla y secciones principales.
- **Title** (750, 16px, 1.3): encabezados de panel y agrupaciones de trabajo.
- **Body** (400, 14px, 1.45): instrucciones y contenido corriente; el texto explicativo se limita a unas 60 columnas.
- **Label** (750, 12px, 1): botones, datos breves y controles. Los encabezados tabulares pueden usar mayúsculas y espaciado leve.

### Named Rules

**The Numbers Are Tools Rule.** Números de pedido, códigos, stock, cantidades y dinero usan cifras tabulares para que la comparación vertical sea inmediata.

## Layout

En escritorio, la aplicación usa una barra lateral fija de 252px y un área de trabajo flexible. El contenido se limita a 1680px y respira con márgenes fluidos; la unidad repetida de separación es 18px, con 12px para agrupaciones internas y 24px para zonas de mayor jerarquía.

Los paneles organizan información densa con grillas, tablas y filas; la composición evita mosaicos decorativos. A 1320px los constructores complejos pasan a una sola columna. A 1024px la barra lateral se convierte en navegación inferior de cuatro destinos. A 760px los bloques se apilan, las acciones ocupan el ancho disponible y el resumen pasa a dos columnas.

En despacho, la lectura sigue una jerarquía estable de zona → camión o recorrido → pedido. El inicio resume cada zona en una fila navegable con pedidos y bultos pendientes; la vista de preparación expande esa zona en una cabecera tonal, indicadores de camión y filas de pedidos. Bajo 760px, la fila de pedido se reorganiza en bloques apilados con el destino, estado y acciones visibles, sin perder esos niveles de contexto.

El documento conserva 210 × 297mm al imprimir. En pantalla se escala dentro de un marco responsive para mostrar la hoja completa sin desborde; el tamaño físico nunca se modifica en `print`.

## Elevation & Depth

El sistema es plano por defecto y usa bordes tonales para separar contenido. La elevación aparece solo cuando una pieza debe sentirse físicamente por encima del flujo: vista previa de papel, modal imprimible o notificación.

### Shadow Vocabulary

- **Elevación baja** (`0 3px 12px rgba(20, 44, 35, 0.07)`): editores y paneles que necesitan separarse apenas del lienzo.
- **Elevación modal** (`0 22px 60px rgba(11, 31, 24, 0.22)`): documentos y capas temporales.
- **Papel apoyado** (`0 16px 38px rgba(0, 0, 0, 0.23)`): la hoja inclinada que representa la salida física.

### Named Rules

**The Paper Earns the Shadow Rule.** Las sombras intensas pertenecen a objetos que flotan o representan papel; un panel de datos en reposo se define con borde, no con profundidad artificial.

## Shapes

Las superficies funcionales usan esquinas suaves de 8, 11 y 15px. Los botones y campos permanecen compactos alrededor de 9px; los paneles amplios usan 15px. La hoja A4 conserva esquinas casi rectas y la referencia de papel usa 5px para diferenciarse claramente de una tarjeta de interfaz. Los bordes son finos y continuos; las píldoras se reservan para estados breves y contadores.

## Components

### Buttons

- **Shape:** compacto y firme, con radio de 9px y altura base de 40px.
- **Primary:** verde de acción, texto blanco y peso 750; al pasar el cursor profundiza al verde de depósito.
- **Secondary:** papel blanco, tinta oscura y borde fuerte; su hover modifica borde y fondo, no agrega sombra.
- **Hover / Focus:** desplazamiento vertical de 1px en hover y anillo ámbar de 3px en foco visible.

### Chips

- **Style:** píldoras pequeñas con fondo tonal y texto semántico. Azul verdoso para confirmado, ámbar para preparación y verde para preparado.
- **State:** cada estado combina palabra y color; el color nunca es el único indicador.

### Cards / Containers

- **Corner Style:** paneles principales con radio de 15px; acciones y resúmenes con 11–13px.
- **Background:** papel blanco sobre el lienzo verdoso.
- **Shadow Strategy:** borde fino en reposo; elevación solo en editores o capas temporales.
- **Internal Padding:** 18–24px en paneles; 12–15px en filas densas.

### Dispatch Group

Cada zona pendiente forma un único contenedor de borde fino y esquina de panel. La cabecera verde pálida muestra el nombre de la zona y los totales de pedidos y bultos; debajo, etiquetas compactas distinguen camiones o recorridos asignados del estado «Sin camión» mediante texto y tono de advertencia. Las filas blancas conservan número de pedido, cliente, destino editable, estado y acciones junto al pedido. No convertir cada nivel de la jerarquía en una tarjeta elevada independiente.

### Inputs / Fields

- **Style:** fondo blanco, borde fuerte, radio de 9px y altura mínima de 42px.
- **Focus:** borde verde operativo más halo translúcido de 3px.
- **Error / Disabled:** peligro usa rojo apagado sobre lavado rojo; disabled conserva estructura con opacidad reducida.

### Navigation

La navegación de escritorio es una columna verde profunda con iconos lineales y rótulos de 13px. El estado activo invierte a una superficie clara con texto verde; el hover solo aclara el fondo. Bajo 1024px, los mismos cuatro destinos forman una barra inferior fija, con rótulo corto y área táctil mínima de 54px.

### Operational Hero

El bloque de estado combina un mensaje grande, dos acciones y una representación de la próxima orden. El titular explica qué requiere atención; la hoja comunica que el resultado será imprimible. En móvil la composición se apila, pero ninguno de los dos elementos desaparece.

### Printable Order

La nota y la orden de preparación comparten una hoja A4 vertical, cabecera de empresa, cliente, tabla de líneas y cierre operativo. Entre cliente y líneas, dos campos contiguos de verde pálido hacen explícitos la zona de envío y el camión o recorrido; si falta asignación, el dato se declara pendiente en texto. La nota incluye precios y totales; preparación los reemplaza por casillas y firmas. La pantalla puede escalar la hoja, pero la impresión siempre restituye 210 × 297mm, fondo blanco y ausencia de chrome.

## Do's and Don'ts

### Do:

- **Do** mostrar la próxima acción con un verbo claro y un único énfasis primario.
- **Do** mantener códigos, cantidades, stock y totales a 11–12px como mínimo en interfaz operativa.
- **Do** usar iconos lineales junto con texto cuando la acción no sea universal.
- **Do** conservar el documento físico como referencia visual en flujos de pedido y preparación.
- **Do** adaptar la densidad por reflujo y apilado, no eliminando información crítica.

### Don't:

- **Don't** usar ámbar en varias acciones competidoras dentro del mismo contexto.
- **Don't** colocar datos centrales con colores tenues o tipografía menor que el piso operativo.
- **Don't** convertir cada panel en una tarjeta elevada; borde y ritmo son la separación predeterminada.
- **Don't** sustituir los cuatro destinos operativos por módulos futuros o secundarios.
- **Don't** escalar o recortar la salida física durante la impresión.
