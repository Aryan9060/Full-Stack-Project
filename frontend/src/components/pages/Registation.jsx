import Container from "../container/Container";
import { Input } from "../input/Input";
import Button from "../button/Button";
import avatar from "../../img/avatar.jpg";
import { FaPlus } from "../Icon";
import { useState } from "react";
import notifyError from "../../utils/notifyError";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";

const Registation = (e) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: "",
  });

  const formInfutHandler = (e) => {
    if (e.target.type === "file") {
      setForm({ ...form, avatar: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const formSubmitHandler = async (e) => {
    for (let field in form) {
      console.log(form[field].length);

      if (field === "password" && form[field].length <= 4) {
        notifyError("Password in between 5 and 20 characters!");
        return;
      } else if (!form[field]) {
        notifyError(`${field} is required!!`);
        return;
      }
    }

    // e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", form.avatar);
    formData.append("fullName", form.fullName);
    formData.append("username", form.username);
    formData.append("email", form.email);
    formData.append("password", form.password);

    const res = await axios
      .post("/api/v1/users/register", formData)
      .then((res) => {
        console.log(res.data);
        notifySuccess("User registered successfully");
      })
      .catch((error) => {
        console.error(error);
        notifyError(error.response.data.message || "Failed to register user");
      });
    console.log(res);

    // clear form
    setForm({
      fullName: "",
      username: "",
      email: "",
      password: "",
      avatar: "",
    });
  };
  // console.log("form :- ", form);

  return (
    <Container
      className={` max-w-[500px] w-[90vw] sm:w-full rounded flex justify-center items-center flex-col shadow-2xl`}
    >
      <div className="text-3xl font-bold text-center mt-3 text-orange-600 cursor-default">
        Registation
      </div>

      <div className="relative p-2">
        <img
          src={form.avatar ? URL.createObjectURL(form.avatar) : avatar}
          alt="avatar"
          className="h-[5rem] w-[5rem] rounded-full border-orange-600 border-3 "
        />
        <label htmlFor="avatar">
          <FaPlus className=" text-black absolute right-2 bottom-2 size-[1.5rem] rounded-full bg-orange-600 p-1 cursor-pointer" />
        </label>
        {/* take input image file */}

        <input
          type="file"
          id="avatar"
          accept="image/*"
          required
          onChange={(e) => formInfutHandler(e)}
          className="hidden"
        />
      </div>

      <div className="w-full">
        <Input
          label="Full Name :"
          className=" w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
          value={form.fullName}
          required
          name="fullName"
          onChange={(e) => formInfutHandler(e)}
          placeholder="Enter your fullname"
        />
        <Input
          label="Username :"
          className=" w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
          value={form.username}
          required={true}
          name="username"
          onChange={(e) => formInfutHandler(e)}
          placeholder="Enter your username"
        />
        <Input
          type="email"
          label="Email :"
          className=" w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
          value={form.email}
          required={true}
          name="email"
          onChange={(e) => formInfutHandler(e)}
          placeholder="Enter your email"
        />
        <Input
          type="password"
          label="Password :"
          className=" w-full mt-1 sm:w-6/8
           focus-within:ring-orange-600 focus-within:ring-1 border-0 ring-1 outline-none"
          value={form.password}
          required={true}
          name="password"
          onChange={(e) => formInfutHandler(e)}
          placeholder="Enter your password"
        />
      </div>
      <div className=" m-5 text-white font-semibold text-[1.5rem]">
        <Button
          type="submit"
          children="Register"
          onClick={(e) => formSubmitHandler(e)}
          className="bg-orange-600 w-[200px] max-w-[15rem] hover:bg-orange-500 cursor-pointer "
        />
      </div>
      <h2 className=" mb-5">
        I already have an account{" "}
        <span
          onClick={() => navigate("/")}
          className="text-blue-600 underline font-bold cursor-pointer hover:text-blue-700"
        >
          Login.
        </span>
      </h2>
    </Container>
  );
};

export default Registation;
