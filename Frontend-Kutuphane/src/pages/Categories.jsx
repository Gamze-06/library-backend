import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";

const API_BASE_URL = "https://library-backend-qs9i.onrender.com/api/v1/categories";

export default function Categories() {
  // State that holds all categories
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [editId, setEditId] = useState(null);
  const [editCategory, setEditCategory] = useState({ name: "", description: "" });
  const [message, setMessage] = useState(null);
  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      const { data } = await axios.get(API_BASE_URL);
      setCategories(data);
    } catch (err) {
      console.error("Fetch categories failed:", err.response || err);
      setMessage({ text: "Kategoriler yüklenemedi.", type: "danger" });
    }
  }

  async function handleAdd() {
    const name = newCategory.name.trim();
    const description = newCategory.description.trim();

    if (!name || !description) {
      setMessage({ text: "Kategori adı ve açıklama boş bırakılamaz.", type: "danger" });
      return;
    }

    try {
      const { data } = await axios.post(API_BASE_URL, { name, description });
      setCategories([...categories, data]);
      setNewCategory({ name: "", description: "" });
      setMessage({ text: "Kategori eklendi.", type: "success" });
    } catch (err) {
      const errorText = err.response?.data?.message || "Kategori eklenirken hata oluştu.";
      console.error("Add category failed:", err.response || err);
      setMessage({ text: errorText, type: "danger" });
    }
  }

  // Category deletion
  async function handleDelete(id) {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setCategories(categories.filter(c => c.id !== id));
      setMessage({ text: "Kategori silindi.", type: "success" });
    } catch (err) {
      const errorText = err.response?.data?.message || "Kategori silinirken hata oluştu.";
      console.error("Delete category failed:", err.response || err);
      setMessage({ text: errorText, type: "danger" });
    }
  }

  // Start editing a category
  function startEdit(cat) {
    setEditId(cat.id);
    setEditCategory({ name: cat.name, description: cat.description });
  }

  async function saveEdit() {
    const name = editCategory.name.trim();
    const description = editCategory.description.trim();

    if (!name || !description) {
      setMessage({ text: "Kategori adı ve açıklama boş bırakılamaz.", type: "danger" });
      return;
    }

    try {
      const { data } = await axios.put(`${API_BASE_URL}/${editId}`, { name, description });
      setCategories(categories.map(c => c.id === editId ? data : c));
      cancelEdit();
      setMessage({ text: "Kategori güncellendi.", type: "success" });
    } catch (err) {
      const errorText = err.response?.data?.message || "Kategori güncellenirken hata oluştu.";
      console.error("Update category failed:", err.response || err);
      setMessage({ text: errorText, type: "danger" });
    }
  }
  // Cancel editing
  function cancelEdit() {
    setEditId(null);
    setEditCategory({ name: "", description: "" });
  }

  return (
    <div className="container mt-5">
      <h2>Kategoriler</h2>
      {message && <Notification message={message.text} type={message.type} />}

      {/* Yeni Kategori Formu */}
      <div className="mb-4" style={{ maxWidth: "600px", border: "1px solid #ddd", padding: "15px" }}>
        <h5>Yeni Kategori Ekle</h5>
        <div className="d-flex flex-column gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Kategori Adı"
            value={newCategory.name}
            onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
          />
          <textarea
            className="form-control"
            placeholder="Açıklama"
            value={newCategory.description}
            onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAdd}>Ekle</button>
        </div>
      </div>

      {/* Kategoriler Tablosu */}
      <table className="table table-bordered" style={{ maxWidth: "700px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kategori Adı</th>
            <th>Açıklama</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center">Kayıtlı kategori yok.</td>
            </tr>
          )}
          {categories.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>
                {editId === c.id ? (
                  <input
                    className="form-control"
                    value={editCategory.name}
                    onChange={e => setEditCategory({ ...editCategory, name: e.target.value })}
                  />
                ) : c.name}
              </td>
              <td>
                {editId === c.id ? (
                  <textarea
                    className="form-control"
                    value={editCategory.description}
                    onChange={e => setEditCategory({ ...editCategory, description: e.target.value })}
                  />
                ) : c.description}
              </td>
              <td>
                {editId === c.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>Kaydet</button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>İptal</button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(c)}>Düzenle</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>Sil</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
