import { NavLink } from "react-router";
import Button from "../button/Button";
import axios from "axios";
import { baseURL } from "../../utils/api";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/UserSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    axios.defaults.withCredentials = true;
    await axios.post(`${baseURL}/api/v1/users/logout`);
    dispatch(setUserData(''));
  };
  return (
    <ul className="flex justify-between items-center px-5 bg-black">
      <NavLink to={`/`}>
        <li className={`px-5 py-3 hover:bg-gray-500 text-white`}>Home</li>
      </NavLink>
      <NavLink to={`/login`}>
        <Button
          children={`Logout`}
          onClick={logoutHandler}
          className="bg-orange-600 hover:bg-amber-500 text-white"
        />
      </NavLink>
    </ul>
  );
};

export default Navbar;
