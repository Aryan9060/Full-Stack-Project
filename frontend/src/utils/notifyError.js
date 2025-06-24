import { toast } from "react-toastify";

const notifyError = (message) => {
  toast(message, {
    type: "error",
    position: "top-center",
    autoClose: 2000,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    hideProgressBar: false,
    // progress: undefined,
    // theme: "colored",
    // transition: Bounce,
  });
};

export default notifyError;
