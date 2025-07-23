import React, { useEffect, useState } from "react";
import axios from "axios";
import Notification from "../components/Notification";

const BORROW_API = "https://library-backend-qs9i.onrender.com/api/v1/borrows";
const BOOKS_API = "https://library-backend-qs9i.onrender.com/api/v1/books";

function Borrows() {
  // States that keep borrowing records and book lists
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  // State that holds the form data (borrower information and selected book)
  const [form, setForm] = useState({
    borrowerName: "",
    borrowerMail: "",
    bookId: "",
  });
  // Message informing the user (success, error)
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchBorrows();
    fetchBooks();
  }, []);

  // Automatically clears the message after 3 seconds whenever 'message' changes
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetches borrow data from the API and updates the state
  const fetchBorrows = async () => {
    try {
      const res = await axios.get(BORROW_API);
      setBorrows(res.data);
    } catch (error) {
      console.error("Borçlar yüklenemedi:", error);
      setMessage({ text: "Borçlar yüklenirken hata oluştu.", type: "danger" });
    }
  };

  // Fetches book data from the API and updates the state
  const fetchBooks = async () => {
    try {
      const res = await axios.get(BOOKS_API);
      setBooks(res.data);
    } catch (error) {
      console.error("Kitaplar yüklenemedi:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBorrow = async () => {
    const { borrowerName, borrowerMail, bookId } = form;
    if (!borrowerName || !borrowerMail || !bookId) {
      setMessage({ text: "Tüm alanlar zorunludur.", type: "danger" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    try {
      const res = await axios.post(BORROW_API, {
        borrowerName,
        borrowerMail,
        borrowingDate: today,
        bookForBorrowingRequest: {
          id: parseInt(bookId),
        },
      });
      setBorrows([...borrows, res.data]);
      setForm({ borrowerName: "", borrowerMail: "", bookId: "" });
      setMessage({ text: "Kitap başarıyla ödünç alındı.", type: "success" });
    } catch (error) {
      console.error("Ödünç alma hatası:", error);
      setMessage({
        text: error.response?.data?.message || "Ödünç alma işlemi başarısız oldu.",
        type: "danger",
      });
    }
  };

  const handleReturn = async (borrow) => {
    try {
      const today = new Date().toISOString().split("T")[0];

      const res = await axios.put(`${BORROW_API}/${borrow.id}`, {
        borrowerName: borrow.borrowerName,
        borrowingDate: borrow.borrowingDate,
        returnDate: today,
      });

      setBorrows(borrows.map((b) => (b.id === borrow.id ? res.data : b)));
      setMessage({ text: "Kitap iade edildi.", type: "success" });
    } catch (error) {
      console.error("İade işlemi hatası:", error);
      setMessage({
        text: error.response?.data?.message || "Kitap iade edilirken hata oluştu.",
        type: "danger",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Ödünç Alınan Kitaplar</h2>

      {message && <Notification message={message.text} type={message.type} />}

      <div
        className="mb-4"
        style={{ maxWidth: "600px", border: "1px solid #ddd", padding: "15px" }}
      >
        <h5>Yeni Ödünç Alma</h5>
        <div className="d-flex flex-column gap-2">
          <input
            type="text"
            name="borrowerName"
            placeholder="Ödünç Alan Adı"
            className="form-control"
            value={form.borrowerName}
            onChange={handleChange}
          />
          <input
            type="email"
            name="borrowerMail"
            placeholder="Mail Adresi"
            className="form-control"
            value={form.borrowerMail}
            onChange={handleChange}
          />
          <select
            name="bookId"
            className="form-select"
            value={form.bookId}
            onChange={handleChange}
          >
            <option value="">Kitap Seçin</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
                {book.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary mt-2" onClick={handleBorrow}>
            Ödünç Al
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Mail</th>
            <th>Kitap</th>
            <th>Alım Tarihi</th>
            <th>İade Tarihi</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map((b) => (
            <tr key={b.id}>
              <td>{b.borrowerName}</td>
              <td>{b.borrowerMail}</td>
              <td>{b.book?.name}</td>
              <td>{b.borrowingDate}</td>
              <td>{b.returnDate || "-"}</td>
              <td>
                {!b.returnDate && (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleReturn(b)}
                  >
                    İade Et
                  </button>
                )}
              </td>
            </tr>
          ))}
          {borrows.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                Ödünç alınan kitap bulunmuyor.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Borrows;
