"use client";
import Link from 'next/link';
import { X } from 'lucide-react'; // Menggunakan ikon untuk tombol tutup

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      <style jsx>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          width: 250px;
          background-color: #181818;
          border-right: 1px solid #282828;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          z-index: 1100;
          padding: 20px;
          display: flex;
          flex-direction: column;
        }
        .sidebar.open {
          transform: translateX(0);
        }
        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .sidebar-logo {
          font-size: 24px;
          font-weight: 900;
          color: #E50914;
          text-decoration: none;
        }
        .close-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
        }
        .nav-links {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        .nav-item {
          color: #e5e5e5;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none;
          transition: 0.3s;
          padding: 10px;
          border-radius: 4px;
        }
        .nav-item:hover {
          color: #fff;
          background-color: #333;
        }
        .overlay {
          display: none;
        }
        /* Style untuk mobile */
        @media (max-width: 768px) {
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 1050;
            display: ${isOpen ? 'block' : 'none'};
          }
        }
      `}</style>
      <div className={`overlay`} onClick={toggleSidebar}></div>
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <Link href="/" className="sidebar-logo" onClick={toggleSidebar}>NAMAWEBSITE</Link>
          <button onClick={toggleSidebar} className="close-btn">
            <X size={24} />
          </button>
        </div>
        <nav className="nav-links">
          <Link href="/" className="nav-item" onClick={toggleSidebar}>Home</Link>
          <Link href="#" className="nav-item" onClick={toggleSidebar}>Film Indo</Link>
          <Link href="#" className="nav-item" onClick={toggleSidebar}>Drakor</Link>
        </nav>
      </aside>
    </>
  );
}