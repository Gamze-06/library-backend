import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";

function Categories() {
  const [categories, setCategories] = useState([
    { id: 1, name: "Roman" },
    { id: 2, name: "Bilim Kurgu" },
    { id: 3, name: "Fantastik" },
    { id: 4, name: "Kişisel Gelişim" },
    { id: 5, name: "Tarih" },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState(null);

  // Bildirim mesajını otomatik gizle
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Ekleme
  const handleAdd = () => {
    if (!newCategory.trim()) {
      setMessage({ text: "Kategori adı boş olamaz.", type: "danger" });
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === newCategory.toLowerCase()
    );
    if (isDuplicate) {
      setMessage({ text: "Bu kategori zaten mevcut.", type: "danger" });
      return;
    }

    const newEntry = {
      id: categories.length ? categories[categories.length - 1].id + 1 : 1,
      name: newCategory,
    };

    setCategories([...categories, newEntry]);
    setNewCategory("");
    setMessage({ text: "Kategori eklendi.", type: "success" });
  };

  // Silme
  const handleDelete = (id) => {
    setCategories(categories.filter((c) => c.id !== id));
    setMessage({ text: "Kategori silindi.", type: "success" });
  };

  // Düzenleme başlat
  const startEdit = (category) => {
    setEditId(category.id);
    setEditName(category.name);
  };

  // Kaydet
  const saveEdit = () => {
    if (!editName.trim()) {
      setMessage({ text: "Kategori adı boş olamaz.", type: "danger" });
      return;
    }

    setCategories(
      categories.map((cat) =>
        cat.id === editId ? { ...cat, name: editName } : cat
      )
    );
    setEditId(null);
    setEditName("");
    setMessage({ text: "Kategori güncellendi.", type: "success" });
  };

  // İptal
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="container mt-5">
      <h2>Kategoriler</h2>

      {/* Bildirim */}
      {message && <Notification message={message.text} type={message.type} />}

      {/* Ekleme Alanı */}
      <div
        className="mb-4"
        style={{ maxWidth: "500px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Kategori Ekle</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Kategori Adı"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Ekle
          </button>
        </div>
      </div>

      {/* Liste */}
      <table className="table table-bordered" style={{ maxWidth: "600px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kategori</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editId === cat.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editId === cat.id ? (
                  <>
                    <button className="btn btn-success btn-sm me-2" onClick={saveEdit}>
                      Kaydet
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>
                      İptal
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(cat)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id)}>
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                Kategori bulunamadı.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
