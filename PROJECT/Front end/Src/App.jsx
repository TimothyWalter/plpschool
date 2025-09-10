
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ReportIssue from "./pages/ReportIssue";
import PageWrapper from "./components/PageWrapper";

// Placeholder pages
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
        <Route path="/orders" element={<PageWrapper><Orders /></PageWrapper>} />
        <Route path="/report" element={<PageWrapper><ReportIssue /></PageWrapper>} />
      </Routes>
    </Router>
  );
}

export default App;
