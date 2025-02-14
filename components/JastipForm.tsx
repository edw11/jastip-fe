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
import { Input } from "./ui/input";

// ✅ Fix: Improved Schema Validation
const formSchema = z.object({
  title: z.string().min(4, {
    message: "Title must be at least 4 characters.",
  }),
  description: z.string().min(4, {
    message: "Invalid description.",
  }),
  quota: z
    .string()
    .regex(/^\d+$/, { message: "Price must be a valid number." }) // Ensure it's numeric
    .transform((val) => Number(val)) // Convert to number
    .refine((num) => num >= 1 && num <= 100, {
      message: "Quota must be between 1 and 100.",
    }),
  price: z
    .string()
    .regex(/^\d+$/, { message: "Price must be a valid number." }) // Ensure it's numeric
    .transform((val) => Number(val)) // Convert to number
    .refine((num) => num >= 1000 && num <= 99000, {
      message: "Price must be between 1000 and 99000.",
    }),
});

const JastipForm = () => {
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log("run");
      const response = await fetch("https://jastip-be.onrender.com/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      window.location.href = "/";
    } catch (error) {}
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      quota: 1,
      price: 15000,
    },
  });
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="startup-form">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="startup-form_label">Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Title"
                    className="startup-form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="startup-form_label">
                  Description
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Description"
                    className="startup-form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quota"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="startup-form_label">Quota</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Quota from 1 to 100 kg"
                    className="startup-form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="startup-form_label">
                  Price in Won (kg)
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Price (ex 15000)"
                    className="startup-form_input"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <div className="flex flex-col w-full items-center gap-2">
            <Button
              type="submit"
              className="bg-blue-400 text-white w-full h-12 rounded-full hover:bg-red-500 mb-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default JastipForm;
