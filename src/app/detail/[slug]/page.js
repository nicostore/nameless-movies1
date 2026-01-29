"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  const params = useParams();
  const slug = params?.slug; 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState('');
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [isCinema, setIsCinema] = useState(false); // State untuk CSS Fullscreen
  
  const playerContainerRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    if (!slug) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`https://zeldvorik.ru/rebahin21/api.php?action=detail&slug=${slug}`);
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          if (json.data.episodes?.length > 0) {
            setActiveUrl(json.data.episodes[0].player_url);
            setActiveEpisode(1);
          } else {
            setActiveUrl(json.data.player_url);
          }
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchData();
  }, [slug]);

  const changeEpisode = (episode) => {
    setActiveUrl(episode.player_url);
    setActiveEpisode(episode.episode);
  };

  // --- FUNGSI SUPER CINEMA MODE ---
  const toggleCinemaMode = () => {
    const element = playerContainerRef.current;
    
    // 1. Coba Paksa Browser Masuk Real Fullscreen
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) { element.requestFullscreen().catch(err => console.log(err)); }
      else if (element.webkitRequestFullscreen) { element.webkitRequestFullscreen(); } // Safari/iOS
      else if (element.msRequestFullscreen) { element.msRequestFullscreen(); } // IE/Edge
      setIsCinema(true);
    } else {
      if (document.exitFullscreen) { document.exitFullscreen(); }
      setIsCinema(false);
    }
  };

  // Listener untuk mendeteksi jika user keluar fullscreen pakai tombol ESC
  useEffect(() => {
    const handleChange = () => {
      if (!document.fullscreenElement) setIsCinema(false);
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  if (loading) return <div className="loading-screen">Memuat Film...</div>;
  if (!data) return <div className="loading-screen">Film tidak ditemukan :(</div>;

  return (
    <div className={`detail-page ${isCinema ? 'mode-bioskop' : ''}`}>
      
      {/* CSS KHUSUS HALAMAN INI */}
      <style jsx global>{`
        /* Reset */
        body { background: #141414; color: white; margin: 0; overflow-x: hidden; }
        
        /* Layout Dasar */
        .detail-page { min-height: 100vh; padding-top: 80px; transition: 0.3s; }
        
        /* --- MODE BIOSKOP AKTIF (Jurus CSS Overlay) --- */
        .mode-bioskop { padding-top: 0 !important; overflow: hidden; }
        .mode-bioskop .player-wrapper {
          position: fixed !important;
          top: 0; left: 0; width: 100vw !important; height: 100vh !important;
          max-width: none !important; margin: 0 !important;
          z-index: 99999; /* Di atas segalanya */
          background: black;
        }
        .mode-bioskop .iframe-container { height: 100% !important; padding-bottom: 0 !important; }
        .mode-bioskop .controls-bar {
          position: absolute; bottom: 0; left: 0; width: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
          z-index: 100000;
        }
        /* Sembunyikan Navbar saat Mode Bioskop */
        .mode-bioskop ~ nav, body:has(.mode-bioskop) nav { display: none !important; }

        /* --- PLAYER STYLE NORMAL --- */
        .player-wrapper {
          position: relative; width: 100%; max-width: 1200px; margin: 0 auto;
          background: black; border-radius: 8px; overflow: hidden;
          transition: 0.3s;
        }
        .iframe-container { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; }
        .player-frame { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }

        /* Controls */
        .controls-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #1f1f1f; }
        .movie-title { font-size: 18px; font-weight: bold; margin: 0; }
        .btn-cinema {
          background: #E50914; color: white; border: none; padding: 8px 16px; 
          border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; align-items: center; gap: 8px;
        }
        .btn-cinema:hover { background: #b2070f; }

        /* CONTENT BAWAH */
        .content-area { max-width: 1200px; margin: 30px auto; padding: 0 20px; display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        @media (max-width: 768px) { .content-area { grid-template-columns: 1fr; } }
        
        .section-title { font-size: 18px; font-weight: bold; border-left: 4px solid #E50914; padding-left: 10px; margin-bottom: 15px; }
        .synopsis { color: #ccc; line-height: 1.6; margin-bottom: 20px; }
        .tag { background: #333; padding: 4px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px; }
        
        /* EPISODE LIST */
        .episode-box { background: #1f1f1f; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto; }
        .episode-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; }
        .btn-eps { background: #333; color: #ccc; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
        .btn-eps.active { background: #E50914; color: white; }

        .loading-screen { display: flex; height: 100vh; align-items: center; justify-content: center; font-size: 20px; }
      `}</style>

      {/* --- WRAPPER PLAYER (YANG AKAN DI-FULLSCREEN) --- */}
      <div className="player-wrapper" ref={playerContainerRef}>
        <div className="iframe-container">
          <iframe 
            src={activeUrl}
            className="player-frame"
            allowFullScreen={true}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          />
        </div>

        {/* CONTROLS BAR */}
        <div className="controls-bar">
          <div>
            <h1 className="movie-title">{data.title}</h1>
            <div style={{fontSize: '12px', color: '#aaa'}}>{data.year} • {isCinema ? 'Mode Bioskop Aktif' : 'Nonton Yuk!'}</div>
          </div>
          <button className="btn-cinema" onClick={toggleCinemaMode}>
            {isCinema ? '❌ Keluar' : '⛶ Cinema Mode'}
          </button>
        </div>
      </div>

      {/* --- KONTEN BAWAH (HILANG KALAU LAGI FULLSCREEN) --- */}
      {!isCinema && (
        <div className="content-area">
          {/* Kiri: Info */}
          <div>
            <h3 className="section-title">Sinopsis</h3>
            <p className="synopsis">{data.synopsis}</p>
            <div style={{marginBottom: 20}}>
              {data.genres.map((g,i) => <span key={i} className="tag">{g}</span>)}
            </div>
            <h3 className="section-title">Pemeran</h3>
            <p style={{color:'#aaa', fontSize:'14px'}}>{data.cast.join(', ')}</p>
          </div>

          {/* Kanan: Episode */}
          <div>
            {data.episodes && data.episodes.length > 0 ? (
              <div className="episode-box">
                <h3 className="section-title">Pilih Episode</h3>
                <div className="episode-grid">
                  {data.episodes.map(ep => (
                    <button key={ep.episode} onClick={() => changeEpisode(ep)} 
                      className={`btn-eps ${activeEpisode === ep.episode ? 'active' : ''}`}>
                      {ep.episode}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
               <img src={data.thumbnail} style={{width:'100%', borderRadius:'8px', opacity:0.8}} />
            )}
          </div>
        </div>
      )}

    </div>
  );
}