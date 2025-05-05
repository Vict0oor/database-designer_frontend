import HomePage from "./pages/HomePage";
import PlSqlPage from "./pages/PlSqlPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => (
    <Router>
        <Routes>
            <Route path="/home" element={<HomePage />} />
            <Route path="/plsql" element={<PlSqlPage />} />
            <Route path="*" element={<HomePage />} />
        </Routes>

        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
        />
    </Router>
);

export default App;
