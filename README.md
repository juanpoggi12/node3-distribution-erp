# El Bayo Distribuciones — prototipo operativo

Prototipo web para registrar pedidos, controlar existencias y generar documentación interna de preparación en A4.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abrir `http://localhost:3000`.

## Flujo incluido

1. Crear un pedido y seleccionar o dar de alta rápidamente un cliente.
2. Asignar una zona de envío y, si se conoce, el camión o recorrido. Ambos datos se pueden corregir después.
3. Agregar productos por código o descripción.
4. Cargar bultos y cantidades; los productos por kilogramo admiten decimales.
5. Confirmar el pedido con numeración automática y descuento de stock.
6. Imprimir o guardar como PDF la nota de pedido y la orden de preparación, ambas con destino visible.
7. Revisar pedidos y bultos agrupados por zona y camión en Preparación y despacho.
8. Avanzar de confirmado a en preparación, preparado y cargado. Al marcar cargado, el pedido sale del conteo pendiente.

Los datos se guardan en `localStorage`; el botón de restauración vuelve al escenario de demostración. No hay todavía backend, autenticación ni base de datos productiva.

## Datos de demostración

El catálogo inicial reproduce los 17 códigos, descripciones y precios del documento entregado por el cliente. Las existencias son ficticias y deliberadamente holgadas.

Las decisiones que requieren confirmación del dueño están registradas en [PENDIENTES_VALIDACION_CLIENTE.md](PENDIENTES_VALIDACION_CLIENTE.md). La definición funcional está en [PRODUCT.md](PRODUCT.md).

Las zonas y los nombres de camiones del prototipo son texto libre; las sugerencias salen de los datos de demostración y de los pedidos cargados, no de un mapa de reparto validado.

## Verificación

```bash
npm run typecheck
npm run build
```
