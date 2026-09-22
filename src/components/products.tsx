"use client";

import { useMemo, useState } from "react";
import { Boxes, Edit3, Plus, Search, Trash2, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatCurrency, formatNumber, normalizeText } from "@/lib/format";
import { EmptyState } from "./ui";

type ProductFormData = Omit<Product, "id">;

const blankProduct: ProductFormData = {
  sku: "",
  name: "",
  category: "Otros",
  unit: "un.",
  costPrice: 0,
  stock: 100,
  minStock: 20,
  prices: { minorista: 0, mayorista: 0, especial: 0 },
  active: true,
  allowsDecimals: false,
};

export function ProductsView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}: {
  products: Product[];
  onAddProduct: (data: Omit<Product, "id">) => void;
  onUpdateProduct: (id: string, changes: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(blankProduct);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(products.map((product) => product.category))).sort(),
    [products],
  );
  const filtered = products.filter((product) => {
    if (category && product.category !== category) return false;
    if (!search.trim()) return true;
    return normalizeText(`${product.sku} ${product.name}`).includes(normalizeText(search));
  });

  const openNew = () => {
    setEditingId(null);
    setForm(blankProduct);
    setFormOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category,
      unit: product.unit,
      costPrice: product.costPrice,
      stock: product.stock,
      minStock: product.minStock,
      prices: { ...product.prices },
      active: product.active,
      allowsDecimals: product.allowsDecimals ?? false,
    });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.sku.trim() || !form.name.trim()) return;
    if (editingId) onUpdateProduct(editingId, form);
    else onAddProduct(form);
    setFormOpen(false);
    setEditingId(null);
  };

  return (
    <section className="page-stack">
      <div className="section-heading">
        <div>
          <h2>Catálogo y existencias</h2>
          <p>Los precios iniciales fueron tomados de la nota entregada por el cliente.</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}><Plus size={17} /> Nuevo producto</button>
      </div>

      <div className="product-context">
        <Boxes size={20} />
        <div><strong>{products.length} productos cargados</strong><span>Las existencias son ficticias y holgadas para probar el pedido completo.</span></div>
      </div>

      {formOpen && (
        <div className="editor-panel">
          <div className="panel-heading">
            <div><h3>{editingId ? "Editar producto" : "Nuevo producto"}</h3><p>Define cómo se carga y se muestra dentro del pedido.</p></div>
            <button className="icon-button" onClick={() => setFormOpen(false)} aria-label="Cerrar formulario"><X size={18} /></button>
          </div>
          <div className="product-form-grid">
            <label className="field-group compact-field"><span>Código</span><input value={form.sku} onChange={(event) => setForm({ ...form, sku: event.target.value })} /></label>
            <label className="field-group product-name-field"><span>Descripción</span><input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
            <label className="field-group"><span>Categoría</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label>
            <label className="field-group compact-field"><span>Unidad</span><select value={form.unit} onChange={(event) => setForm({ ...form, unit: event.target.value, allowsDecimals: event.target.value === "kg" })}><option value="un.">un.</option><option value="kg">kg</option><option value="caja">caja</option><option value="bulto">bulto</option></select></label>
            <label className="field-group"><span>Precio mayorista</span><input type="number" min="0" step="0.01" value={form.prices.mayorista} onChange={(event) => { const value = Number(event.target.value); setForm({ ...form, prices: { minorista: value, mayorista: value, especial: value } }); }} /></label>
            <label className="field-group"><span>Stock actual</span><input type="number" min="0" step={form.allowsDecimals ? "0.01" : "1"} value={form.stock} onChange={(event) => setForm({ ...form, stock: Number(event.target.value) })} /></label>
            <label className="field-group"><span>Stock mínimo</span><input type="number" min="0" step={form.allowsDecimals ? "0.01" : "1"} value={form.minStock} onChange={(event) => setForm({ ...form, minStock: Number(event.target.value) })} /></label>
            <label className="check-field"><input type="checkbox" checked={form.allowsDecimals ?? false} onChange={(event) => setForm({ ...form, allowsDecimals: event.target.checked })} /><span>Permitir cantidades decimales</span></label>
          </div>
          <div className="editor-actions">
            <button className="btn btn-secondary" onClick={() => setFormOpen(false)}>Cancelar</button>
            <button className="btn btn-primary" disabled={!form.sku.trim() || !form.name.trim()} onClick={save}>Guardar producto</button>
          </div>
        </div>
      )}

      <div className="filter-bar">
        <label className="search-field">
          <Search size={17} />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar código o descripción" />
        </label>
        <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar por categoría">
          <option value="">Todas las categorías</option>
          {categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <span className="filter-result">{filtered.length} resultados</span>
      </div>

      <div className="data-panel">
        {filtered.length === 0 ? (
          <EmptyState icon={Boxes} title="No hay productos para mostrar" description="Cambia la búsqueda o agrega un producto." />
        ) : (
          <div className="table-scroll">
            <table className="data-table products-table">
              <thead><tr><th>Código</th><th>Descripción</th><th>Categoría</th><th>Venta</th><th>Stock</th><th>Precio</th><th className="align-right">Acciones</th></tr></thead>
              <tbody>
                {filtered.map((product) => (
                  <tr key={product.id}>
                    <td><span className="sku-chip">{product.sku}</span></td>
                    <td><strong>{product.name}</strong></td>
                    <td>{product.category}</td>
                    <td>{product.allowsDecimals ? "Por kg · admite decimales" : `Por ${product.unit}`}</td>
                    <td>
                      <strong className={product.stock <= product.minStock ? "stock-low" : "stock-ok"}>{formatNumber(product.stock)} {product.unit}</strong>
                      <span className="cell-note">Mínimo {formatNumber(product.minStock)}</span>
                    </td>
                    <td className="tabular"><strong>{formatCurrency(product.prices.mayorista)}</strong></td>
                    <td>
                      <div className="row-actions align-right">
                        {confirmDelete === product.id ? (
                          <>
                            <span className="delete-question">¿Eliminar?</span>
                            <button className="btn btn-danger btn-sm" onClick={() => { onDeleteProduct(product.id); setConfirmDelete(null); }}>Sí</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => setConfirmDelete(null)}>No</button>
                          </>
                        ) : (
                          <>
                            <button className="icon-button" onClick={() => openEdit(product)} aria-label={`Editar ${product.name}`}><Edit3 size={16} /></button>
                            <button className="icon-button danger" onClick={() => setConfirmDelete(product.id)} aria-label={`Eliminar ${product.name}`}><Trash2 size={16} /></button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
