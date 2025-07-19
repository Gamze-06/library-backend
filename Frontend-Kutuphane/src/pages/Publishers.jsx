import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";

function Publishers() {
  const [publishers, setPublishers] = useState([
    { id: 1, name: "Can Yayınları" },
    { id: 2, name: "Yapı Kredi Yayınları" },
    { id: 3, name: "İş Bankası Kültür Yayınları" },
    { id: 4, name: "Doğan Kitap" },
    { id: 5, name: "Pegasus Yayınları" },
  ]);

  const [newPublisher, setNewPublisher] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [message, setMessage] = useState(null);

  // Bildirim mesajı otomatik gizlensin
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Ekle
  const handleAdd = () => {
    if (!newPublisher.trim()) {
      setMessage({ text: "Yayınevi adı boş bırakılamaz.", type: "danger" });
      return;
    }

    const isDuplicate = publishers.some(
      (p) => p.name.toLowerCase() === newPublisher.toLowerCase()
    );
    if (isDuplicate) {
      setMessage({ text: "Bu yayınevi zaten mevcut.", type: "danger" });
      return;
    }

    const newEntry = {
      id: publishers.length ? publishers[publishers.length - 1].id + 1 : 1,
      name: newPublisher,
    };

    setPublishers([...publishers, newEntry]);
    setNewPublisher("");
    setMessage({ text: "Yayınevi eklendi.", type: "success" });
  };

  // Sil
  const handleDelete = (id) => {
    setPublishers(publishers.filter((p) => p.id !== id));
    setMessage({ text: "Yayınevi silindi.", type: "success" });
  };

  // Düzenleme başlat
  const startEdit = (publisher) => {
    setEditId(publisher.id);
    setEditName(publisher.name);
  };

  // Kaydet
  const saveEdit = () => {
    if (!editName.trim()) {
      setMessage({ text: "Yayınevi adı boş bırakılamaz.", type: "danger" });
      return;
    }

    setPublishers(
      publishers.map((p) =>
        p.id === editId ? { ...p, name: editName } : p
      )
    );
    setEditId(null);
    setEditName("");
    setMessage({ text: "Yayınevi güncellendi.", type: "success" });
  };

  // İptal
  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
  };

  return (
    <div className="container mt-5">
      <h2>Yayımcılar</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "500px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Yayınevi Ekle</h5>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Yayınevi Adı"
            value={newPublisher}
            onChange={(e) => setNewPublisher(e.target.value)}
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
            <th>Yayınevi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>
                {editId === p.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {editId === p.id ? (
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
                    <button className="btn btn-warning btn-sm me-2" onClick={() => startEdit(p)}>
                      Düzenle
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>
                      Sil
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {publishers.length === 0 && (
            <tr>
              <td colSpan="3" className="text-center">
                Kayıtlı yayınevi yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Publishers;
