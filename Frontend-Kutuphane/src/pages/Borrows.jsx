import React, { useState, useEffect } from "react";
import Notification from "../components/Notification";

function Borrows() {
  const users = [
    { id: 1, name: "Ali" },
    { id: 2, name: "Ayşe Güler" },
    { id: 3, name: "Mehmet Yılmaz" },
    { id: 4, name: "Fatma Kaya" },
    { id: 5, name: "Ahmet Çelik" },
  ];

  const books = [
    { id: 1, title: "Suç ve Ceza" },
    { id: 2, title: "1984" },
    { id: 3, title: "Sefiller" },
    { id: 4, title: "Körlük" },
    { id: 5, title: "Hobbit" },
  ];

  const [borrows, setBorrows] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleBorrow = () => {
    if (!selectedUser || !selectedBook) {
      setMessage({ text: "Lütfen kullanıcı ve kitap seçiniz.", type: "danger" });
      return;
    }

    const alreadyBorrowed = borrows.find(
      (b) => b.bookId === parseInt(selectedBook)
    );

    if (alreadyBorrowed) {
      setMessage({ text: "Bu kitap zaten ödünç alınmış.", type: "warning" });
      return;
    }

    const newBorrow = {
      id: borrows.length ? borrows[borrows.length - 1].id + 1 : 1,
      userId: parseInt(selectedUser),
      bookId: parseInt(selectedBook),
      date: new Date().toLocaleDateString(),
    };

    setBorrows([...borrows, newBorrow]);
    setSelectedUser("");
    setSelectedBook("");
    setMessage({ text: "Kitap başarıyla ödünç alındı.", type: "success" });
  };

  const handleReturn = (id) => {
    setBorrows(borrows.filter((b) => b.id !== id));
    setMessage({ text: "Kitap başarıyla iade edildi.", type: "success" });
  };

  const getUserName = (id) => users.find((u) => u.id === id)?.name || "";
  const getBookTitle = (id) => books.find((b) => b.id === id)?.title || "";

  return (
    <div className="container mt-5">
      <h2>Kitap Alma</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "600px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Kitap Ödünç Al</h5>
        <div className="row g-2">
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="">Kullanıcı Seç</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-6">
            <select
              className="form-select"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
            >
              <option value="">Kitap Seç</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button className="btn btn-primary mt-3" onClick={handleBorrow}>
          Ödünç Al
        </button>
      </div>

      <table className="table table-bordered" style={{ maxWidth: "700px" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kullanıcı</th>
            <th>Kitap</th>
            <th>Alış Tarihi</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {borrows.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center">
                Henüz ödünç alınan kitap yok.
              </td>
            </tr>
          )}
          {borrows.map((borrow) => (
            <tr key={borrow.id}>
              <td>{borrow.id}</td>
              <td>{getUserName(borrow.userId)}</td>
              <td>{getBookTitle(borrow.bookId)}</td>
              <td>{borrow.date}</td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleReturn(borrow.id)}
                >
                  İade Et
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Borrows;
