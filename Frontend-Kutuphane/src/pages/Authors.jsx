import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";

const API_BASE_URL = "https://library-backend-qs9i.onrender.com/api/v1/authors";

function Authors() {
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState(null);

  // Mesajlar için 3 saniye sonra temizleme
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Component mount olunca yazarları çek
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Backend'den yazarları getir
  const fetchAuthors = () => {
    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Veri çekilemedi");
        return res.json();
      })
      .then((data) => setAuthors(data))
      .catch((error) =>
        setMessage({ text: "Yazarlar yüklenirken hata oluştu.", type: "danger" })
      );
  };

  // Yeni yazar ekle
  const handleAdd = () => {
    if (!newAuthor.trim()) {
      setMessage({ text: "Yazar adı boş bırakılamaz.", type: "danger" });
      return;
    }

    // Backend'e POST isteği
    fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newAuthor }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Ekleme başarısız");
        return res.json();
      })
      .then((createdAuthor) => {
        setAuthors([...authors, createdAuthor]);
        setNewAuthor("");
        setMessage({ text: "Yazar başarıyla eklendi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Yazar eklenirken hata oluştu.", type: "danger" })
      );
  };

  // Yazar sil
  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Silme başarısız");
        // Silme başarılıysa listeden çıkar
        setAuthors(authors.filter((a) => a.id !== id));
        setMessage({ text: "Yazar silindi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Yazar silinirken hata oluştu.", type: "danger" })
      );
  };

  // Düzenleme başlat
  const startEdit = (author) => {
    setEditId(author.id);
    setEditName(author.name);
  };

  // Düzenlemeyi kaydet
  const saveEdit = () => {
    if (!editName.trim()) {
      setMessage({ text: "Yazar adı boş bırakılamaz.", type: "danger" });
      return;
    }

    fetch(`${API_BASE_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Güncelleme başarısız");
        return res.json();
      })
      .then((updatedAuthor) => {
        setAuthors(
          authors.map((a) => (a.id === editId ? updatedAuthor : a))
        );
        setEditId(null);
        setEditName("");
        setMessage({ text: "Yazar güncellendi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Yazar güncellenirken hata oluştu.", type: "danger" })
      );
  };

  // Düzenlemeyi iptal et
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="container mt-5">
      <h2>Yazarlar</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "500px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Yazar Ekle</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Yazar Adı"
            value={newAuthor}
            onChange={(e) => setNewAuthor(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Ekle
          </button>
        </div>
      </div>

      <table className="table table-bordered" style={{ maxWidth: "600px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Yazar</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>
                {editId === a.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  a.name
                )}
              </td>
              <td>
                {editId === a.id ? (
                  <>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={saveEdit}
                    >
                      Kaydet
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={cancelEdit}
                    >
                      İptal
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => startEdit(a)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(a.id)}
                    >
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {authors.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                Kayıtlı yazar yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Authors;
