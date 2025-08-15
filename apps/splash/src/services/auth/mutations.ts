import { createRequest } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

interface LoginRequest {
  email: string;
}

interface LoginSuccessResponse {
  success: true;
  message: string;
  data: {
    email: string;
  };
}

interface LoginErrorResponse {
  success: false;
  error: string;
}

type LoginResponse = LoginSuccessResponse | LoginErrorResponse;
// UseMutationResult<LoginResponse>
export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (email: string) =>
      createRequest<LoginResponse>(
        `${import.meta.env["VITE_BOOKING_API_URL"]}/auth/login`,
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      ),
    onSuccess: (data) => {
      if (data.success) {
        console.log("Login successful:", data.message);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
    },
  });
};
