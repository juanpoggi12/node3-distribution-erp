"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Boxes,
  Building2,
  Check,
  ClipboardCheck,
  ClipboardList,
  LayoutDashboard,
  Plus,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react";

import type {
  Customer,
  DemoState,
  NewOrderDraft,
  Order,
  OrderDocumentType,
  OrderStatus,
  Product,
  ViewKey,
} from "@/lib/types";
import { buildOrderFromDraft, findProduct, isValidOrderTransition } from "@/lib/business";
import { initialDemoState } from "@/lib/demo-data";
import { DashboardView } from "@/components/dashboard";
import {
  NewOrderView,
  OrderDocumentModal,
  OrdersView,
  PreparationView,
} from "@/components/orders";
import { ProductsView } from "@/components/products";

const STORAGE_KEY = "el-bayo-prototipo-v1";

const navItems: Array<{ key: ViewKey; label: string; icon: LucideIcon }> = [
  { key: "inicio", label: "Inicio", icon: LayoutDashboard },
  { key: "pedidos", label: "Pedidos", icon: ClipboardList },
  { key: "preparacion", label: "Preparación", icon: ClipboardCheck },
  { key: "productos", label: "Productos y stock", icon: Boxes },
];

const pageTitles: Partial<Record<ViewKey, { title: string; sub: string }>> = {
  inicio: { title: "Panel de trabajo", sub: "Lo importante para preparar los pedidos de hoy." },
  pedidos: { title: "Pedidos", sub: "Consulta el historial y genera sus documentos." },
  preparacion: { title: "Preparación y despacho", sub: "Pedidos y bultos por zona y camión." },
  productos: { title: "Productos y stock", sub: "Catálogo cargado desde el documento de referencia." },
  "nuevo-pedido": { title: "Nuevo pedido", sub: "Carga cantidades, controla stock y confirma." },
};

const emptyDraft: NewOrderDraft = {
  customerId: "",
  lines: [],
  notes: "",
  deliveryZone: "",
  dispatchTruck: "",
  saleCondition: "CUENTA CORRIENTE",
  seller: "1",
};

function loadState(): DemoState {
  if (typeof window === "undefined") return initialDemoState;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialDemoState;
  try {
    return JSON.parse(saved) as DemoState;
  } catch {
    return initialDemoState;
  }
}

