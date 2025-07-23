import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";

const API_BASE_URL = "https://library-backend-qs9i.onrender.com/api/v1/books";

function Books() {
  // States such as book list, new book name, book ID and name to be edited
  const [books, setBooks] = useState([]);
  const [newBookName, setNewBookName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState(null);

  //Auto hide message 3 seconds after shown
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);
// Fetch books when page loads
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setBooks(response.data);
    } catch (error) {
      console.error("Kitapları çekerken hata:", error);
      setMessage({ text: "Kitaplar yüklenirken hata oluştu.", type: "danger" });
    }
  };

  const handleAdd = async () => {
    if (!newBookName.trim()) {
      setMessage({ text: "Kitap adı boş bırakılamaz.", type: "danger" });
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, { name: newBookName });
      setBooks([...books, response.data]);
      setNewBookName("");
      setMessage({ text: "Kitap başarıyla eklendi.", type: "success" });
    } catch (error) {
      console.error("Kitap eklenirken hata:", error);
      setMessage({ text: "Kitap eklenirken hata oluştu.", type: "danger" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setBooks(books.filter((b) => b.id !== id));
      setMessage({ text: "Kitap silindi.", type: "success" });
    } catch (error) {
      console.error("Kitap silinirken hata:", error);
      setMessage({ text: "Kitap silinirken hata oluştu.", type: "danger" });
    }
  };

  // Information about the selected book is taken to switch to edit mode

  const startEdit = (book) => {
    setEditId(book.id);
    setEditName(book.name);
  };

  // Book update process
  const saveEdit = async () => {
    if (!editName.trim()) {
      setMessage({ text: "Kitap adı boş bırakılamaz.", type: "danger" });
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/${editId}`, {
        name: editName,
      });

      // The updated book is reflected in the list
      setBooks(books.map((b) => (b.id === editId ? response.data : b)));
      setEditId(null);
      setEditName("");
      setMessage({ text: "Kitap güncellendi.", type: "success" });
    } catch (error) {
      console.error("Kitap güncellenirken hata:", error);
      setMessage({ text: "Kitap güncellenirken hata oluştu.", type: "danger" });
    }
  };

  // Editing operation is canceled
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
