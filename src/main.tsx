import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import { GoogleOAuthWrapper } from "./components/providers/google-auth-provider";

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <GoogleOAuthWrapper>
        <App />
      </GoogleOAuthWrapper>
      <Toaster />
    </BrowserRouter>
  </>
);
