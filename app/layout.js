import { Toaster } from "sonner";
import ConvexClientProvider from "./ConvexClientProvider";
import "./globals.css";
import Provider from "./provider";
import { MiddlewareNotFoundError } from "next/dist/shared/lib/utils";

export const metadata = {
  title: "zap.ai Launchpad",
  description: "Launch fully functional web apps from idea to deployment in minutes with AI-powered design-to-code generation.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body >
        <ConvexClientProvider>
          <Provider>{children}</Provider>
          <Toaster />

        </ConvexClientProvider>
      </body>
    </html>
  );
}

