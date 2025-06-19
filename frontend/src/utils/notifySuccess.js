 import { toast } from "react-toastify";

 const notifySuccess = (message) => {
    toast(message, {
        type: "success",
        position: "top-center",
        autoClose: 3000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
    });
 };

 export default notifySuccess;