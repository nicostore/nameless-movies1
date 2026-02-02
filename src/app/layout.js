"use client"; // Jadikan ini Client Component untuk mengelola state
import { useState } from "react";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar"; // Import Sidebar baru
import "./global.css";

const inter = Inter({ subsets: ["latin"] });

/* Metadata API tidak berfungsi di Client Components. 
   Kita akan tambahkan tag <title> dan <meta> secara manual di <head>. */
// export const metadata = {
//   title: "Nameless Movies",
//   description: "Streaming Film Gratis",
// };

export default function RootLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <title>Nameless Movies</title>
        <meta name="description" content="Streaming Film Gratis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <style jsx global>{`
          body {
            margin: 0;
            background: #141414;
            color: white;
          }
          .main-content {
            padding-top: 70px; /* Height of Navbar */
            transition: margin-left 0.3s ease;
          }
          /* Layout desktop saat sidebar terbuka */
          @media (min-width: 769px) {
            body.sidebar-open .main-content {
              margin-left: 250px; /* Lebar Sidebar */
            }
          }
          /* Sembunyikan komponen layout saat mode cinema aktif */
          body.cinema-active .navbar,
          body.cinema-active .sidebar,
          body.cinema-active .overlay {
            display: none !important;
          }
          body.cinema-active .main-content {
            padding-top: 0;
            margin-left: 0;
          }
        `}</style>
        <Navbar toggleSidebar={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}