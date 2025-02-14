"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useState } from "react";
import loader from "@/public/icons/loader.svg"; // Adjust path based on your setup
import { UploadButton } from "./uploadthing";

// ✅ Fix: Improved Schema Validation
const formSchema = z
  .object({
    name: z.string().min(4, {
      message: "Name must be at least 4 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address.",
    }),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    imgUrl: z
      .string()
      .min(1, {
        message: "Please upload the image first",
      })
      .refine((val) => val !== "", {
        message: "Image is required",
      }), // Ensure the imageUrl field is not empty
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [isLoading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageName, setImageName] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      imgUrl: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMessage(""); // Clear previous message

    try {
      const response = await fetch("https://jastip-be.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data?.message || "Registration failed");
        return;
      }

      window.location.href = "/";
    } catch (error) {
      console.log(error);
      setMessage("An unexpected error occurred");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 400);
    }
  }

  return (
    <div className="min-w-80">
      <h1 className="text-2xl font-bold text-center pb-4">Sign Up</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Name"
                    className="text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    className="text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    className="text-md"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imgUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Upload ARC</FormLabel>
                <FormControl>
                  <div
                    className={`${
                      imageName || isUploading ? "pointer-events-none" : ""
                    }`}
                  >
                    <UploadButton
                      appearance={{
                        container: {
                          background: "#60a5fa",
                          borderRadius: "10px",
                          opacity: isUploading || imageName ? 0.5 : 1,
                        },
                        button: {
                          marginTop: "10px",
                          background: "#60a5fa",
                        },
                        allowedContent: {
                          marginBottom: "10px",
                        },
                      }}
                      endpoint="imageUploader"
                      onUploadBegin={() => {
                        setIsUploading(true);
                      }}
                      onClientUploadComplete={(res) => {
                        // Do something with the response
                        console.log("Files: ", res);
                        setImageName(res[0].name);
                        form.setValue("imgUrl", res[0].url);
                        form.trigger("imgUrl");
                        alert("Upload Completed");
                        setIsUploading(false); // Re-enable after upload
                      }}
                      onUploadError={(error: Error) => {
                        // Do something with the error.
                        alert(`ERROR! ${error.message}`);
                        setIsUploading(false); // Re-enable on error
                        setImageName("");
                        form.setValue("imgUrl", ""); // Reset imageUrl in case of error
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {imageName.length ? (
            <div className="flex w-full justify-center gap-2">
              <h1>{imageName}</h1>
              <span
                className="cursor-pointer"
                onClick={() => {
                  setImageName("");
                  form.setValue("imgUrl", "1"); // Reset imgUrl
                }}
              >
                Reset
              </span>
            </div>
          ) : null}
          <div className="flex flex-col w-full items-center gap-2">
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
            {message && <span className="text-sm text-red-500">{message}</span>}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Register;
