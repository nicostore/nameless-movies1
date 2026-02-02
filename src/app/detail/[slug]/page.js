"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import './detail.css'; // Impor file CSS terpisah

export default function DetailPage() {
  const params = useParams();
  // Di V3, 'detailPath' adalah slug-nya
  const detailPath = params?.slug; 

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeUrl, setActiveUrl] = useState('');
  const [activeEpisode, setActiveEpisode] = useState(1);
  const [isCinema, setIsCinema] = useState(false);
  
  const playerContainerRef = useRef(null);

  useEffect(() => {
    if (!detailPath) return;

    const fetchData = async () => {
      try {
        // Fetch API V3 menggunakan parameter detailPath
        const res = await fetch(`https://zeldvorik.ru/apiv3/api.php?action=detail&detailPath=${detailPath}`);
        const json = await res.json();

        // API V3 biasanya mengembalikan objek langsung atau dalam properti 'data'/'item'
        // Kita buat logic yang fleksibel
        const result = json.data || json.item || json;

        if (result) {
          setData(result);
          
          // Cek episode (Series) vs Movie
          if (result.episodes && result.episodes.length > 0) {
            setActiveUrl(result.episodes[0].player_url || result.episodes[0].url);
            setActiveEpisode(1);
          } else {
            setActiveUrl(result.player_url || result.video_url);
          }
        }
      } catch (error) {
        console.error("Error fetching detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [detailPath]);

  const changeEpisode = (episode) => {
    setActiveUrl(episode.player_url || episode.url);
    setActiveEpisode(episode.episode);
  };

  const toggleCinemaMode = () => {
    const element = playerContainerRef.current;
    if (!document.fullscreenElement) {
      if (element.requestFullscreen) element.requestFullscreen().catch(err => console.log(err));
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      setIsCinema(true);
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      setIsCinema(false);
    }
  };

  // Efek untuk mengelola class pada body untuk Cinema Mode
  useEffect(() => {
    const handleChange = () => { if (!document.fullscreenElement) setIsCinema(false); };
    document.addEventListener('fullscreenchange', handleChange);

    if (isCinema) {
      document.body.classList.add('cinema-active');
    } else {
      document.body.classList.remove('cinema-active');
    }

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.body.classList.remove('cinema-active'); // Cleanup saat komponen unmount
    };
  }, [isCinema]);

  if (loading) return <div className="loading-screen">Memuat Film...</div>;
  if (!data) return <div className="loading-screen">Film tidak ditemukan :(</div>;

  return (
    <div className={`detail-page ${isCinema ? 'mode-bioskop' : ''}`}>
      <div className="player-wrapper" ref={playerContainerRef}>
        <div className="iframe-container">
          <iframe 
            src={activeUrl} // Gunakan activeUrl sebagai sumber video
            className="player-frame" // Terapkan styling untuk iframe
            allowFullScreen={true} // Izinkan mode layar penuh
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture" // Izin untuk iframe
          />
          {!activeUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black text-white text-lg">
              Video tidak tersedia.
            </div>
          )}
        </div>
        <div className="controls-bar">
          <div>
            <h1 className="movie-title">{data.title}</h1>
            <div style={{fontSize: '12px', color: '#aaa'}}>{data.year} • {data.type || 'Movie'}</div>
          </div>
          <button className="btn-cinema" onClick={toggleCinemaMode}>
            {isCinema ? '❌ Keluar' : '⛶ Cinema Mode'}
          </button>
        </div>
      </div>

      {!isCinema && (
        <div className="content-area">
          <div>
            <h3 className="section-title">Sinopsis</h3>
            <p className="synopsis">{data.synopsis}</p>
            
            {data.genres && (
               <div style={{marginBottom: 20}}>
                 {Array.isArray(data.genres) 
                   ? data.genres.map((g,i) => <span key={i} className="tag">{g}</span>)
                   : <span className="tag">{data.genres}</span>
                 }
               </div>
            )}
            
            {data.cast && (
              <>
                <h3 className="section-title">Pemeran</h3>
                <p style={{ color: '#aaa', fontSize: '14px' }}>
                  {Array.isArray(data.cast)
                    ? data.cast.map(actor => (typeof actor === 'object' && actor !== null ? actor.name : actor)).filter(Boolean).join(', ')
                    : data.cast}
                </p>
              </>
            )}
          </div>

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
               <img src={data.poster || data.thumbnail} style={{width:'100%', borderRadius:'8px', opacity:0.8}} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}