import { StrictMode } from "react";
import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRouter,
  RouterProvider,
  type RouterProps,
} from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme } from "./components/ui/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { routeTree } from "./routeTree.gen";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    session: null,
  },
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App({ context, ...restProps }: RouterProps<typeof router>) {
  const { session } = useAuth();

  const theme = useTheme();
  return (
    <>
      <ToastContainer position="bottom-right" theme={theme.theme} />
      <RouterProvider {...restProps} context={{ session }} />
    </>
  );
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <App router={router} />
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>
  );
}

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
