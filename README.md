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
2. Agregar productos por código o descripción.
3. Cargar bultos y cantidades; los productos por kilogramo admiten decimales.
4. Confirmar el pedido con numeración automática y descuento de stock.
5. Imprimir o guardar como PDF la nota de pedido y la orden de preparación.
6. Avanzar el trabajo de depósito de confirmado a en preparación y preparado.

Los datos se guardan en `localStorage`; el botón de restauración vuelve al escenario de demostración. No hay todavía backend, autenticación ni base de datos productiva.

## Datos de demostración

El catálogo inicial reproduce los 17 códigos, descripciones y precios del documento entregado por el cliente. Las existencias son ficticias y deliberadamente holgadas.

Las decisiones que requieren confirmación del dueño están registradas en [PENDIENTES_VALIDACION_CLIENTE.md](PENDIENTES_VALIDACION_CLIENTE.md). La definición funcional está en [PRODUCT.md](PRODUCT.md).

## Verificación

```bash
npm run typecheck
npm run build
```
