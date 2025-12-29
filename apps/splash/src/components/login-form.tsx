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
import { AuthService } from "@/services/auth/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Spinner } from "./ui/shadcn-io/spinner";

const loginFormSchema = z.object({
  email: z.email(),
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const mutation = AuthService.useLoginMutation();

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
    toast.promise(mutation.mutateAsync(values.email), {
      loading: "Sending magic link",
      success: "Magic link sent",
      error: "Failed to send magic link",
    });
  };

  const onSubmitInValid: SubmitErrorHandler<
    z.infer<typeof loginFormSchema>
  > = () => {
    toast.error("Please fix the errors in the form");
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
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@gmail.com"
                            {...field}
                            onClick={() => {
                              mutation.reset();
                            }}
                          />
                        </FormControl>
                        {/* <FormDescription>
                        This is your public display name.
                      </FormDescription> */}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={mutation.isPending || !form.formState.isValid}
                >
                  {mutation.isPending && <Spinner />}
                  {mutation.data?.success
                    ? "Email code sent!"
                    : "Login with email code"}
                </Button>
              </div>
            </Form>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
