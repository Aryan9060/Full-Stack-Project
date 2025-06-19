import Container from "./components/container/Container";
import Registation from "./components/pages/Registation";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Container
        className={`w-full flex justify-center items-center min-h-[90vh] `}
      >
        <ToastContainer />
        <Registation />
      </Container>
    </>
  );
}

export default App;
