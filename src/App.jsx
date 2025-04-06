import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => (
    <>
        <HomePage />
        <ToastContainer
            position="bottom-right"
            autoClose={3000}
            theme="dark"
            />
    </>
);

export default App;
