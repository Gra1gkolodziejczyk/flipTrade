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
      <body className="text-black bg-white dark:bg-black dark:text-white">
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
