import "@/assets/styles/globals.css";
import type { Metadata } from "next";
import { roboto } from "@/assets/fonts/fonts";
import { Setup } from "@/components/utils";
import Provider from "@/redux/provider";
import {NextUIProvider} from "@nextui-org/react";

export const metadata: Metadata = {
  title: "Re-Projects",
  description: "Repositorio digital para Inacap",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
        <body className={`${roboto.className}  antialiased`}>
      <NextUIProvider>
          <Provider>
            <Setup />
              <div>{children}</div>
          </Provider>
      </NextUIProvider>
      
        </body>
    </html>
  );
}
