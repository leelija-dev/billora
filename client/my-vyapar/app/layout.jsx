import "./globals.css";
import { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StoreInitializer from '../components/StoreInitializer';

export default function RootLayout({ children }) {
  return (
    <>
      <StoreInitializer />
      <html lang="en" suppressHydrationWarning>
        <body suppressHydrationWarning={true}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </body>
      </html>
    </>
  );
}

