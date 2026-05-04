import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { productsApi } from '@/lib/api/products.api';
import type { CreateProductInput, Product, ProductListMeta } from '@/lib/types/product';
import { extractMessage } from '@/lib/utils/error';
import { usePermission } from '@/lib/hooks/usePermission';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';
import { Pagination } from '@/shared/components/Pagination';
import { Spinner } from '@/shared/components/Spinner';
import { EditProductModal } from '../components/EditProductModal';

const emptyForm: CreateProductInput = { name: '', description: '', price: 0, stockQuantity: 0 };
const emptyMeta: ProductListMeta = { page: 1, pageSize: 10, totalItems: 0, totalPages: 0 };

export const ProductListPage = () => {
  const { can } = usePermission();
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>(emptyMeta);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<CreateProductInput>(emptyForm);
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasActions = can('products:update') || can('products:delete');

  const params = useMemo(
    () => ({ page, pageSize: 10, ...(search.trim() ? { search: search.trim() } : {}) }),
    [page, search],
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await productsApi.list(params);
      setProducts(res.data);
      setMeta(res.meta);
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [params]);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await productsApi.create({ ...form, price: Number(formPrice), stockQuantity: Number(formStock) });
      setForm(emptyForm);
      setFormPrice('');
      setFormStock('');
      setShowForm(false);
      setPage(1);
      await load();
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleUpdated = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    setError(null);
    try {
      await productsApi.remove(product.id);
      await load();
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <p className="eyebrow">Inventory</p>
          <h1>Products</h1>
        </div>
        {can('products:create') && (
          <Button onClick={() => setShowForm((v) => !v)} variant={showForm ? 'outline' : 'primary'}>
            {showForm ? 'Cancel' : '+ New product'}
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {showForm && can('products:create') && (
        <div className="card card--form">
          <h2 className="card__title">Create product</h2>
          <form className="form" onSubmit={(e) => void handleCreate(e)}>
            <div className="field">
              <label className="field__label" htmlFor="name">Name <span className="field__required">*</span></label>
              <input
                className="field__input"
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="description">Description <span className="field__required">*</span></label>
              <textarea
                className="field__input"
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>
            <div className="form__row">
              <div className="field">
                <label className="field__label" htmlFor="price">Price <span className="field__required">*</span></label>
                <input
                  className="field__input"
                  id="price"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label className="field__label" htmlFor="stock">Stock <span className="field__required">*</span></label>
                <input
                  className="field__input"
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formStock}
                  onChange={(e) => setFormStock(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form__actions">
              <Button type="submit" loading={saving}>{saving ? 'Creating…' : 'Create product'}</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card__toolbar">
          <div className="field field--inline">
            <input
              className="field__input"
              placeholder="Search by name or description…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {loading && <Spinner size="sm" />}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Updated</th>
                {hasActions && <th aria-label="Actions" />}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.name}</strong>
                    <small>{p.description}</small>
                  </td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stockQuantity}</td>
                  <td>{new Date(p.updatedAt).toLocaleDateString()}</td>
                  {hasActions && (
                    <td>
                      <div className="row-actions">
                        {can('products:update') && (
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            onClick={() => setEditingProduct(p)}
                          >
                            Edit
                          </Button>
                        )}
                        {can('products:delete') && (
                          <Button
                            variant="danger-outline"
                            size="sm"
                            type="button"
                            loading={deletingId === p.id}
                            onClick={() => void handleDelete(p)}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td className="empty-state" colSpan={hasActions ? 5 : 4}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={meta.page}
          totalPages={meta.totalPages}
          totalItems={meta.totalItems}
          pageSize={meta.pageSize}
          loading={loading}
          onPageChange={setPage}
        />
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdated={handleUpdated}
        />
      )}
    </div>
  );
};
