import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
const Home = () => {
  const navigate = useNavigate();
  const { userData, isAuthenticated } = useSelector((state) => state.user);
  // console.log("user ->", userData);

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  return <>{isAuthenticated && <div className="">Home</div>}</>;
};

export default Home;
