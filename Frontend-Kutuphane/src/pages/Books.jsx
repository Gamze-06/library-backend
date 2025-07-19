import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";

const API_BASE_URL = "http://localhost:8080/api/v1/books";

function Books() {
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch(API_BASE_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Kitaplar yüklenemedi");
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch(() =>
        setMessage({ text: "Kitaplar yüklenirken hata oluştu.", type: "danger" })
      );
  };

  const handleAdd = () => {
    if (!newBookName.trim()) {
      setMessage({ text: "Kitap adı boş bırakılamaz.", type: "danger" });
      return;
    }

    fetch(API_BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBookName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kitap eklenemedi");
        return res.json();
      })
      .then((createdBook) => {
        setBooks([...books, createdBook]);
        setNewBookName("");
        setMessage({ text: "Kitap başarıyla eklendi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Kitap eklenirken hata oluştu.", type: "danger" })
      );
  };

  const handleDelete = (id) => {
    fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" })
      .then((res) => {
        if (!res.ok) throw new Error("Kitap silinemedi");
        setBooks(books.filter((b) => b.id !== id));
        setMessage({ text: "Kitap silindi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Kitap silinirken hata oluştu.", type: "danger" })
      );
  };

  const startEdit = (book) => {
    setEditId(book.id);
    setEditName(book.name);
  };

  const saveEdit = () => {
    if (!editName.trim()) {
      setMessage({ text: "Kitap adı boş bırakılamaz.", type: "danger" });
      return;
    }

    fetch(`${API_BASE_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Kitap güncellenemedi");
        return res.json();
      })
      .then((updatedBook) => {
        setBooks(books.map((b) => (b.id === editId ? updatedBook : b)));
        setEditId(null);
        setEditName("");
        setMessage({ text: "Kitap güncellendi.", type: "success" });
      })
      .catch(() =>
        setMessage({ text: "Kitap güncellenirken hata oluştu.", type: "danger" })
      );
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="container mt-5">
      <h2>Kitaplar</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "500px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Kitap Ekle</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Kitap Adı"
            value={newBookName}
            onChange={(e) => setNewBookName(e.target.value)}
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
            <th>Kitap Adı</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>
                {editId === b.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  b.name
                )}
              </td>
              <td>
                {editId === b.id ? (
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
                      onClick={() => startEdit(b)}
                    >
                      Düzenle
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(b.id)}
                    >
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {books.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                Kayıtlı kitap yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Books;
