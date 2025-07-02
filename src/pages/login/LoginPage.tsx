import {
  BadgeCheck,
  FileText,
  GalleryVerticalEnd,
  KeyRound,
} from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { useAuthStore } from "@/store/useAuthStore";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const email = useAuthStore((s) => s.email);
  const password = useAuthStore((s) => s.password);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const token = await user.getIdToken();
      const refreshToken = user.refreshToken;
      const displayName = user.displayName ?? "";
      const expiresIn = "3600";

      const { data } = await axios.post(`${API_BASE}/user/login`, {
        token,
      });

      const role = data?.role?.toLowerCase() ?? "user";
      const userId = data?._id;
      setAuth({
        userId: userId,
        email: user.email ?? "",
        displayName,
        token,
        refreshToken,
        expiresIn,
        role,
        password: "",
      });

      navigate("/licenses");
    } catch (error: any) {
      alert("Login failed: " + error.message);
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Licensify
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-4">
            <LoginForm />
            <button
              onClick={handleLogin}
              className="w-full rounded bg-primary px-4 py-2 text-white hover:bg-primary/90 transition"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex flex-col justify-center items-center px-10 bg-zinc-950 text-white overflow-hidden">
  <div className="relative z-10 space-y-6 max-w-lg mt-20">
    <h1 className="text-4xl flex font-bold justify-start items-center">
      Welcome to <img src="/logo.png" alt="Licensify Logo" className="h-52 w-auto" />
    </h1>
    <p className="text-muted-foreground text-base">
      Streamline how your team accesses software. Centralized license
      tracking, smart requests, and admin control — all in one place.
    </p>

    <ul className="space-y-3 text-sm text-muted-foreground">
      <li className="flex items-center gap-3">
        <KeyRound className="text-white" size={18} />
        License vault with access control
      </li>
      <li className="flex items-center gap-3">
        <FileText className="text-white" size={18} />
        Request & approval workflows
      </li>
      <li className="flex items-center gap-3">
        <BadgeCheck className="text-white" size={18} />
        Admin reviews and comments
      </li>
    </ul>
  </div>

  <div className="absolute inset-0 bg-zinc-900/80 z-0" />
</div>

    </div>
  );
}
