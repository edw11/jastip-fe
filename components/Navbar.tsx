"use client";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ Use Next.js router
import React from "react";

type User = {
  id?: string;
  email?: string;
  name?: string;
};

type NavbarProps = {
  user?: User;
  setUser: React.Dispatch<React.SetStateAction<User>>; // ✅ Add setUser
};

const Navbar: React.FC<NavbarProps> = ({ user, setUser }) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("https://jastip-be.onrender.com/logout", {
        method: "POST",
        credentials: "include", // Send cookies with the request
      });

      if (res.ok) {
        setUser({}); // ✅ Clear user state
        router.push("/"); // ✅ Redirect to home page
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  return (
    <div className="fixed px-5 py-3 w-full bg-white shadow-sm text-black font-work-sans">
      <nav className="flex justify-between items-center">
        <Link href="/">
          <h1 className="text-lg font-bold">
            <span
              className="text-blue-400"
              onClick={() => {
                router.push("/");
              }}
            >
              KBBI
            </span>{" "}
            Jastip
          </h1>
        </Link>
        <div>
          {!user?.id ? (
            <div className="flex items-center gap-5">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </div>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/create">
                <span className="text-base">Create</span>
              </Link>
              <Link href="/user">
                <span className="text-base">{user?.name}</span>
              </Link>
              <button onClick={handleLogout}>
                <span className="text-base">Log out</span>
              </button>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
