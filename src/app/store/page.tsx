'use client';

import React, { useState } from 'react';
import { Modal, FormField, ButtonGroup } from '@/components/ui/Modal';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  active: boolean;
};

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Services' });

  const filteredProducts = filterCategory === 'ALL' ? products : products.filter(p => p.category === filterCategory);
  const categories = ['ALL', ...new Set(products.map(p => p.category))];

  const handleAdd = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      ...form,
      price: parseFloat(form.price) || 0,
      active: true,
    };
    setProducts([...products, newProduct]);
    setShowModal(false);
    setForm({ name: '', description: '', price: '', category: 'Services' });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({ name: product.name, description: product.description, price: product.price.toString(), category: product.category });
    setShowEditModal(true);
  };

  const handleUpdate = () => {
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...form, price: parseFloat(form.price) || 0 } : p));
    setShowEditModal(false);
    setEditingProduct(null);
  };

  const handleToggleActive = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Store</h1>
        <button onClick={() => setShowModal(true)} className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">+ Add Product</button>
      </div>

      <p className="text-gray-400 mb-6">Manage your services and rental offerings for clients.</p>

      {categories.length > 1 && (
        <div className="flex gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCategory(cat)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${filterCategory === cat ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      )}

      {filteredProducts.length === 0 ? (
        <div className="bg-surface rounded-lg shadow p-12 text-center text-gray-400">
          <p className="text-lg">No products yet</p>
          <p className="text-sm mt-2">Add services or rentals to your store.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-surface rounded-lg shadow p-6 hover:border hover:border-primary transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white">{product.name}</h3>
                  <span className="text-xs font-medium text-gray-400 bg-gray-700 px-2 py-1 rounded-full">{product.category}</span>
                </div>
                <span className="text-2xl font-bold text-accent">${product.price.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <button onClick={() => handleToggleActive(product.id)} className={`text-sm font-medium ${product.active ? 'text-green-400 hover:text-green-300' : 'text-danger hover:text-red-400'}`}>
                  {product.active ? 'Active' : 'Inactive'} • Click to toggle
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(product)} className="text-primary hover:text-primary-light text-sm">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="text-danger hover:text-red-400 text-sm">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Product">
        <FormField label="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="e.g., Brand Video Package" required />
        <FormField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Brief description" as="textarea" />
        <FormField label="Price ($)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="5000" required />
        <FormField label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} as="select" options={[
          { value: 'Services', label: 'Services' },
          { value: 'Rentals', label: 'Rentals' },
          { value: 'Products', label: 'Products' },
        ]} />
        <ButtonGroup onCancel={() => setShowModal(false)} onSubmit={handleAdd} />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        <FormField label="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        <FormField label="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} as="textarea" />
        <FormField label="Price ($)" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        <FormField label="Category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} as="select" options={[
          { value: 'Services', label: 'Services' },
          { value: 'Rentals', label: 'Rentals' },
          { value: 'Products', label: 'Products' },
        ]} />
        <ButtonGroup onCancel={() => setShowEditModal(false)} onSubmit={handleUpdate} submitLabel="Update" />
      </Modal>
    </div>
  );
}