"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterPage() {
const router = useRouter();

const [fullName, setFullName] = useState("");
const [profession, setProfession] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [loading, setLoading] = useState(false);

const [message, setMessage] = useState("");
const [messageType, setMessageType] = useState("");
const [showPassword, setShowPassword] = useState(false);


const handleRegister = async () => {
try {
setLoading(true);


  setMessage("");
  setMessageType("");

  const response = await axios.post(
     `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
    {
      fullName,
      profession,
      email,
      password,
    }
  );

  if (!response.data.success) {
    setMessage(response.data.message);
    setMessageType("error");
    return;
  }

  setMessage("Account created successfully");
  setMessageType("success");

  setTimeout(() => {
    router.push("/login");
  }, 1500);

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
        Create Your Account
      </p>

    </div>

    <h2 className="text-2xl font-semibold text-center text-[#5A3730] mb-6">
      Register
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
      type="text"
      placeholder="Full Name"
      value={fullName}
      onChange={(e) => setFullName(e.target.value)}
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
      type="text"
      placeholder="Profession (e.g. HR Manager, Software Engineer)"
      value={profession}
      onChange={(e) => setProfession(e.target.value)}
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

    <div className="relative mb-5">
        <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="
            w-full
            border
            border-[#C28958]/30
            p-3
            pr-12
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-[#C28958]
        "
        />

        <button
            type="button"
            onClick={() =>
            setShowPassword(!showPassword)
            }
            className="
            absolute
            right-3
            top-1/2
            -translate-y-1/2
            text-[#8C5C3F]
            "
        >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
    </div>
    <button
      onClick={handleRegister}
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
      {loading ? "Creating Account..." : "Create Account"}
    </button>

    <div className="mt-5 text-center">

      <p className="text-[#5A3730]">
        Already have an account?
      </p>

      <Link
        href="/login"
        className="
          font-semibold
          text-[#C28958]
          hover:text-[#8C5C3F]
          transition-colors
        "
      >
        Login Here
      </Link>

    </div>

    <div className="mt-6 text-center">

      <Link
        href="/"
        className="
          text-[#8C5C3F]
          hover:text-[#C28958]
          transition-colors
        "
      >
        ← Back To Home
      </Link>

    </div>

  </div>

</main>

);
}
