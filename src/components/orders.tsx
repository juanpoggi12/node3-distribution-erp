"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ClipboardCheck,
  FileText,
  PackageCheck,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  Truck,
  UserPlus,
  X,
} from "lucide-react";
import type {
  Customer,
  DemoState,
  NewOrderDraft,
  Order,
  OrderDocumentType,
  OrderStatus,
  Product,
} from "@/lib/types";
import { findCustomer, findProduct, getDispatchGroups, getOrderPackages, getOrderTotal } from "@/lib/business";
import { formatCurrency, formatDate, formatNumber, normalizeText } from "@/lib/format";
import { EmptyState, StatusBadge, orderStatusLabel } from "./ui";

type DocumentRequest = (order: Order, type: OrderDocumentType) => void;
type DispatchAssignment = (orderId: string, zone: string, truck: string) => void;

function lineCountLabel(order: Order) {
  return `${order.lines.length} ${order.lines.length === 1 ? "producto" : "productos"}`;
}

function dispatchSuggestions(state: DemoState) {
  return {
    zones: [...new Set([...state.customers.map((customer) => customer.zone), ...state.orders.map((order) => order.deliveryZone)].filter((zone) => zone && zone !== "Sin zona"))],
    trucks: [...new Set(state.orders.map((order) => order.dispatchTruck?.trim()).filter((truck): truck is string => Boolean(truck)))],
  };
}

