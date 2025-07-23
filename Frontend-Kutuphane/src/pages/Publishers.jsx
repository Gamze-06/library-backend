import React, { useState, useEffect } from "react";
import axios from "axios";
import Notification from "../components/Notification";

const API_BASE_URL = "https://library-backend-qs9i.onrender.com/api/v1/publishers";

function Publishers() {
  // State definitions
  const [publishers, setPublishers] = useState([]);
  const [newPublisher, setNewPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  }); // State for the new publisher addition form
  const [editId, setEditId] = useState(null);
  const [editPublisher, setEditPublisher] = useState({
    name: "",
    establishmentYear: "",
    address: "",
  });
  const [message, setMessage] = useState(null); // Information message (success/danger)

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchPublishers();
  }, []);

  const fetchPublishers = async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      setPublishers(response.data);
    } catch (error) {
      setMessage({ text: "Yayınevleri yüklenemedi.", type: "danger" });
    }
  };

  const handleAdd = async () => {
    const { name, establishmentYear, address } = newPublisher;
    if (!name || !establishmentYear || !address) {
      setMessage({ text: "Tüm alanlar zorunludur.", type: "danger" });
      return;
    }

    try {
      const response = await axios.post(API_BASE_URL, {
        name,
        establishmentYear,
        address,
      });
      setPublishers([...publishers, response.data]);
      setNewPublisher({ name: "", establishmentYear: "", address: "" });
      setMessage({ text: "Yayınevi başarıyla eklendi.", type: "success" });
    } catch (error) {
      setMessage({ text: "Yayınevi eklenirken hata oluştu.", type: "danger" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/${id}`);
      setPublishers(publishers.filter((p) => p.id !== id));
      setMessage({ text: "Yayınevi silindi.", type: "success" });
    } catch (error) {
      setMessage({ text: "Yayınevi silinirken hata oluştu.", type: "danger" });
    }
  };

  const startEdit = (publisher) => {
    setEditId(publisher.id);
    setEditPublisher({
      name: publisher.name,
      establishmentYear: publisher.establishmentYear,
      address: publisher.address,
    });
  };

  const saveEdit = async () => {
    const { name, establishmentYear, address } = editPublisher;
    if (!name || !establishmentYear || !address) {
      setMessage({ text: "Tüm alanlar zorunludur.", type: "danger" });
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/${editId}`, {
        name,
        establishmentYear,
        address,
      });
      setPublishers(
        publishers.map((p) => (p.id === editId ? response.data : p))
      );
      setEditId(null);
      setEditPublisher({ name: "", establishmentYear: "", address: "" });
      setMessage({ text: "Yayınevi güncellendi.", type: "success" });
    } catch (error) {
      setMessage({ text: "Yayınevi güncellenirken hata oluştu.", type: "danger" });
    }
  };

  //Cancel update operation
  
  const cancelEdit = () => {
    setEditId(null);
    setEditPublisher({ name: "", establishmentYear: "", address: "" });
  };

  return (
    <div className="container mt-5">
      <h2>Yayınevleri</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div className="mb-4" style={{ maxWidth: "600px", border: "1px solid #ddd", padding: "15px" }}>
        <h5>Yeni Yayınevi Ekle</h5>
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Ad"
          value={newPublisher.name}
          onChange={(e) => setNewPublisher({ ...newPublisher, name: e.target.value })}
        />
        <input
          type="number"
          className="form-control mb-2"
          placeholder="Kuruluş Yılı"
          value={newPublisher.establishmentYear}
          onChange={(e) => setNewPublisher({ ...newPublisher, establishmentYear: e.target.value })}
        />
        <input
          type="text"
          className="form-control mb-2"
          placeholder="Adres"
          value={newPublisher.address}
          onChange={(e) => setNewPublisher({ ...newPublisher, address: e.target.value })}
        />
        <button className="btn btn-primary" onClick={handleAdd}>
          Ekle
        </button>
      </div>

      <table className="table table-bordered" style={{ maxWidth: "700px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Ad</th>
            <th>Kuruluş</th>
            <th>Adres</th>
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
                    value={editPublisher.name}
                    onChange={(e) =>
                      setEditPublisher({ ...editPublisher, name: e.target.value })
                    }
                  />
                ) : (
                  p.name
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <input
                    type="number"
                    className="form-control"
                    value={editPublisher.establishmentYear}
                    onChange={(e) =>
                      setEditPublisher({ ...editPublisher, establishmentYear: e.target.value })
                    }
                  />
                ) : (
                  p.establishmentYear
                )}
              </td>
              <td>
                {editId === p.id ? (
                  <input
                    type="text"
                    className="form-control"
                    value={editPublisher.address}
                    onChange={(e) =>
                      setEditPublisher({ ...editPublisher, address: e.target.value })
                    }
                  />
                ) : (
                  p.address
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
              <td colSpan="5" className="text-center">
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
