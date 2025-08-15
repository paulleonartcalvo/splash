import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
const loginFormSchema = z.object({
  email: z.email(),
});

export function LoginForm({
  className,
  onSubmitLoginForm,
  ...props
}: React.ComponentProps<"div"> & {
  onSubmitLoginForm?: (values: z.infer<typeof loginFormSchema>) => void;
}) {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    mode: "all",
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmitValid: SubmitHandler<z.infer<typeof loginFormSchema>> = (
    values
  ) => {
    onSubmitLoginForm?.(values);
  };

  const onSubmitInValid: SubmitErrorHandler<z.infer<typeof loginFormSchema>> = (
    errors
  ) => {
    alert(JSON.stringify(errors.email?.message));
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login or create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmitValid, onSubmitInValid)}>
            <Form {...form}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@gmail.com" {...field} />
                        </FormControl>
                        {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div> */}
                <div className="flex flex-col gap-3">
                  <Button type="submit" className="w-full">
                    Login with email code
                  </Button>
                </div>
              </div>
            </Form>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
