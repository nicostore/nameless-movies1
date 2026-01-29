"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  // SOLUSI ERROR NEXT.JS 15: Gunakan useParams() hook
  const params = useParams();
  const slug = params?.slug; 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState('');
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [isCinema, setIsCinema] = useState(false);

  // Fetch Data
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://zeldvorik.ru/rebahin21/api.php?action=detail&slug=${slug}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
          // Cek Series/Film
          if (json.data.episodes && json.data.episodes.length > 0) {
            setActiveUrl(json.data.episodes[0].player_url);
            setActiveEpisode(1);
          } else {
            setActiveUrl(json.data.player_url);
          }
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const changeEpisode = (episode) => {
    setActiveUrl(episode.player_url);
    setActiveEpisode(episode.episode);
  };

  if (loading) return <div className="loading-screen">Memuat Film...</div>;
  if (!data) return <div className="loading-screen">Film tidak ditemukan :(</div>;

  return (
    <div className={`detail-container ${isCinema ? 'cinema-mode-active' : ''}`}>
      
      {/* CSS MANUAL (GAYA PAKSA AGAR RAPIH) */}
      <style jsx global>{`
        /* Reset Dasar */
        body { margin: 0; background-color: #141414; color: white; font-family: sans-serif; }
        
        /* Container Utama */
        .detail-container { min-height: 100vh; padding-top: 80px; transition: background 0.5s; }
        .cinema-mode-active { background-color: black; padding-top: 0; }
        
        /* Menyembunyikan Navbar Layout saat Cinema Mode */
        .cinema-mode-active ~ nav, 
        body:has(.cinema-mode-active) nav { display: none !important; }

        /* Player Area */
        .player-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          background: #000;
        }
        .player-frame {
          width: 100%;
          aspect-ratio: 16 / 9;
          border: none;
          display: block;
        }
        
        /* Cinema Mode Fullscreen */
        .cinema-mode-active .player-wrapper { max-width: 100%; height: 100vh; }
        .cinema-mode-active .player-frame { height: 100vh; }

        /* Controls Bar */
        .controls-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px; background: #1f1f1f; margin-bottom: 20px;
        }
        .cinema-mode-active .controls-bar {
          position: absolute; bottom: 20px; right: 20px; background: transparent; pointer-events: none;
        }
        .cinema-mode-active .controls-bar button { pointer-events: auto; }
        .cinema-mode-active .movie-title-info { display: none; }

        /* Typography */
        h1 { margin: 0; font-size: 24px; font-weight: bold; }
        p { color: #aaa; font-size: 14px; margin: 5px 0 0; }
        
        /* Buttons */
        .btn-cinema {
          background: #333; color: white; border: 1px solid #555;
          padding: 8px 16px; border-radius: 20px; cursor: pointer; font-weight: bold;
        }
        .btn-cinema:hover { background: #555; }

        /* Content Grid (Info & Episode) */
        .content-grid {
          display: grid; grid-template-columns: 2fr 1fr; gap: 30px;
          max-width: 1200px; margin: 0 auto; padding: 20px;
        }
        @media (max-width: 768px) { .content-grid { grid-template-columns: 1fr; } }

        /* Info Section */
        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #E50914; padding-left: 10px; }
        .synopsis { line-height: 1.6; color: #ccc; margin-bottom: 20px; }
        .tag { 
          display: inline-block; background: #333; color: #ddd; 
          padding: 5px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px; margin-bottom: 5px;
        }
        
        /* Cast List */
        .cast-list { display: flex; flex-wrap: wrap; gap: 10px; }
        .cast-item { background: #222; padding: 5px 15px; border-radius: 20px; font-size: 13px; color: #ddd; }

        /* Episode List (Box Kanan) */
        .episode-box { background: #1f1f1f; padding: 20px; border-radius: 8px; max-height: 500px; overflow-y: auto; }
        .episode-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
        .btn-episode {
          background: #333; color: #ccc; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-weight: bold;
        }
        .btn-episode.active { background: #E50914; color: white; }
        .btn-episode:hover:not(.active) { background: #444; }

        .loading-screen { display: flex; height: 100vh; align-items: center; justify-content: center; background: #141414; color: white; font-size: 20px; }
      `}</style>

      {/* PLAYER UTAMA */}
      <div className="player-wrapper">
        <iframe 
  src={activeUrl} 
  className="player-frame"
  allowFullScreen={true} // Wajib untuk React/Next.js
  allow="autoplay; encrypted-media; fullscreen; picture-in-picture" // Izin lengkap
  frameBorder="0"
  width="100%"
  height="100%"
  referrerPolicy="origin" // Opsional: Membantu agar API mengenali request
/>
        
        <div className="controls-bar">
          <div className="movie-title-info">
            <h1>{data.title}</h1>
            <p>{data.year} • ⭐ {data.rating}</p>
          </div>
          <button className="btn-cinema" onClick={() => setIsCinema(!isCinema)}>
            {isCinema ? '❌ Keluar Cinema' : '📺 Cinema Mode'}
          </button>
        </div>
      </div>

      {/* AREA INFORMASI (Hilang saat Cinema Mode) */}
      {!isCinema && (
        <div className="content-grid">
          {/* KIRI: Sinopsis & Cast */}
          <div>
            <h3 className="section-title">Sinopsis</h3>
            <p className="synopsis">{data.synopsis}</p>

            <h3 className="section-title">Genre</h3>
            <div style={{ marginBottom: 20 }}>
              {data.genres.map((g, i) => <span key={i} className="tag">{g}</span>)}
            </div>

            <h3 className="section-title">Pemeran</h3>
            <div className="cast-list">
              {data.cast.map((c, i) => <span key={i} className="cast-item">{c}</span>)}
            </div>
          </div>

          {/* KANAN: Daftar Episode */}
          <div>
            {data.episodes && data.episodes.length > 0 ? (
              <div className="episode-box">
                <h3 className="section-title">Pilih Episode ({data.episodes.length})</h3>
                <div className="episode-grid">
                  {data.episodes.map((ep) => (
                    <button
                      key={ep.episode}
                      onClick={() => changeEpisode(ep)}
                      className={`btn-episode ${activeEpisode === ep.episode ? 'active' : ''}`}
                    >
                      {ep.episode}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="episode-box" style={{ textAlign: 'center' }}>
                <img src={data.thumbnail} style={{ width: '100%', borderRadius: '8px' }} />
                <p style={{ marginTop: 10 }}>Film Box Office</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}