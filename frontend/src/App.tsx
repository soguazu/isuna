import { FormEvent, useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type ProductListMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

type SuccessResponse<TData, TMeta = undefined> = TMeta extends undefined
  ? {
      success: true;
      data: TData;
    }
  : {
      success: true;
      data: TData;
      meta: TMeta;
    };

type ErrorResponse = {
  success: false;
  message: string;
  errors?: Array<{
    path?: string;
    message: string;
  }>;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
};

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000/api/v1';
const emptyForm: ProductForm = {
  name: '',
  description: '',
  price: '',
  stockQuantity: ''
};

export const App = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<ProductListMeta>({ page: 1, pageSize: 10, totalItems: 0, totalPages: 0 });
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const query = useMemo(() => {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: '10'
    });

    if (search.trim()) {
      params.set('search', search.trim());
    }

    return params.toString();
  }, [page, search]);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/products?${query}`);
      const body = (await response.json()) as SuccessResponse<Product[], ProductListMeta> | ErrorResponse;

      if (!body.success) {
        throw new Error(body.message);
      }

      if (!response.ok) {
        throw new Error('Unable to load products');
      }

      setProducts(body.data);
      setMeta(body.meta);
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, [query]);

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: Number(form.price),
          stockQuantity: Number(form.stockQuantity)
        })
      });
      const body = (await response.json()) as SuccessResponse<Product> | ErrorResponse;

      if (!body.success) {
        throw new Error(toErrorMessage(body));
      }

      if (!response.ok) {
        throw new Error('Unable to create product');
      }

      setForm(emptyForm);
      setPage(1);
      await loadProducts();
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to create product');
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Delete ${product.name}?`);

    if (!confirmed) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/products/${product.id}`, {
        method: 'DELETE'
      });
      const body = (await response.json()) as SuccessResponse<{ id: string }> | ErrorResponse;

      if (!body.success) {
        throw new Error(body.message);
      }

      if (!response.ok) {
        throw new Error('Unable to delete product');
      }

      await loadProducts();
    } catch (currentError) {
      setError(currentError instanceof Error ? currentError.message : 'Unable to delete product');
    }
  };

  return (
    <main className="app-shell">
      <section className="workspace-header">
        <div>
          <p className="eyebrow">Product Management</p>
          <h1>Inventory</h1>
        </div>
        <div className="api-pill">{apiBaseUrl}</div>
      </section>

      <section className="toolbar" aria-label="Product filters">
        <label>
          <span>Search</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name or description"
          />
        </label>
      </section>

      {error ? <div className="alert">{error}</div> : null}

      <section className="content-grid">
        <form className="product-form" onSubmit={submitProduct}>
          <h2>Create Product</h2>
          <label>
            <span>Name</span>
            <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          </label>
          <label>
            <span>Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          </label>
          <div className="form-row">
            <label>
              <span>Price</span>
              <input
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                type="number"
                min="0.01"
                step="0.01"
                required
              />
            </label>
            <label>
              <span>Stock</span>
              <input
                value={form.stockQuantity}
                onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })}
                type="number"
                min="0"
                step="1"
                required
              />
            </label>
          </div>
          <button type="submit" disabled={saving}>
            {saving ? 'Creating...' : 'Create'}
          </button>
        </form>

        <section className="product-panel">
          <div className="panel-header">
            <h2>Products</h2>
            <span>{meta.totalItems} total</span>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Updated</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <strong>{product.name}</strong>
                      <small>{product.description}</small>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stockQuantity}</td>
                    <td>{new Date(product.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <button className="ghost-button" type="button" onClick={() => void deleteProduct(product)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {!loading && products.length === 0 ? (
                  <tr>
                    <td className="empty-state" colSpan={5}>
                      No products found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span>
              Page {meta.page} of {Math.max(meta.totalPages, 1)}
            </span>
            <button
              type="button"
              disabled={page >= meta.totalPages || loading}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        </section>
      </section>
    </main>
  );
};

const toErrorMessage = (body: ErrorResponse): string => {
  if (!body.errors?.length) {
    return body.message;
  }

  return body.errors.map((error) => error.message).join(', ');
};
