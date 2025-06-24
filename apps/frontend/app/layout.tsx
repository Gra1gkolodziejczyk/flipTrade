import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/lib/auth-provider';
import Header from '@/components/header/header';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="text-black bg-gray-200 dark:bg-gray-950 dark:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>
            <Header />
            <main className="pt-20">{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
