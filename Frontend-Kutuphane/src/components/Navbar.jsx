import { Link, useLocation } from "react-router-dom";
import React from "react";

function Navbar() {
  const location = useLocation();

  // Small helper function to give custom class to active link
  const isActive = (path) => (location.pathname === path ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar navbar-expand-lg navbar-dark custom-navbar px-4">
      <Link className="navbar-brand custom-brand" to="/">Kütüphane</Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className={isActive("/")} to="/">Anasayfa</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive("/books")} to="/books">Kitaplar</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive("/publishers")} to="/publishers">Yayımcılar</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive("/categories")} to="/categories">Kategoriler</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive("/authors")} to="/authors">Yazarlar</Link>
          </li>
          <li className="nav-item">
            <Link className={isActive("/borrows")} to="/borrows">Kitap Alma</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