function DispatchAssignmentEditor({
  order,
  zones,
  trucks,
  onSave,
}: {
  order: Order;
  zones: string[];
  trucks: string[];
  onSave: DispatchAssignment;
}) {
  const [editing, setEditing] = useState(false);
  const [zone, setZone] = useState(order.deliveryZone || "");
  const [truck, setTruck] = useState(order.dispatchTruck || "");

  const startEditing = () => {
    setZone(order.deliveryZone === "Sin zona" ? "" : order.deliveryZone || "");
    setTruck(order.dispatchTruck || "");
    setEditing(true);
  };

  return (
    <div className="dispatch-assignment">
      <strong>{order.deliveryZone?.trim() || "Sin zona"}</strong>
      <span>{order.dispatchTruck?.trim() || "Sin camión asignado"}</span>
      {!editing ? (
        <button className="text-button dispatch-edit-trigger" onClick={startEditing} aria-label={`Editar destino del pedido ${order.number}`}>
          <Pencil size={13} /> Editar destino
        </button>
      ) : (
        <form
          className="dispatch-assignment-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!zone.trim()) return;
            onSave(order.id, zone, truck);
            setEditing(false);
          }}
        >
          <label className="field-group">
            <span>Zona de envío</span>
            <input value={zone} onChange={(event) => setZone(event.target.value)} list={`zones-${order.id}`} placeholder="Ej. Rafaela centro" required />
            <datalist id={`zones-${order.id}`}>{zones.map((item) => <option key={item} value={item} />)}</datalist>
          </label>
          <label className="field-group">
            <span>Camión o recorrido</span>
            <input value={truck} onChange={(event) => setTruck(event.target.value)} list={`trucks-${order.id}`} placeholder="Ej. Camión 1" />
            <datalist id={`trucks-${order.id}`}>{trucks.map((item) => <option key={item} value={item} />)}</datalist>
          </label>
          <div className="row-actions">
            <button className="btn btn-primary btn-sm" disabled={!zone.trim()} type="submit">Guardar</button>
            <button className="btn btn-secondary btn-sm" type="button" onClick={() => setEditing(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}

export function OrdersView({
  state,
  onOpenDocument,
  onNewOrder,
  onAssignDispatch,
}: {
  state: DemoState;
  onOpenDocument: DocumentRequest;
  onNewOrder: () => void;
  onAssignDispatch: DispatchAssignment;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const suggestions = dispatchSuggestions(state);

  const orders = useMemo(
    () =>
      state.orders.filter((order) => {
        if (status && order.status !== status) return false;
        if (!search.trim()) return true;
        const customer = findCustomer(state.customers, order.customerId);
        const term = normalizeText(search);
        return (
          order.number.includes(search.trim()) ||
          normalizeText(customer?.businessName ?? "").includes(term) ||
          normalizeText(`${order.deliveryZone ?? ""} ${order.dispatchTruck ?? ""}`).includes(term)
        );
      }),
    [search, state.customers, state.orders, status],
  );

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <h2>Todos los pedidos</h2>
          <p>Abre una nota o una orden de preparación sin perder el contexto.</p>
        </div>
        <button className="btn btn-primary" onClick={onNewOrder}>
          <Plus size={17} /> Nuevo pedido
        </button>
      </div>

      <div className="filter-bar">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar cliente, número o destino"
            aria-label="Buscar pedidos"
          />
        </label>
        <select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          <option value="confirmado">Confirmado</option>
          <option value="preparacion">En preparación</option>
          <option value="preparado">Preparado</option>
          <option value="cargado">Cargado</option>
        </select>
        <span className="filter-result">{orders.length} {orders.length === 1 ? "pedido" : "pedidos"}</span>
      </div>

      <div className="data-panel">
        {orders.length === 0 ? (
          <EmptyState icon={FileText} title="No encontramos pedidos" description="Prueba con otro cliente, número o estado." />
        ) : (
          <div className="table-scroll">
            <table className="data-table orders-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Destino</th>
                  <th>Fecha</th>
                  <th>Detalle</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th className="align-right">Documentos</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const customer = findCustomer(state.customers, order.customerId);
                  return (
                    <tr key={order.id}>
                      <td><strong className="order-number">#{order.number}</strong></td>
                      <td>
                        <strong>{customer?.businessName ?? "Cliente sin identificar"}</strong>
                        <span className="cell-note">{customer?.city ?? "Sin localidad"}</span>
                      </td>
                      <td><DispatchAssignmentEditor order={order} zones={suggestions.zones} trucks={suggestions.trucks} onSave={onAssignDispatch} /></td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>{lineCountLabel(order)}</td>
                      <td className="tabular"><strong>{formatCurrency(getOrderTotal(order))}</strong></td>
                      <td><StatusBadge status={order.status} label={orderStatusLabel(order.status)} /></td>
                      <td>
                        <div className="row-actions align-right">
                          <button className="btn btn-secondary btn-sm" onClick={() => onOpenDocument(order, "nota")}>
                            <FileText size={15} /> Nota
                          </button>
                          <button className="btn btn-secondary btn-sm" onClick={() => onOpenDocument(order, "preparacion")}>
                            <Printer size={15} /> Preparación
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

export function NewOrderView({
  state,
  draft,
  onDraftChange,
  onAddProduct,
  onUpdateLine,
  onRemoveLine,
  onSubmit,
  onCancel,
  onAddCustomer,
}: {
  state: DemoState;
  draft: NewOrderDraft;
  onDraftChange: (draft: NewOrderDraft) => void;
  onAddProduct: (product: Product) => void;
  onUpdateLine: (
    productId: string,
    changes: Partial<{ packages: number; quantity: number; unitPrice: number }>,
  ) => void;
  onRemoveLine: (productId: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  onAddCustomer: (data: Pick<Customer, "businessName" | "contactName" | "address" | "city">) => string;
}) {
  const [query, setQuery] = useState("");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    businessName: "",
    contactName: "",
    address: "",
    city: "Rafaela",
  });

  const customer = findCustomer(state.customers, draft.customerId);
  const suggestions = dispatchSuggestions(state);
  const total = draft.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const filteredProducts = state.products.filter((product) => {
    if (!product.active) return false;
    if (!query.trim()) return true;
    const term = normalizeText(query);
    return normalizeText(`${product.sku} ${product.name}`).includes(term);
  });

  const createCustomer = () => {
    if (!newCustomer.businessName.trim() || !newCustomer.city.trim()) return;
    onAddCustomer(newCustomer);
    setShowCustomerForm(false);
    setNewCustomer({ businessName: "", contactName: "", address: "", city: "Rafaela" });
  };

  return (
    <section className="page-stack order-entry">
      <button className="back-link" onClick={onCancel}>
        <ArrowLeft size={16} /> Volver a pedidos
      </button>

      <div className="order-step customer-step">
        <div className="step-title">
          <span>1</span>
          <div>
            <h2>Cliente y condiciones</h2>
            <p>Estos datos aparecerán en la nota del pedido.</p>
          </div>
        </div>
        <div className="customer-fields">
          <label className="field-group field-grow">
            <span>Cliente</span>
            <select
              value={draft.customerId}
              onChange={(event) => {
                const selected = findCustomer(state.customers, event.target.value);
                onDraftChange({
                  ...draft,
                  customerId: event.target.value,
                  deliveryZone: selected?.zone ?? "",
                  dispatchTruck: "",
                });
              }}
            >
              <option value="">Seleccionar cliente</option>
              {state.customers.map((item) => (
                <option key={item.id} value={item.id}>{item.businessName}</option>
              ))}
            </select>
          </label>
          <label className="field-group">
            <span>Condición de venta</span>
            <select
              value={draft.saleCondition}
              onChange={(event) => onDraftChange({ ...draft, saleCondition: event.target.value })}
            >
              <option>CUENTA CORRIENTE</option>
              <option>CONTADO</option>
            </select>
          </label>
          <label className="field-group compact-field">
            <span>Vendedor</span>
            <input value={draft.seller} onChange={(event) => onDraftChange({ ...draft, seller: event.target.value })} />
          </label>
          <button className="btn btn-secondary customer-add" onClick={() => setShowCustomerForm((value) => !value)}>
            <UserPlus size={16} /> Nuevo cliente
          </button>
        </div>
        {customer && (
          <div className="customer-summary">
            <strong>{customer.businessName}</strong>
            <span>{customer.address} · {customer.postalCode} {customer.city} · {customer.province}</span>
            <span>Código {customer.code ?? "—"}</span>
          </div>
        )}
        <div className="order-dispatch-fields">
          <div className="dispatch-field-heading">
            <Truck size={18} aria-hidden="true" />
            <div><strong>Destino de despacho</strong><span>La zona y el camión aparecerán en la nota y en la orden de preparación.</span></div>
          </div>
          <div className="dispatch-field-grid">
            <label className="field-group">
              <span>Zona de envío</span>
              <input
                value={draft.deliveryZone}
                onChange={(event) => onDraftChange({ ...draft, deliveryZone: event.target.value })}
                list="draft-delivery-zones"
                placeholder="Ej. Rafaela centro"
              />
              <datalist id="draft-delivery-zones">{suggestions.zones.map((zone) => <option key={zone} value={zone} />)}</datalist>
            </label>
            <label className="field-group">
              <span>Camión o recorrido <small>(opcional al confirmar)</small></span>
              <input
                value={draft.dispatchTruck}
                onChange={(event) => onDraftChange({ ...draft, dispatchTruck: event.target.value })}
                list="draft-dispatch-trucks"
                placeholder="Ej. Camión 1"
              />
              <datalist id="draft-dispatch-trucks">{suggestions.trucks.map((truck) => <option key={truck} value={truck} />)}</datalist>
            </label>
          </div>
        </div>
        {showCustomerForm && (
          <div className="inline-form">
            <label className="field-group">
              <span>Nombre o razón social</span>
              <input value={newCustomer.businessName} onChange={(event) => setNewCustomer({ ...newCustomer, businessName: event.target.value })} />
            </label>
            <label className="field-group">
              <span>Contacto</span>
              <input value={newCustomer.contactName} onChange={(event) => setNewCustomer({ ...newCustomer, contactName: event.target.value })} />
            </label>
            <label className="field-group">
              <span>Dirección</span>
              <input value={newCustomer.address} onChange={(event) => setNewCustomer({ ...newCustomer, address: event.target.value })} />
            </label>
            <label className="field-group">
              <span>Localidad</span>
              <input value={newCustomer.city} onChange={(event) => setNewCustomer({ ...newCustomer, city: event.target.value })} />
            </label>
            <button className="btn btn-primary" disabled={!newCustomer.businessName.trim()} onClick={createCustomer}>Agregar</button>
          </div>
        )}
      </div>

      <div className="order-builder-layout">
        <div className="order-step product-catalog">
          <div className="step-title">
            <span>2</span>
            <div>
              <h2>Agregar productos</h2>
              <p>Busca por código o descripción.</p>
            </div>
          </div>
          <label className="search-field catalog-search">
            <Search size={17} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ej. 007 o cuartirolo" />
          </label>
          <div className="catalog-list">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                className="catalog-row"
                disabled={!draft.customerId}
                onClick={() => onAddProduct(product)}
              >
                <span className="sku-chip">{product.sku}</span>
                <span className="catalog-name">
                  <strong>{product.name}</strong>
                  <small>Stock {formatNumber(product.stock)} {product.unit}</small>
                </span>
                <span className="catalog-price">{formatCurrency(product.prices.mayorista)}</span>
                <Plus size={17} aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        <div className="order-step order-draft">
          <div className="step-title">
            <span>3</span>
            <div>
              <h2>Revisar y confirmar</h2>
              <p>Ajusta bultos, cantidad y precio si hace falta.</p>
            </div>
          </div>
          {draft.lines.length === 0 ? (
            <EmptyState icon={ClipboardCheck} title="El pedido está vacío" description="Selecciona un cliente y agrega productos desde la lista." />
          ) : (
            <>
              <div className="draft-lines">
                {draft.lines.map((line) => {
                  const product = findProduct(state.products, line.productId);
                  if (!product) return null;
                  return (
                    <div className="draft-line" key={line.productId}>
                      <div className="draft-product">
                        <span className="sku-chip">{product.sku}</span>
                        <div>
                          <strong>{product.name}</strong>
                          <small>Disponible: {formatNumber(product.stock)} {product.unit}</small>
                        </div>
                      </div>
                      <label className="line-field">
                        <span>Bultos</span>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={line.packages ?? 1}
                          onChange={(event) => onUpdateLine(line.productId, { packages: Math.max(0, Number(event.target.value)) })}
                        />
                      </label>
                      <label className="line-field">
                        <span>Cantidad ({product.unit})</span>
                        <input
                          type="number"
                          min={product.allowsDecimals ? 0.01 : 1}
                          step={product.allowsDecimals ? 0.01 : 1}
                          value={line.quantity}
                          onChange={(event) => onUpdateLine(line.productId, { quantity: Math.max(product.allowsDecimals ? 0.01 : 1, Number(event.target.value)) })}
                        />
                      </label>
                      <label className="line-field price-field">
                        <span>Precio unit.</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(event) => onUpdateLine(line.productId, { unitPrice: Math.max(0, Number(event.target.value)) })}
                        />
                      </label>
                      <div className="line-total">
                        <span>Importe</span>
                        <strong>{formatCurrency(line.quantity * line.unitPrice)}</strong>
                      </div>
                      <button className="icon-button danger" onClick={() => onRemoveLine(line.productId)} aria-label={`Quitar ${product.name}`}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
              </div>
              <label className="field-group order-notes">
                <span>Observaciones para depósito</span>
                <textarea
                  value={draft.notes}
                  onChange={(event) => onDraftChange({ ...draft, notes: event.target.value })}
                  placeholder="Ej. controlar vencimientos, separar mercadería refrigerada…"
                />
              </label>
            </>
          )}

          <div className="draft-footer">
            <div>
              <span>Total del pedido</span>
              <strong>{formatCurrency(total)}</strong>
              <small>IVA e impuestos: pendientes de validación</small>
            </div>
            <button className="btn btn-primary btn-lg" disabled={!draft.customerId || !draft.deliveryZone.trim() || draft.lines.length === 0} onClick={onSubmit}>
              <Check size={18} /> Confirmar pedido
            </button>
          </div>
          <p className="stock-disclaimer">Al confirmar se descontará el stock. Esta regla es provisoria y debe validarse con el dueño.</p>
        </div>
      </div>
    </section>
  );
}

export function PreparationView({
  state,
  onUpdateStatus,
  onOpenDocument,
  onAssignDispatch,
}: {
  state: DemoState;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onOpenDocument: DocumentRequest;
  onAssignDispatch: DispatchAssignment;
}) {
  const groups = getDispatchGroups(state.orders);
  const pendingCount = groups.reduce((total, group) => total + group.orders.length, 0);
  const loaded = state.orders.filter((order) => order.status === "cargado").slice(0, 5);
  const suggestions = dispatchSuggestions(state);

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <h2>Pedidos por zona</h2>
          <p>Los pedidos se agrupan por zona hasta que se cargan en el camión o recorrido.</p>
        </div>
        <span className="work-count">{pendingCount} por cargar</span>
      </div>

      {groups.length === 0 ? (
        <div className="data-panel">
          <EmptyState icon={PackageCheck} title="No hay pedidos por cargar" description="Los pedidos confirmados aparecerán aquí agrupados por zona." />
        </div>
      ) : (
        <div className="dispatch-groups">
          {groups.map((group) => (
            <section className="dispatch-group" key={group.zone}>
              <header className="dispatch-group-header">
                <div>
                  <span>Zona de envío</span>
                  <h3>{group.zone}</h3>
                </div>
                <div className="dispatch-group-counts">
                  <strong>{group.orders.length} {group.orders.length === 1 ? "pedido" : "pedidos"}</strong>
                  <span>{formatNumber(group.packages)} {group.packages === 1 ? "bulto" : "bultos"}</span>
                </div>
              </header>
              <div className="dispatch-truck-counts" aria-label={`Camiones de ${group.zone}`}>
                {group.trucks.map((truck) => (
                  <span className={truck.name === "Sin camión" ? "unassigned" : ""} key={truck.name}>
                    <Truck size={14} aria-hidden="true" />
                    <strong>{truck.name}</strong>
                    <span>{truck.orders} {truck.orders === 1 ? "pedido" : "pedidos"} · {formatNumber(truck.packages)} {truck.packages === 1 ? "bulto" : "bultos"}</span>
                  </span>
                ))}
              </div>
              <div className="preparation-list">
                {group.orders.map((order) => {
                  const customer = findCustomer(state.customers, order.customerId);
                  const packages = getOrderPackages(order);
                  return (
                    <article className="preparation-row" key={order.id}>
                      <div className="prep-order-id">
                        <span>Pedido</span>
                        <strong>#{order.number}</strong>
                      </div>
                      <div className="prep-customer">
                        <strong>{customer?.businessName ?? "Cliente sin identificar"}</strong>
                        <span>{lineCountLabel(order)} · {formatNumber(packages)} {packages === 1 ? "bulto" : "bultos"}</span>
                      </div>
                      <DispatchAssignmentEditor order={order} zones={suggestions.zones} trucks={suggestions.trucks} onSave={onAssignDispatch} />
                      <div className="prep-state">
                        <StatusBadge status={order.status} label={orderStatusLabel(order.status)} />
                        {order.status === "preparado" && <span>Listo para cargar</span>}
                      </div>
                      <div className="prep-actions">
                        <button className="btn btn-secondary" onClick={() => onOpenDocument(order, "preparacion")}>
                          <Printer size={16} /> Orden
                        </button>
                        {order.status === "confirmado" && (
                          <button className="btn btn-primary" onClick={() => onUpdateStatus(order.id, "preparacion")}>
                            Iniciar <ArrowRight size={16} />
                          </button>
                        )}
                        {order.status === "preparacion" && (
                          <button className="btn btn-primary" onClick={() => onUpdateStatus(order.id, "preparado")}>
                            <PackageCheck size={16} /> Preparado
                          </button>
                        )}
                        {order.status === "preparado" && (
                          <button className="btn btn-primary" onClick={() => onUpdateStatus(order.id, "cargado")}>
                            <Truck size={16} /> Marcar cargado
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}

      {loaded.length > 0 && (
        <div className="ready-section">
          <h3>Cargados recientemente</h3>
          <div className="ready-list">
            {loaded.map((order) => (
              <button key={order.id} onClick={() => onOpenDocument(order, "preparacion")}>
                <Truck size={17} />
                <span><strong>#{order.number}</strong> · {order.deliveryZone} · {order.dispatchTruck}</span>
                <FileText size={16} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function documentDate(date: string) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  );
}

function documentMoney(value: number) {
  return new Intl.NumberFormat("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}

export function OrderDocumentModal({
  type,
  order,
  customer,
  products,
  onClose,
}: {
  type: OrderDocumentType;
  order: Order;
  customer?: Customer;
  products: Product[];
  onClose: () => void;
}) {
  useEffect(() => {
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeWithEscape);
    return () => window.removeEventListener("keydown", closeWithEscape);
  }, [onClose]);

  const isPreparation = type === "preparacion";
  const total = getOrderTotal(order);

  return (
    <div className="document-overlay" role="dialog" aria-modal="true" aria-label={isPreparation ? "Orden de preparación" : "Nota de pedido"}>
      <div className="document-toolbar">
        <div>
          <strong>Vista previa A4</strong>
          <span>En la ventana de impresión puedes elegir “Guardar como PDF”.</span>
        </div>
        <div className="row-actions">
          <button className="btn btn-secondary" onClick={onClose}><X size={16} /> Cerrar</button>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} /> Imprimir o guardar PDF</button>
        </div>
      </div>

      <div className="document-paper-frame">
      <article className="order-document">
        <header className="document-header">
          <div className="document-brand">
            <span>EB</span>
            <div>
              <strong>EL BAYO DISTRIBUCIONES</strong>
              <small>Rafaela, Santa Fe · Datos comerciales a completar</small>
            </div>
          </div>
          <div className="document-identity">
            <strong>{isPreparation ? "ORDEN DE PREPARACIÓN" : "NOTA DE PEDIDO"}</strong>
            <span>Nº {order.number}</span>
            <small>Fecha {documentDate(order.createdAt)}</small>
          </div>
        </header>

        <section className="document-customer">
          <div>
            <span>Cliente</span>
            <strong>{customer?.businessName ?? "SIN CLIENTE"}</strong>
            <p>{customer?.address || "Sin dirección"}</p>
            <p>{customer?.postalCode} {customer?.city} · {customer?.province}</p>
          </div>
          <dl>
            <div><dt>Código</dt><dd>{customer?.code ?? "—"}</dd></div>
            <div><dt>Vendedor</dt><dd>{order.seller ?? order.owner}</dd></div>
            <div><dt>Condición</dt><dd>{order.saleCondition ?? "A confirmar"}</dd></div>
          </dl>
        </section>

        <section className="document-dispatch" aria-label="Destino de despacho">
          <div>
            <span>Zona de envío</span>
            <strong>{order.deliveryZone?.trim() || "SIN ZONA ASIGNADA"}</strong>
          </div>
          <div>
            <span>Camión o recorrido</span>
            <strong>{order.dispatchTruck?.trim() || "PENDIENTE DE ASIGNACIÓN"}</strong>
          </div>
        </section>

        <table className={`document-table ${isPreparation ? "preparation-document-table" : ""}`}>
          <thead>
            <tr>
              {isPreparation && <th className="check-column">✓</th>}
              <th>Cgo</th>
              <th>Descripción</th>
              <th className="number-column">Bultos</th>
              <th className="number-column">Cantidad</th>
              <th>Unidad</th>
              {!isPreparation && <th className="money-column">Precio unit.</th>}
              {!isPreparation && <th className="number-column">% dto.</th>}
              {!isPreparation && <th className="money-column">Total</th>}
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => {
              const product = findProduct(products, line.productId);
              return (
                <tr key={line.productId}>
                  {isPreparation && <td className="check-column"><span className="paper-checkbox" /></td>}
                  <td>{product?.sku ?? "—"}</td>
                  <td>{product?.name ?? "Producto"}</td>
                  <td className="number-column">{documentMoney(line.packages ?? 1)}</td>
                  <td className="number-column">{documentMoney(line.quantity)}</td>
                  <td>{product?.unit ?? "un."}</td>
                  {!isPreparation && <td className="money-column">{documentMoney(line.unitPrice)}</td>}
                  {!isPreparation && <td className="number-column">0,00</td>}
                  {!isPreparation && <td className="money-column">{documentMoney(line.quantity * line.unitPrice)}</td>}
                </tr>
              );
            })}
          </tbody>
        </table>

        {isPreparation ? (
          <>
            <section className="document-notes">
              <span>Observaciones</span>
              <p>{order.notes || "Sin observaciones."}</p>
            </section>
            <footer className="preparation-footer">
              <div><span>Preparó</span><i /></div>
              <div><span>Controló</span><i /></div>
              <div><span>Hora de finalización</span><i /></div>
            </footer>
          </>
        ) : (
          <>
            <section className="document-totals">
              <div><span>Total neto</span><strong>{documentMoney(total)}</strong></div>
              <div><span>Descuento</span><strong>0,00</strong></div>
              <div><span>Flete</span><strong>0,00</strong></div>
              <div><span>I.V.A.</span><strong>0,00</strong></div>
              <div className="grand-total"><span>Total</span><strong>$ {documentMoney(total)}</strong></div>
            </section>
            <section className="document-notes compact">
              <span>Observaciones</span>
              <p>{order.notes || "Sin observaciones."}</p>
            </section>
          </>
        )}

        <p className="document-footnote">Documento interno de demostración. Datos fiscales e impuestos pendientes de validación con la distribuidora.</p>
      </article>
      </div>
    </div>
  );
}
