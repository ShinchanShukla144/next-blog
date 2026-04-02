import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signUp } from "@/lib/auth-client";
import { toast } from "sonner";

const registerSchema = z
  .object({
    name: z.string().min(3, "Name length should be 3 characters"),
    email: z.string().email("Please enter valid email!"),
    password: z.string().min(6, "minimum 6 characters required"),
    confirmPassword: z.string().min(6, "minimum 6 characters required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

type RegisterFormvalues = z.infer<typeof registerSchema>;
// 👉 Ye line Zod schema se automatic TypeScript type generate karti hai
// 👉 Isse form data type-safe aur sync rehta hai schema ke saath

interface RegisterFormProps {
  onSuccess?: () => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormvalues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const onRegisterSubmit = async (values: RegisterFormvalues) => {
    setIsLoading(true);
    try {
      const { error } = await signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast("Failed to create account. Please try again!");
        return;
      }
      toast("Account created successfully...");
      if (onSuccess) {
        onSuccess();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onRegisterSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name ..." {...field} />
              </FormControl>
              {form.formState.errors.name?.message}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email ..." {...field} />
              </FormControl>
              {form.formState.errors.email?.message}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password ..."
                  {...field}
                />
              </FormControl>
              {form.formState.errors.password?.message}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password ..."
                  {...field}
                />
              </FormControl>
              {form.formState.errors.confirmPassword?.message}
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "creating..." : "create user"}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
