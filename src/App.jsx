import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Routes from "./Router";
import Navbar from "./Navbar";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <CssBaseline />
      <Navbar>
        <Container maxWidth="lg">
          <RouterProvider router={Routes} />
        </Container>
      </Navbar>
    </>
  );
}

export default App;
