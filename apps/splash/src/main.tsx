import { StrictMode } from "react";
import "./index.css";

import { createRouter, RouterProvider, type RouterProps } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { ThemeProvider } from "./components/ui/theme-provider";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { routeTree } from "./routeTree.gen";

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

function RouterProviderWithContext({
  context,
  ...restProps
}: RouterProps<typeof router>) {
  const { session } = useAuth();

  return <RouterProvider {...restProps} context={{ session }} />;
}

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <RouterProviderWithContext router={router} />
        </AuthProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
