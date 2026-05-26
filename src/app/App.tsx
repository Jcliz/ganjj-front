import { RouterProvider } from "react-router";
import { router } from "./routes";
import "./styles/global.css";
import { AuthProvider } from "../contexts/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
