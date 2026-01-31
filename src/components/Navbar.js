"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      // Kita arahkan ke halaman search (perlu buat halaman search/page.js nanti)
      // Atau biarkan logic pencarian di handle di page search
      router.push(`/search?q=${query}`);
    }
  };

  return (
    <>
      <style jsx>{`
        /* Style Navbar Netflix tetap sama */
        .navbar {
          position: fixed; top: 0; width: 100%; height: 70px;
          background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 100%);
          background-color: #141414;
          display: flex; align-items: center; padding: 0 4%; z-index: 1000;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .nav-logo { font-size: 24px; font-weight: 900; color: #E50914; text-decoration: none; margin-right: 40px; }
        .nav-links { display: flex; gap: 20px; }
        .nav-item { color: #e5e5e5; font-size: 14px; font-weight: 500; text-decoration: none; transition: 0.3s; }
        .nav-item:hover { color: #fff; }
        .nav-right { margin-left: auto; }
        .search-form { display: flex; align-items: center; background: rgba(0,0,0,0.5); border: 1px solid #333; padding: 5px 10px; border-radius: 4px; }
        .search-input { background: transparent; border: none; color: white; outline: none; width: 150px; }
        @media (max-width: 768px) { .nav-links { display: none; } }
      `}</style>

      <nav className="navbar">
        <Link href="/" className="nav-logo">NAMAWEBSITE</Link>
        <div className="nav-links">
          <Link href="/" className="nav-item">Home</Link>
          <Link href="#" className="nav-item">Film Indo</Link>
          <Link href="#" className="nav-item">Drakor</Link>
        </div>
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