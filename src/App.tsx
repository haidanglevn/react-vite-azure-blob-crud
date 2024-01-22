import { useState } from "react";
import "./App.css";
import UploadPage from "./UploadPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <UploadPage />
    </>
  );
}

export default App;
