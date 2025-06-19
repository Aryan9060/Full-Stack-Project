import { toast } from "react-toastify"

const notifyError = (message)=>{
    toast(
        message,
        {
            type: "error",
            position: "top-center",
            autoClose: 5000,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: true,
        }
    )
}

export default notifyError;