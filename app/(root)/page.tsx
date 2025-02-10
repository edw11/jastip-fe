"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import checkAuth from "@/utils/auth";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function page() {
  const route = useRouter();
  const [user, setUser] = useState<{
    id?: string;
    email?: string;
    name?: string;
  }>({});

  useEffect(() => {
    const getSession = async () => {
      try {
        const sessionData = await checkAuth();
        if (!sessionData) {
          route.push("/");
        } else {
          setUser(sessionData.user); // Set session data
        }
      } catch (error) {
        console.log(error);
      }
    };
    getSession();
  }, []);

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar user={user} setUser={setUser} />
      <div className="pt-[3.4rem]">
        <Hero user={user} />
      </div>

      {!user.id && <Footer />}
    </div>
  );
}
