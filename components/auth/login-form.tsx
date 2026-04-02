"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address!"),
  password: z.string().min(6, "Password must be 6 characters long!"),
});

type LoginFormvalues = z.infer<typeof loginSchema>;

function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  //initialoze form
  const form = useForm<LoginFormvalues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormvalues) => {
    setIsLoading(true);
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast("Login failed!");
        return;
      }
      toast("Login successfully...");
      router.push("/");
      console.log(values);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email..." {...field} />
              </FormControl>
              <p className="text-red-500 text-sm">
                {form.formState.errors.email?.message}
                {/* 👉 "agar error hai to message dikhao, warna kuch nahi" */}
              </p>
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
                  placeholder="Enter your password..."
                  {...field}
                />
              </FormControl>
              <p className="text-red-500 text-sm">
                {form.formState.errors.password?.message}
              </p>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;
