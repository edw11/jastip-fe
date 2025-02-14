"use client";
import JastipForm from "@/components/JastipForm";
import Navbar from "@/components/Navbar";
import checkAuth from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
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
  if (!user.id) {
    return (
      <div className="w-full h-svh flex justify-center items-center">
        Loading...
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} setUser={setUser} />
      <div className="pt-[3.4rem]">
        <section className="pink_container !min-h-[230px]">
          <h1 className="heading">Create your jastip</h1>
        </section>
        <JastipForm />
      </div>
    </div>
  );
};

export default Page;
