import "./globals.css";
import { ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StoreInitializer from '../components/StoreInitializer';


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body suppressHydrationWarning={true}>
        <StoreInitializer />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition={Bounce}
        />
      </body>
    </html>
  );
}