import { Route, Routes } from "react-router";
import Container from "./components/container/Container";
import Login from "./components/pages/Login";
import Registation from "./components/pages/Registation";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import Home from "./components/pages/Home";
import Layout from "./components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "./utils/api";
import { setUserData } from "./redux/UserSlice";
import notifySuccess from "./utils/notifySuccess";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      axios.defaults.withCredentials = true;
      await axios
        .post(`${baseURL}/api/v1/users/refresh-token`)
        .then((res) => {
          dispatch(setUserData(res.data.data.user));
          notifySuccess(res.data.message);
        })
        .finally(() => setLoading(false));
    })();
  }, []);

  return !loading ? (
    <>
      <Container className={`min-h-screen min-w-screen flex `}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registation />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
      />
    </>
  ) : (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-10 h-10 border-3 border-orange-600 rounded-full animate-spin border-t-transparent"></div>
    </div>
  );
}

export default App;
