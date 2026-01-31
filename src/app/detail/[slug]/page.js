"use client";
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';

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

  useEffect(() => {
    const handleChange = () => { if (!document.fullscreenElement) setIsCinema(false); };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  if (loading) return <div className="loading-screen">Memuat Film...</div>;
  if (!data) return <div className="loading-screen">Film tidak ditemukan :(</div>;

  return (
    <div className={`detail-page ${isCinema ? 'mode-bioskop' : ''}`}>
      <style jsx global>{`
        body { background: #141414; color: white; margin: 0; overflow-x: hidden; }
        .detail-page { min-height: 100vh; padding-top: 80px; transition: 0.3s; }
        
        .mode-bioskop { padding-top: 0 !important; overflow: hidden; }
        .mode-bioskop .player-wrapper {
          position: fixed !important; top: 0; left: 0; width: 100vw !important; height: 100vh !important;
          max-width: none !important; margin: 0 !important; z-index: 99999; background: black;
        }
        .mode-bioskop .iframe-container { height: 100% !important; padding-bottom: 0 !important; }
        .mode-bioskop ~ nav, body:has(.mode-bioskop) nav { display: none !important; }

        .player-wrapper { position: relative; width: 100%; max-width: 1200px; margin: 0 auto; background: black; border-radius: 8px; overflow: hidden; }
        .iframe-container { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; }
        .player-frame { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
        
        .controls-bar { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #1f1f1f; }
        .movie-title { font-size: 18px; font-weight: bold; margin: 0; }
        .btn-cinema { background: #E50914; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
        
        .content-area { max-width: 1200px; margin: 30px auto; padding: 0 20px; display: grid; grid-template-columns: 2fr 1fr; gap: 30px; }
        @media (max-width: 768px) { .content-area { grid-template-columns: 1fr; } }
        
        .section-title { font-size: 18px; font-weight: bold; border-left: 4px solid #E50914; padding-left: 10px; margin-bottom: 15px; }
        .synopsis { color: #ccc; line-height: 1.6; margin-bottom: 20px; }
        .tag { background: #333; padding: 4px 10px; border-radius: 15px; font-size: 12px; margin-right: 5px; display: inline-block; margin-bottom: 5px;}
        
        .episode-box { background: #1f1f1f; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto; }
        .episode-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(50px, 1fr)); gap: 8px; }
        .btn-eps { background: #333; color: #ccc; border: none; padding: 10px; border-radius: 4px; cursor: pointer; }
        .btn-eps.active { background: #E50914; color: white; }
        
        .loading-screen { display: flex; height: 100vh; align-items: center; justify-content: center; font-size: 20px; }
      `}</style>

      <div className="player-wrapper" ref={playerContainerRef}>
        <div className="iframe-container">
          <iframe 
            src={activeUrl}
            className="player-frame"
            allowFullScreen={true}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          />
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
                <p style={{color:'#aaa', fontSize:'14px'}}>
                  {Array.isArray(data.cast) ? data.cast.join(', ') : data.cast}
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