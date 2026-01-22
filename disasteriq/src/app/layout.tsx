import "@/app/globals.css";
import { Providers } from "@/app/components/providers";

export const metadata = {
  title: "Disaster Response Hub",
  description: "RapidAid Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}