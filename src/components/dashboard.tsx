"use client";

import {
  ArrowRight,
  Boxes,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Plus,
  Printer,
} from "lucide-react";
import type { DemoState, Order, OrderDocumentType, ViewKey } from "@/lib/types";
import { findCustomer, getOrderTotal } from "@/lib/business";
import { formatCurrency, formatNumber } from "@/lib/format";
import { EmptyState, StatusBadge, orderStatusLabel } from "./ui";

export function DashboardView({
  state,
  onNavigate,
  onNewOrder,
  onOpenDocument,
}: {
  state: DemoState;
  onNavigate: (view: ViewKey) => void;
  onNewOrder: () => void;
  onOpenDocument: (order: Order, type: OrderDocumentType) => void;
}) {
  const activeOrders = state.orders.filter((order) =>
    ["confirmado", "preparacion"].includes(order.status),
  );
  const readyOrders = state.orders.filter((order) => order.status === "preparado");
  const lowStock = state.products.filter((product) => product.stock <= product.minStock);
  const nextOrder = activeOrders[0];
  const nextCustomer = nextOrder ? findCustomer(state.customers, nextOrder.customerId) : undefined;

  return (
    <section className="dashboard-grid">
      <div className="operation-hero">
        <div className="operation-copy">
          <h2>
            {activeOrders.length > 0
              ? `${activeOrders.length} ${activeOrders.length === 1 ? "pedido espera" : "pedidos esperan"} preparación`
              : "La preparación está al día"}
          </h2>
          <p>
            {nextOrder
              ? `El próximo es el #${nextOrder.number} de ${nextCustomer?.businessName ?? "cliente sin identificar"}.`
              : "Cuando confirmes un pedido aparecerá aquí para imprimir su orden."}
          </p>
          <div className="hero-actions">
            {nextOrder && (
              <button className="btn btn-light" onClick={() => onOpenDocument(nextOrder, "preparacion")}>
                <Printer size={17} /> Abrir orden de preparación
              </button>
            )}
            <button className="btn btn-hero-ghost" onClick={() => onNavigate("preparacion")}>
              Ver la cola <ArrowRight size={17} />
            </button>
          </div>
        </div>
        <div className="paper-cue" aria-hidden="true">
          <span>ORDEN DE PREPARACIÓN</span>
          <strong>#{nextOrder?.number ?? "000000"}</strong>
          <i />
          <i />
          <i />
          <small>A4 · lista para imprimir</small>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className="primary-action" onClick={onNewOrder}>
          <span><Plus size={23} /></span>
          <div><strong>Registrar un pedido</strong><small>Carga cliente, productos y cantidades</small></div>
          <ArrowRight size={18} />
        </button>
        <button onClick={() => onNavigate("pedidos")}>
          <FileText size={19} />
          <div><strong>Consultar pedidos</strong><small>Notas y documentos</small></div>
        </button>
        <button onClick={() => onNavigate("productos")}>
          <Boxes size={19} />
          <div><strong>Revisar stock</strong><small>{state.products.length} productos cargados</small></div>
        </button>
      </div>

      <div className="summary-strip" aria-label="Resumen de la operación">
        <div><ClipboardCheck size={19} /><span>Por preparar</span><strong>{activeOrders.length}</strong></div>
        <div><PackageCheck size={19} /><span>Preparados</span><strong>{readyOrders.length}</strong></div>
        <div><Boxes size={19} /><span>Productos activos</span><strong>{state.products.filter((product) => product.active).length}</strong></div>
        <div className={lowStock.length > 0 ? "has-warning" : ""}><span>Stock bajo</span><strong>{lowStock.length}</strong><small>{lowStock.length ? "Requiere revisión" : "Sin alertas"}</small></div>
      </div>

      <div className="dashboard-main">
        <section className="data-panel">
          <div className="panel-heading">
            <div>
              <h3>Pedidos en movimiento</h3>
              <p>Los que necesitan una acción ahora.</p>
            </div>
            <button className="text-button" onClick={() => onNavigate("pedidos")}>Ver todos <ArrowRight size={15} /></button>
          </div>
          {activeOrders.length === 0 ? (
            <EmptyState icon={PackageCheck} title="Todo preparado" description="No hay pedidos activos en este momento." />
          ) : (
            <div className="active-order-list">
              {activeOrders.slice(0, 4).map((order) => {
                const customer = findCustomer(state.customers, order.customerId);
                return (
                  <div className="active-order-row" key={order.id}>
                    <span className="active-order-number">#{order.number}</span>
                    <div>
                      <strong>{customer?.businessName ?? "Cliente sin identificar"}</strong>
                      <small>{order.lines.length} productos · {formatCurrency(getOrderTotal(order))}</small>
                    </div>
                    <StatusBadge status={order.status} label={orderStatusLabel(order.status)} />
                    <button className="icon-button" onClick={() => onOpenDocument(order, "preparacion")} aria-label={`Abrir orden ${order.number}`}>
                      <Printer size={17} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <aside className="stock-panel">
          <div className="panel-heading">
            <div>
              <h3>Stock de prueba</h3>
              <p>Existencias amplias para validar el flujo.</p>
            </div>
          </div>
          <div className="stock-snapshot">
            {state.products.slice(0, 5).map((product) => {
              const ratio = Math.min(100, Math.round((product.stock / Math.max(product.stock, 180)) * 100));
              return (
                <div key={product.id}>
                  <span className="stock-code">{product.sku}</span>
                  <span title={product.name}>{product.name}</span>
                  <strong>{formatNumber(product.stock)} {product.unit}</strong>
                  <i><b style={{ width: `${ratio}%` }} /></i>
                </div>
              );
            })}
          </div>
          <button className="text-button stock-link" onClick={() => onNavigate("productos")}>
            Ver los {state.products.length} productos <ArrowRight size={15} />
          </button>
        </aside>
      </div>
    </section>
  );
}
