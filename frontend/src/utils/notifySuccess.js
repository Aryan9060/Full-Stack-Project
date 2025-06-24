 import { toast } from "react-toastify";

 const notifySuccess = (message) => {
    toast(message, {
        type: "success",
        position: "top-center",
        autoClose: 3000,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: true,
    });
 };

 export default notifySuccess;