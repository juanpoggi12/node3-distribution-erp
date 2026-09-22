# Pendientes para validar con el dueño

Este documento separa las decisiones ya construidas para la demostración de las reglas que todavía no deben tratarse como definitivas.

## Operación y stock

- Confirmar si el stock debe descontarse al confirmar el pedido, al imprimir la orden, al iniciar la preparación o al marcarlo como preparado.
- Confirmar qué ocurre con el stock cuando un pedido se cancela o se corrige.
- Definir si “bultos” y “cantidad” son campos independientes para todos los productos o sólo para algunos rubros.
- Validar cuáles productos admiten cantidades decimales además de quesos, fiambres y productos por kilogramo.

## Documentos

- Completar logo, razón social, domicilio, teléfono, CUIT e información comercial real de El Bayo Distribuciones.
- Confirmar si la nota de pedido seguirá siendo sólo interna o si también se entregará una versión al cliente.
- Validar si deben figurar vendedor, código de cliente, condición de venta, flete, descuento y saldo de cuenta corriente.
- Confirmar tratamiento de IVA, Ingresos Brutos y cualquier percepción o impuesto.
- Definir si la numeración debe ser única para pedidos, remitos y facturas o si cada documento tendrá su propia secuencia.

## Despacho por zonas

- Validar las zonas reales de reparto, sus nombres y si deben asociarse al cliente por defecto o elegirse siempre en cada pedido.
- Definir cómo identifica El Bayo cada camión o recorrido y si un pedido puede dividirse entre dos vehículos.
- Confirmar si el conteo útil para carga es por pedidos, bultos, cajas u otra unidad; el prototipo suma los bultos de las líneas del pedido.
- Validar quién asigna el camión y en qué momento se considera "cargado" un pedido. El prototipo exige zona y camión/recorrido antes de cerrar esa etapa.
- Confirmar si se necesita una planilla de carga por camión o zona, además de la nota y la orden individuales.

## Consultas y toma de pedidos — siguiente etapa

Problema informado: llegan pedidos y consultas en WhatsApp, Instagram, mensajes escritos y audios; alguien debe escuchar, interpretar y volver a cargarlos manualmente.

Propuesta para evaluar después del flujo principal:

1. Bandeja única de entradas conectada inicialmente a WhatsApp.
2. Transcripción de audios y extracción asistida de cliente, producto, cantidad y observaciones.
3. Creación de un borrador de pedido, nunca una confirmación automática.
4. Pantalla de revisión donde una persona corrige ambigüedades antes de confirmar.
5. Trazabilidad entre el mensaje original y el pedido generado.

Preguntas clave: canales prioritarios, volumen diario, calidad habitual de los audios, forma en que los clientes nombran los productos y necesidad de conservar consentimiento/historial.
