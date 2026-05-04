import { type FormEvent, useState } from 'react';
import { productsApi } from '@/lib/api/products.api';
import type { Product } from '@/lib/types/product';
import { extractMessage } from '@/lib/utils/error';
import { Alert } from '@/shared/components/Alert';
import { Button } from '@/shared/components/Button';

type Props = {
  product: Product;
  onClose: () => void;
  onUpdated: (updated: Product) => void;
};

export const EditProductModal = ({ product, onClose, onUpdated }: Props) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(String(product.price));
  const [stockQuantity, setStockQuantity] = useState(String(product.stockQuantity));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const updated = await productsApi.update(product.id, {
        name,
        description,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
      });
      onUpdated(updated);
      onClose();
    } catch (err) {
      setError(extractMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-modal-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title" id="edit-modal-title">Edit product</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <form className="form" onSubmit={(e) => void handleSubmit(e)}>
          <div className="field">
            <label className="field__label" htmlFor="edit-name">Name <span className="field__required">*</span></label>
            <input className="field__input" id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="edit-description">Description <span className="field__required">*</span></label>
            <textarea className="field__input" id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div className="form__row">
            <div className="field">
              <label className="field__label" htmlFor="edit-price">Price <span className="field__required">*</span></label>
              <input className="field__input" id="edit-price" type="number" min="0.01" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </div>
            <div className="field">
              <label className="field__label" htmlFor="edit-stock">Stock <span className="field__required">*</span></label>
              <input className="field__input" id="edit-stock" type="number" min="0" step="1" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} required />
            </div>
          </div>
          <div className="form__actions">
            <Button type="submit" loading={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
