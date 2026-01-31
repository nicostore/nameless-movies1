import Link from 'next/link';

// Fungsi Fetch Data V3
async function getData(action, page = 1) {
  try {
    const res = await fetch(`https://zeldvorik.ru/apiv3/api.php?action=${action}&page=${page}`, {
      cache: 'no-store'
    });
    const json = await res.json();
    
    // API V3 menggunakan properti "items"
    if (json.success && Array.isArray(json.items)) {
      return json.items;
    }
    return [];
  } catch (e) {
    console.log(`Error fetch ${action}:`, e);
    return [];
  }
}

// Komponen Card Kecil (Internal biar rapi)
const MovieCard = ({ item }) => (
  <Link href={`/detail/${item.detailPath}`} className="card">
    <div className="poster-box">
      <img src={item.poster} alt={item.title} className="poster-img" loading="lazy" />
      <div className="rating">★ {item.rating}</div>
      <div className="quality-tag">{item.type}</div>
    </div>
    <div className="info">
      <div className="title">{item.title}</div>
      <div className="meta">
        <span>{item.year}</span>
        <span className="genre-tag">{item.genre ? item.genre.split(',')[0] : ''}</span>
      </div>
    </div>
  </Link>
);

export default async function HomePage() {
  // Ambil data dari endpoint baru
  const trending = await getData('trending');
  const indoMovies = await getData('indonesian-movies');
  const kdrama = await getData('kdrama');

  return (
    <main>
      <style>{`
        * { box-sizing: border-box; }
        body { background-color: #141414; margin: 0; color: white; font-family: sans-serif; }
        a { text-decoration: none; color: inherit; }
        
        .main-content { padding: 100px 20px 40px; max-width: 1400px; margin: 0 auto; }
        
        /* Section Header */
        .section-header { 
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 20px; border-left: 5px solid #E50914; padding-left: 15px; 
        }
        .section-title { font-size: 22px; font-weight: 700; margin: 0; }
        .see-all { font-size: 14px; color: #E50914; font-weight: bold; }

        /* Grid */
        .movie-grid { 
          display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); 
          gap: 16px; margin-bottom: 50px; 
        }
        
        /* Card Styles */
        .card { position: relative; transition: transform 0.3s; background: #1f1f1f; border-radius: 8px; overflow: hidden; }
        .card:hover { transform: scale(1.05); z-index: 10; box-shadow: 0 10px 20px rgba(0,0,0,0.5); }
        
        .poster-box { width: 100%; aspect-ratio: 2/3; position: relative; }
        .poster-img { width: 100%; height: 100%; object-fit: cover; }
        
        .rating { 
          position: absolute; top: 8px; right: 8px; 
          background: rgba(0,0,0,0.8); color: #46d369; 
          padding: 2px 6px; font-size: 11px; font-weight: bold; 
          border-radius: 4px; 
        }
        .quality-tag {
          position: absolute; bottom: 8px; left: 8px;
          background: #E50914; color: white; padding: 2px 6px; 
          font-size: 10px; font-weight: bold; border-radius: 2px; text-transform: uppercase;
        }

        .info { padding: 10px; }
        .title { 
          font-size: 14px; font-weight: 600; white-space: nowrap; 
          overflow: hidden; text-overflow: ellipsis; margin-bottom: 5px; color: #fff; 
        }
        .meta { display: flex; justify-content: space-between; font-size: 11px; color: #aaa; }
        .genre-tag { color: #ccc; }

        @media (max-width: 768px) {
          .movie-grid { grid-template-columns: repeat(3, 1fr); gap: 8px; }
          .main-content { padding: 90px 15px 20px; }
        }
      `}</style>

      <div className="main-content">
        
        {/* SECTION 1: TRENDING */}
        <div className="section-header">
          <h2 className="section-title">Lagi Trending 🔥</h2>
        </div>
        <div className="movie-grid">
          {trending.map((item, i) => <MovieCard key={i} item={item} />)}
        </div>

        {/* SECTION 2: FILM INDONESIA */}
        <div className="section-header">
          <h2 className="section-title">Film Indonesia 🇮🇩</h2>
        </div>
        <div className="movie-grid">
          {indoMovies.map((item, i) => <MovieCard key={i} item={item} />)}
        </div>

        {/* SECTION 3: K-DRAMA */}
        <div className="section-header">
          <h2 className="section-title">Drakor Terpopuler 🇰🇷</h2>
        </div>
        <div className="movie-grid">
          {kdrama.map((item, i) => <MovieCard key={i} item={item} />)}
        </div>

      </div>
    </main>
  );
}