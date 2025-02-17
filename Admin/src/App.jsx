import Navbar from "./components/Navbar/Navbar";
import SideBar from "./components/Sidebar/SideBar";
import { Route, Routes } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import { Toaster } from "react-hot-toast";
import { url } from "./assets/assets";
import Update from "./pages/Update/Update";
import Statistical from "./pages/Statistical/Statistical";

const App = () => {
  return (
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <SideBar />
        <Routes>
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/orders" element={<Orders url={url} />} />
          <Route path="/statistical" element={<Statistical url={url} />} />
          <Route path="/update/:id" element={<Update url={url} />} />
        </Routes>
      </div>
      <Toaster />
    </div>
  );
};

export default App;