export function ErpApp() {
  const [view, setView] = useState<ViewKey>("inicio");
  const [state, setState] = useState<DemoState>(initialDemoState);
  const [storageReady, setStorageReady] = useState(false);
  const [draft, setDraft] = useState<NewOrderDraft>(emptyDraft);
  const [toast, setToast] = useState<string | null>(null);
  const [documentRequest, setDocumentRequest] = useState<{
    orderId: string;
    type: OrderDocumentType;
  } | null>(null);

  useEffect(() => {
    setState(loadState());
    setStorageReady(true);
  }, []);

  useEffect(() => {
    if (storageReady) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, storageReady]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const pendingPreparation = useMemo(
    () => state.orders.filter((order) => ["confirmado", "preparacion", "preparado"].includes(order.status)).length,
    [state.orders],
  );

  const activeDocumentOrder = documentRequest
    ? state.orders.find((order) => order.id === documentRequest.orderId)
    : undefined;

  const todayLabel = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  const openNewOrder = () => {
    setDraft({
      ...emptyDraft,
      customerId: state.customers[0]?.id ?? "",
      deliveryZone: state.customers[0]?.zone ?? "",
    });
    setView("nuevo-pedido");
  };

  const addProductToDraft = (product: Product) => {
    setDraft((current) => {
      const existing = current.lines.find((line) => line.productId === product.id);
      if (existing) {
        return {
          ...current,
          lines: current.lines.map((line) =>
            line.productId === product.id
              ? {
                  ...line,
                  packages: (line.packages ?? 1) + 1,
                  quantity: line.quantity + 1,
                }
              : line,
          ),
        };
      }
      return {
        ...current,
        lines: [
          ...current.lines,
          {
            productId: product.id,
            packages: 1,
            quantity: 1,
            unitPrice: product.prices.mayorista,
          },
        ],
      };
    });
  };

  const updateDraftLine = (
    productId: string,
    changes: Partial<{ packages: number; quantity: number; unitPrice: number }>,
  ) => {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) =>
        line.productId === productId ? { ...line, ...changes } : line,
      ),
    }));
  };

  const removeDraftLine = (productId: string) => {
    setDraft((current) => ({
      ...current,
      lines: current.lines.filter((line) => line.productId !== productId),
    }));
  };

  const submitDraftOrder = () => {
    if (!draft.customerId || draft.lines.length === 0) {
      setToast("Selecciona un cliente y agrega al menos un producto.");
      return;
    }
    if (!draft.deliveryZone.trim()) {
      setToast("Indica la zona de envío antes de confirmar el pedido.");
      return;
    }

    for (const line of draft.lines) {
      const product = findProduct(state.products, line.productId);
      if (product && line.quantity > product.stock) {
        setToast(`No alcanza el stock de ${product.name}. Disponible: ${product.stock} ${product.unit}.`);
        return;
      }
    }

    const newOrder = buildOrderFromDraft(draft, state.orders, state.customers);
    setState((current) => ({
      ...current,
      orders: [newOrder, ...current.orders],
      products: current.products.map((product) => {
        const line = draft.lines.find((item) => item.productId === product.id);
        return line ? { ...product, stock: Math.max(0, product.stock - line.quantity) } : product;
      }),
    }));
    setDraft(emptyDraft);
    setView("pedidos");
    setDocumentRequest({ orderId: newOrder.id, type: "nota" });
    setToast(`Pedido #${newOrder.number} confirmado. El stock fue actualizado.`);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const current = state.orders.find((order) => order.id === orderId);
    if (!current || current.status === status) return;
    if (!isValidOrderTransition(current.status, status)) {
      setToast("Ese cambio no corresponde al flujo de preparación.");
      return;
    }
    if (status === "cargado" && (!current.deliveryZone?.trim() || current.deliveryZone.trim().toLocaleLowerCase("es-AR") === "sin zona" || !current.dispatchTruck?.trim())) {
      setToast("Asigna una zona y un camión o recorrido antes de marcar el pedido como cargado.");
      return;
    }
    setState((previous) => ({
      ...previous,
      orders: previous.orders.map((order) =>
        order.id === orderId ? { ...order, status } : order,
      ),
    }));
    setToast(status === "preparacion" ? "Pedido enviado a preparación." : status === "preparado" ? "Pedido marcado como preparado." : "Pedido cargado y retirado del conteo pendiente.");
  };

  const openDocument = (order: Order, type: OrderDocumentType) => {
    setDocumentRequest({ orderId: order.id, type });
  };

  const assignDispatch = (orderId: string, deliveryZone: string, dispatchTruck: string) => {
    setState((current) => ({
      ...current,
      orders: current.orders.map((order) =>
        order.id === orderId
          ? { ...order, deliveryZone: deliveryZone.trim() || "Sin zona", dispatchTruck: dispatchTruck.trim() }
          : order,
      ),
    }));
    setToast("Destino del pedido actualizado.");
  };

  const addCustomer = (data: Pick<Customer, "businessName" | "contactName" | "address" | "city">) => {
    const id = `c-${Date.now()}`;
    const customer: Customer = {
      id,
      code: String(state.customers.length + 181).padStart(3, "0") + " / 0",
      businessName: data.businessName.toUpperCase(),
      contactName: data.contactName,
      phone: "",
      address: data.address,
      city: data.city.toUpperCase(),
      postalCode: "2300",
      province: "SANTA FE",
      zone: data.city,
      customerType: "Comercio",
      priceList: "mayorista",
      creditLimit: 0,
      currentDebt: 0,
      status: "activo",
      notes: "Alta rápida desde el pedido.",
    };
    setState((current) => ({ ...current, customers: [...current.customers, customer] }));
    setDraft((current) => ({ ...current, customerId: id, deliveryZone: data.city, dispatchTruck: "" }));
    setToast("Cliente agregado al pedido.");
    return id;
  };

  const addProduct = (data: Omit<Product, "id">) => {
    setState((current) => ({
      ...current,
      products: [...current.products, { ...data, id: `p-${Date.now()}` }],
    }));
    setToast("Producto agregado.");
  };

  const updateProduct = (id: string, changes: Partial<Product>) => {
    setState((current) => ({
      ...current,
      products: current.products.map((product) =>
        product.id === id ? { ...product, ...changes } : product,
      ),
    }));
    setToast("Producto actualizado.");
  };

  const deleteProduct = (id: string) => {
    if (state.orders.some((order) => order.lines.some((line) => line.productId === id))) {
      setToast("No se puede eliminar: el producto ya aparece en un pedido.");
      return;
    }
    setState((current) => ({
      ...current,
      products: current.products.filter((product) => product.id !== id),
    }));
    setToast("Producto eliminado.");
  };

  const resetDemo = () => {
    setState(initialDemoState);
    setDraft(emptyDraft);
    setView("inicio");
    setToast("Datos de demostración restaurados.");
  };

  const activeTitle = pageTitles[view] ?? pageTitles.inicio!;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">EB</span>
          <div>
            <strong>El Bayo</strong>
            <span>Distribuciones</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Navegación principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            const count = item.key === "preparacion" ? pendingPreparation : 0;
            return (
              <button
                key={item.key}
                className={`nav-item ${view === item.key ? "active" : ""}`}
                onClick={() => setView(item.key)}
              >
                <Icon size={19} aria-hidden="true" />
                <span>{item.label}</span>
                {count > 0 && <span className="nav-count">{count}</span>}
              </button>
            );
          })}
        </nav>

        <div className="business-card">
          <Building2 size={18} aria-hidden="true" />
          <div>
            <strong>Rafaela, Santa Fe</strong>
            <span>Datos de demostración</span>
          </div>
        </div>
        <p className="sidebar-note">Prototipo operativo · La información fiscal está pendiente de validación.</p>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="topbar-copy">
            <p className="topbar-date">{todayLabel}</p>
            <h1>{activeTitle.title}</h1>
            <p>{activeTitle.sub}</p>
          </div>
          <div className="topbar-actions">
            {view !== "nuevo-pedido" && (
              <button className="btn btn-primary" onClick={openNewOrder}>
                <Plus size={17} aria-hidden="true" /> Nuevo pedido
              </button>
            )}
            <button
              className="btn btn-icon btn-secondary"
              onClick={resetDemo}
              title="Restaurar datos de demostración"
              aria-label="Restaurar datos de demostración"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </header>

        <main className="page-content">
          {view === "inicio" && (
            <DashboardView state={state} onNavigate={setView} onNewOrder={openNewOrder} onOpenDocument={openDocument} />
          )}
          {view === "pedidos" && (
            <OrdersView state={state} onOpenDocument={openDocument} onNewOrder={openNewOrder} onAssignDispatch={assignDispatch} />
          )}
          {view === "preparacion" && (
            <PreparationView state={state} onUpdateStatus={updateOrderStatus} onOpenDocument={openDocument} onAssignDispatch={assignDispatch} />
          )}
          {view === "nuevo-pedido" && (
            <NewOrderView
              state={state}
              draft={draft}
              onDraftChange={setDraft}
              onAddProduct={addProductToDraft}
              onUpdateLine={updateDraftLine}
              onRemoveLine={removeDraftLine}
              onSubmit={submitDraftOrder}
              onCancel={() => setView("pedidos")}
              onAddCustomer={addCustomer}
            />
          )}
          {view === "productos" && (
            <ProductsView
              products={state.products}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
            />
          )}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="Navegación móvil">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? "active" : ""}`}
              onClick={() => setView(item.key)}
            >
              <Icon size={19} />
              <span>{item.label.replace(" y stock", "")}</span>
            </button>
          );
        })}
      </nav>

      {documentRequest && activeDocumentOrder && (
        <OrderDocumentModal
          type={documentRequest.type}
          order={activeDocumentOrder}
          customer={state.customers.find((customer) => customer.id === activeDocumentOrder.customerId)}
          products={state.products}
          onClose={() => setDocumentRequest(null)}
        />
      )}

      {toast && (
        <div className="toast" role="status">
          <Check size={17} aria-hidden="true" /> {toast}
        </div>
      )}
    </div>
  );
}
