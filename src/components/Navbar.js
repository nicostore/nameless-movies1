"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Menu } from 'lucide-react'; // Icon for hamburger menu

export default function Navbar({ toggleSidebar }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <>
      <style jsx>{`
        .navbar {
          position: fixed; top: 0; width: 100%; height: 70px;
          background-color: #141414;
          display: flex; align-items: center; padding: 0 20px; z-index: 1000;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .menu-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          margin-right: 20px;
        }
        .nav-right { margin-left: auto; display: flex; align-items: center; }
        .search-form { display: flex; align-items: center; background: rgba(0,0,0,0.5); border: 1px solid #333; padding: 5px 10px; border-radius: 4px; }
        .search-input { background: transparent; border: none; color: white; outline: none; width: 150px; }
      `}</style>

      <nav className="navbar">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="nav-right">
          <form onSubmit={handleSearch} className="search-form">
            <span>🔍</span>
            <input 
              type="text" placeholder="Cari..." className="search-input"
              value={query} onChange={(e) => setQuery(e.target.value)}
            />
          </form>
        </div>
      </nav>
    </>
  );
}