import Link from "next/link";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <nav className="flex gap-4 p-4 bg-gray-100">
          <Link href="/">Home</Link>
          <Link href="/login">Login</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/users">Users</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
