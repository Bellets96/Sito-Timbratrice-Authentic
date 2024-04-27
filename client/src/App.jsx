import { BrowserRouter, Routes, Route } from "react-router-dom";

//Pages & Components
import Header from "./components/Header";
import Redirect from "./components/Redirect";
import Home from "./pages/Home";
import Profilo from "./pages/Profilo";
import Logout from "./pages/Logout";
import Timbrature from "./pages/Timbrature";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/redirect" element={<Redirect />} />
            <Route path="/user/profilo" element={<Profilo />} />
            <Route path="/user/logout" element={<Logout />} />
            <Route path="/user/admin/timbrature" element={<Timbrature />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
