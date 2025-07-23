
// Importing React Router components and pages

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";            //Home component
import Publishers from "./pages/Publishers";// Publishers page
import Categories from "./pages/Categories";// Categories page
import Books from "./pages/Books";          // Books page
import Authors from "./pages/Authors";      // Authors page
import Borrows from "./pages/Borrows";      // Borrows page
import Navbar from "./components/Navbar";   // Navbar component


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
