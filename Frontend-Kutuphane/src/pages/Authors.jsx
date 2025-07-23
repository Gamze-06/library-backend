import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";

const API_BASE_URL = "https://library-backend-qs9i.onrender.com/api/v1/authors";

function Authors() {
  // States are defined to manage authors and forms
  const [authors, setAuthors] = useState([]);
  const [newAuthor, setNewAuthor] = useState({ name: "", birthDate: "", country: "" });
  const [editId, setEditId] = useState(null);
  const [editAuthor, setEditAuthor] = useState({ name: "", birthDate: "", country: "" });
  const [message, setMessage] = useState(null);


  // Pull authors when the component is loaded
  useEffect(() => {
    fetchAuthors();
  }, []);
//Automatically remove notification message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  
// Fetch author data from API
  const fetchAuthors = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setAuthors(response.data);
    } catch (error) {
      console.error("Yazarlar yüklenemedi:", error);
      setMessage({ text: "Yazarlar yüklenemedi.", type: "danger" });
    }
  };

  const handleAdd = async () => {
    if (!newAuthor.name || !newAuthor.birthDate || !newAuthor.country) {
      setMessage({ text: "Tüm alanlar doldurulmalıdır.", type: "danger" });
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, newAuthor);
      setAuthors([...authors, response.data]);
      setNewAuthor({ name: "", birthDate: "", country: "" });
      setMessage({ text: "Yazar başarıyla eklendi.", type: "success" });
    } catch (error) {
      console.error("Yazar eklenemedi:", error);
      setMessage({ text: "Yazar eklenirken hata oluştu.", type: "danger" });
    }
  };

  // Delete the specified author

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setAuthors(authors.filter((a) => a.id !== id));
      setMessage({ text: "Yazar silindi.", type: "success" });
    } catch (error) {
      setMessage({ text: "Yazar silinirken hata oluştu.", type: "danger" });
    }
  };

  // Fill out the form for the update process
  const startEdit = (author) => {
    setEditId(author.id);
    setEditAuthor({
      name: author.name,
      birthDate: author.birthDate,
      country: author.country,
    });
  };

  const saveEdit = async () => {
    if (!editAuthor.name || !editAuthor.birthDate || !editAuthor.country) {
      setMessage({ text: "Tüm alanlar doldurulmalıdır.", type: "danger" });
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/${editId}`, editAuthor);
      setAuthors(authors.map((a) => (a.id === editId ? response.data : a)));
      setEditId(null);
      setEditAuthor({ name: "", birthDate: "", country: "" });
      setMessage({ text: "Yazar güncellendi.", type: "success" });
    } catch (error) {
      console.error("Yazar güncellenemedi:", error);
      setMessage({ text: "Yazar güncellenirken hata oluştu.", type: "danger" });
    }
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditAuthor({ name: "", birthDate: "", country: "" });
  };

  return (
    <div className="container mt-5">
      <h2>Yazarlar</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "600px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Yazar Ekle</h5>
        <div className="d-flex gap-2 flex-wrap">
          <input
            type="text"
            className="form-control"
            placeholder="Ad Soyad"
            value={newAuthor.name}
            onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
          />
          <input
            type="date"
            className="form-control"
            value={newAuthor.birthDate}
            onChange={(e) => setNewAuthor({ ...newAuthor, birthDate: e.target.value })}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Ülke"
            value={newAuthor.country}
            onChange={(e) => setNewAuthor({ ...newAuthor, country: e.target.value })}
          />
          <button className="btn btn-primary" onClick={handleAdd}>
            Ekle
          </button>
        </div>
      </div>

      <table className="table table-bordered" style={{ maxWidth: "800px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad Soyad</th>
            <th>Doğum Tarihi</th>
            <th>Ülke</th>
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
                    value={editAuthor.name}
                    onChange={(e) =>
                      setEditAuthor({ ...editAuthor, name: e.target.value })
                    }
                  />
                ) : (
                  a.name
                )}
              </td>
              <td>
                {editId === a.id ? (
                  <input
                    type="date"
                    className="form-control"
                    value={editAuthor.birthDate}
                    onChange={(e) =>
                      setEditAuthor({ ...editAuthor, birthDate: e.target.value })
                    }
                  />
                ) : (
                  a.birthDate
                )}
              </td>
              <td>
                {editId === a.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editAuthor.country}
                    onChange={(e) =>
                      setEditAuthor({ ...editAuthor, country: e.target.value })
                    }
                  />
                ) : (
                  a.country
                )}
              </td>
              <td>
                {editId === a.id ? (
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
              <td colSpan="5" className="text-center">
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
