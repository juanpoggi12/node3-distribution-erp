# El Bayo Distribuciones — verdad de producto

## Producto

Prototipo web operativo para registrar pedidos de una distribuidora, preparar la mercadería y emitir documentación interna en hoja A4. La primera entrega debe permitir conversar con el dueño sobre un flujo concreto y creíble, no simular un ERP completo.

## Usuarios y escena de uso

- Dueño o administrativo: carga pedidos, controla stock y genera documentos.
- Personal de depósito: recibe una orden de preparación clara, sin información comercial innecesaria.
- Uso principal en computadora de escritorio o notebook, durante una jornada de trabajo con interrupciones y necesidad de lectura rápida.

## Trabajo principal

1. Registrar un pedido con cliente, productos, bultos, cantidades y observaciones.
2. Confirmarlo con numeración automática.
3. Descontar stock al confirmar, como comportamiento provisorio a validar.
4. Imprimir o guardar como PDF una nota de pedido y una orden de preparación A4 vertical.
5. Consultar pedidos activos y existencias sin atravesar módulos ajenos al flujo.

## Datos y reglas confirmadas

- Negocio: El Bayo Distribuciones, Rafaela, Santa Fe.
- Los productos vendidos por decimal se expresan en kilogramos.
- La fuente de los productos y precios iniciales es la imagen del remito aportada por el cliente.
- Se usarán existencias de demostración holgadas para probar el pedido completo.
- Estados mínimos visibles: confirmado, en preparación y preparado.
- La documentación de esta etapa es de uso interno.

## Límites de esta primera entrega

- Persistencia local del navegador; no hay usuarios, servidor ni base de datos productiva.
- Identidad, domicilio, CUIT, logo y datos fiscales reales de la distribuidora no están confirmados.
- IVA, percepciones y reglas fiscales quedan explícitamente pendientes.
- El documento para entregar al cliente y la automatización de consultas por mensajes o audios quedan fuera del núcleo inicial.

## Principios de experiencia

- Legibilidad antes que densidad: números, códigos, cantidades y estados deben distinguirse de un vistazo.
- Lenguaje del negocio: “pedido”, “bultos”, “cantidad”, “orden de preparación” y “nota de pedido”.
- Las acciones importantes deben estar junto al pedido al que afectan.
- Los datos ficticios o pendientes deben señalarse con honestidad.
- La impresión debe funcionar desde el navegador y permitir “Guardar como PDF”.

## Evidencia

- Remito aportado: `C:\Users\juani\AppData\Local\Temp\codex-clipboard-bbf5d20c-bfef-4755-afab-8032259a0060.jpg`.
- Repositorio base: `https://github.com/juanpoggi12/node3-distribution-erp`.

