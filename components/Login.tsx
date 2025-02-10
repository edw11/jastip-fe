"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import loader from "@/public/icons/loader.svg";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

const Login = () => {
  const router = useRouter(); // Next.js router
  const [isLoading, setLoading] = useState(false);
  const [isLoadingPage, setLoadingPage] = useState(true);
  const [isMessage, setMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8080/check-auth", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        data.authenticated ? router.push("/") : setLoadingPage(false);
      } catch (err) {
        console.error(err);
        setLoadingPage(false);
      }
    };

    checkAuth();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data?.message || "Sign in failed");
        setLoading(false);
        return;
      } else {
        router.push("/");
      }
    } catch (error) {
      setMessage("An unexpected error occured");
    } finally {
      setLoading(false);
    }
  }
  if (isLoadingPage) {
    return <p>Loading...</p>;
  }
  return (
    <div className="min-w-80">
      <h1 className="text-2xl font-bold text-center pb-4">Sign In</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-blue-400 w-full h-12 rounded-full hover:bg-red-500 mb-8"
            disabled={isLoading}
          >
            {isLoading ? (
              <Image
                src={loader}
                width={23}
                height={23}
                alt="loader"
                className="ml-2 animate-spin"
              />
            ) : (
              <span className="text-md text-white">Submit</span>
            )}
          </Button>
        </form>
      </Form>
      <div className="flex justify-center w-full pt-3">
        {isMessage && (
          <span className="text-sm text-center w-full text-red-500">
            {isMessage}
          </span>
        )}
      </div>
    </div>
  );
};

export default Login;
