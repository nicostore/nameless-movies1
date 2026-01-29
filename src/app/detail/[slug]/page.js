"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

export default function DetailPage() {
  // Hook Next.js 15 untuk ambil slug
  const params = useParams();
  const slug = params?.slug; 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState('');
  const [activeEpisode, setActiveEpisode] = useState(1);
  
  // Ref untuk mengontrol elemen player agar bisa dipaksa fullscreen
  const playerRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`https://zeldvorik.ru/rebahin21/api.php?action=detail&slug=${slug}`);
        const json = await res.json();

        if (json.success && json.data) {
          setData(json.data);
          // Cek apakah Series atau Film
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

  // Fungsi untuk Memaksa Browser Masuk Mode Fullscreen (Cinema Mode Real)
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      playerRef.current?.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  if (loading) return <div className="loading-screen">Memuat Film...</div>;
  if (!data) return <div className="loading-screen">Film tidak ditemukan :(</div>;

  return (
    <div className="detail-container">
      
      {/* CSS MANUAL (NETFLIX STYLE) */}
      <style jsx global>{`
        /* Reset & Base */
        body { margin: 0; background-color: #141414; color: white; font-family: sans-serif; }
        
        /* Container Utama (Padding top agar tidak ketutup navbar) */
        .detail-container { min-height: 100vh; padding-top: 80px; }
        
        /* PLAYER AREA */
        .player-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px; /* Batas lebar player di desktop */
          margin: 0 auto;
          background: #000;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          border-radius: 8px;
          overflow: hidden;
        }

        /* IFRAME WAJIB ASPEK RATIO 16:9 */
        .iframe-container {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
        }
        
        .player-frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
          z-index: 10; /* Pastikan Iframe di atas segalanya agar bisa diklik */
        }

        /* Controls Bar (Judul & Tombol Cinema) */
        .controls-bar {
          display: flex; justify-content: space-between; align-items: center;
          padding: 15px 20px; background: #1f1f1f;
        }
        
        h1 { margin: 0; font-size: 20px; font-weight: bold; color: white; }
        .meta-info { color: #aaa; font-size: 14px; margin-top: 5px; }
        
        .btn-cinema {
          background: #333; color: white; border: 1px solid #555;
          padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold;
          transition: 0.3s;
        }
        .btn-cinema:hover { background: #E50914; border-color: #E50914; }

        /* DETAIL CONTENT (Bawah Player) */
        .content-grid {
          display: grid; grid-template-columns: 2fr 1fr; gap: 30px;
          max-width: 1200px; margin: 30px auto; padding: 0 20px;
        }
        @media (max-width: 768px) { 
          .content-grid { grid-template-columns: 1fr; } 
          h1 { font-size: 16px; }
        }

        .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #E50914; padding-left: 10px; color: white; }
        .synopsis { line-height: 1.6; color: #ccc; margin-bottom: 20px; font-size: 15px; }
        
        /* TAGS & CAST */
        .tag { display: inline-block; background: #333; color: #ddd; padding: 5px 12px; border-radius: 20px; font-size: 12px; margin-right: 8px; margin-bottom: 8px; }
        .cast-item { display: inline-block; background: #1f1f1f; padding: 5px 12px; border-radius: 4px; font-size: 13px; color: #aaa; margin-right: 8px; margin-bottom: 8px; border: 1px solid #333; }

        /* EPISODE LIST */
        .episode-box { background: #1f1f1f; padding: 20px; border-radius: 8px; max-height: 400px; overflow-y: auto; }
        .episode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 10px; }
        .btn-episode {
          aspect-ratio: 1/1; background: #333; color: #ccc; border: none; 
          border-radius: 4px; cursor: pointer; font-weight: bold; transition: 0.2s;
        }
        .btn-episode.active { background: #E50914; color: white; transform: scale(1.1); }
        .btn-episode:hover:not(.active) { background: #555; }

        .loading-screen { display: flex; height: 100vh; align-items: center; justify-content: center; background: #141414; color: white; font-size: 20px; }
        
        /* Scrollbar Bagus */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #141414; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #E50914; }
      `}</style>

      {/* --- PLAYER SECTION --- */}
      <div className="player-wrapper" ref={playerRef}>
        <div className="iframe-container">
          <iframe 
            src={activeUrl}
            className="player-frame"
            allowFullScreen={true} // React Prop
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture" // Standard HTML
            title="Video Player"
          />
        </div>
        
        {/* Judul & Tombol Fullscreen Custom */}
        <div className="controls-bar">
          <div>
            <h1>{data.title}</h1>
            <div className="meta-info">{data.year} • ⭐ {data.rating} • {data.duration || 'HD'}</div>
          </div>
          <button className="btn-cinema" onClick={toggleFullscreen}>
            ⛶ Fullscreen
          </button>
        </div>
      </div>

      {/* --- DETAIL INFO --- */}
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
          <div>
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
              <img src={data.thumbnail} style={{ width: '100%', borderRadius: '8px', opacity: 0.7 }} alt="Poster" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}