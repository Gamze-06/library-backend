import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Publishers from "./pages/Publishers";
import Categories from "./pages/Categories";
import Books from "./pages/Books";
import Authors from "./pages/Authors";
import Borrows from "./pages/Borrows";
import Navbar from "./components/Navbar";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/publishers" element={<Publishers />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/books" element={<Books />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/borrows" element={<Borrows />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
