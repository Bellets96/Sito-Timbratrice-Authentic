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
            <Route path="/bollatrice" element={<Home />} />
            <Route path="/bollatrice/redirect" element={<Redirect />} />
            <Route path="/bollatrice/user/profilo" element={<Profilo />} />
            <Route path="/bollatrice/user/logout" element={<Logout />} />
            <Route
              path="/bollatrice/user/admin/timbrature"
              element={<Timbrature />}
            />
            <Route path="/bollatrice/*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
