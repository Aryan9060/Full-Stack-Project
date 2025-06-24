import Container from "../container/Container";
import { Input } from "../input/Input";
import Button from "../button/Button";
import { useNavigate } from "react-router";
import notifyError from "../../utils/notifyError";
import axios from "axios";
import { baseURL } from "../../utils/api";
import notifySuccess from "../../utils/notifySuccess";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/UserSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [inputData, setInputData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const inputHandler = (e) => {
    setInputData({ ...inputData, [e.target.name]: e.target.value });
  };

  // const fetchUserData = async () => {
  //   axios.defaults.withCredentials = true;
  //   await axios
  //     .post(`${baseURL}/api/v1/users/refresh-token`)
  //     .then((res) => {
  //       const data = res.data.data.user;
  //       setUser(data);
  //       notifySuccess(res.data.message);
  //       dispatch(setUserData({ data, isAuthenticated: true }));
  //     })
  //     .catch((error) => notifyError(error.response.data.message));
  // };

  // useMemo(() => {
  //   fetchUserData();
  // }, []);

  const loginHandler = () => {
    if (inputData.username?.length > 0 && inputData.username.includes("@"))
      setInputData({ ...inputData, email: inputData.username });
    else setInputData({ ...inputData, email: "" });
    for (let key in inputData) {
      if (key === "username" && inputData[key].length === 0) {
        notifyError("Username is required!");
        return;
      } else if (key === "password" && inputData[key].length === 0) {
        notifyError("Password is required!");
        return;
      }

      if (key === "password" && inputData[key].length <= 4) {
        notifyError("Password should be at least 5 characters long!");
        return;
      }
    }

    //login user
    axios.defaults.withCredentials = true;
    axios
      .post(`${baseURL}/api/v1/users/login`, inputData)
      .then((res) => {
        setInputData({
          username: "",
          password: "",
          email: "",
        });
        notifySuccess(res.data.message);
        dispatch(setUserData(res.data.data.user))
        navigate("/");
      })
      .catch((error) => {
        console.log("error ->", error);
        notifyError(error?.response?.data?.message || "Failed to login user");
      });
  };

  return (
    <Container
      className={`bg-white max-w-[500px] w-[90vw] sm:w-full rounded-2xl flex justify-center items-center flex-col shadow-xl m-auto`}
    >
      <h1 className="text-3xl font-bold text-center mt-3 text-orange-600 cursor-default">
        Login
      </h1>
      <div className="w-full">
        <Input
          required
          type={`text`}
          label={`Username :`}
          name="username"
          value={inputData.username}
          onChange={(e) => inputHandler(e)}
          placeholder="Enter your username/email"
          className=" w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
        />
        <Input
          required
          type={`password`}
          label={`Password :`}
          name="password"
          value={inputData.password}
          onChange={(e) => inputHandler(e)}
          placeholder="Enter your password"
          className="w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
        />
      </div>
      <div className=" m-5 text-white font-semibold text-[1.5rem]">
        <Button
          children="Login"
          type="submit"
          onClick={() => loginHandler()}
          className="bg-orange-600 w-[200px] max-w-[15rem] hover:bg-orange-500 cursor-pointer"
        />
      </div>
      <p className="mb-5">
        Don't have account{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-600 underline font-bold hover:text-blue-700 cursor-pointer"
        >
          register.
        </span>
      </p>
    </Container>
  );
};

export default Login;
