"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
const router = useRouter();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");

const handleLogin = async () => {
try {
setLoading(true);

  setMessage("");
  setMessageType("");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
    {
      email,
      password,
    }
  );

  if (!response.data.success) {
    setMessage(response.data.message);
    setMessageType("error");
    return;
  }

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  setMessage("Login Successful");
  setMessageType("success");

  setTimeout(() => {
    router.push("/");
  }, 1000);

} catch (error) {
  console.error(error);

  setMessage("Something went wrong. Please try again.");
  setMessageType("error");
} finally {
  setLoading(false);
}

};

return ( <main className="min-h-screen bg-[#F1DECB] flex items-center justify-center px-6">

  <div
    className="
      bg-white
      p-10
      rounded-2xl
      shadow-lg
      border
      border-[#C28958]/20
      w-full
      max-w-md
    "
  >

    <div className="text-center mb-8">

      <h1 className="text-4xl font-bold text-[#5A3730]">
        ARR Automation
      </h1>

      <p className="mt-2 text-[#8C5C3F]">
        Secure Access Portal
      </p>

    </div>

    <h2 className="text-2xl font-semibold text-center text-[#5A3730] mb-6">
      Welcome Back
    </h2>

    {message && (
      <div
        className={`mb-5 p-3 rounded-xl text-center font-medium ${
          messageType === "success"
            ? "bg-green-100 text-green-700 border border-green-300"
            : "bg-red-100 text-red-700 border border-red-300"
        }`}
      >
        {message}
      </div>
    )}

    <input
      type="email"
      placeholder="Email Address"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="
        w-full
        border
        border-[#C28958]/30
        p-3
        rounded-xl
        mb-4
        focus:outline-none
        focus:ring-2
        focus:ring-[#C28958]
      "
    />

    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      className="
        w-full
        border
        border-[#C28958]/30
        p-3
        rounded-xl
        mb-5
        focus:outline-none
        focus:ring-2
        focus:ring-[#C28958]
      "
    />

    <button
      onClick={handleLogin}
      disabled={loading}
      className="
        w-full
        bg-[#C28958]
        hover:bg-[#8C5C3F]
        text-white
        py-3
        rounded-xl
        font-semibold
        transition-all
        duration-300
        disabled:opacity-70
      "
    >
      {loading ? "Logging In..." : "Login"}
    </button>

    <div className="mt-6 text-center">

    <div className="mt-5 text-center">
        <Link
            href="/register"
            className="
            font-semibold
            text-[#C28958]
            hover:text-[#8C5C3F]
            transition-colors
            "
            >
            Create Account
        </Link>

    </div>
            <Link
    href="/"
    className="
        text-[#8C5C3F]
        hover:text-[#C28958]
        transition-colors
        mt-6
        "
        >
        ← Back To Home
    </Link>

    </div>

  </div>

</main>

);
}
