
import React, { useState, useCallback } from 'react';
import { fetchMusicRecommendations } from './services/geminiService';
import { Song } from './types';
import { 
  Play, Search, RefreshCw, Music, Heart, 
  MoreHorizontal, Disc, ListMusic, 
  Share2, Volume2, SkipBack, SkipForward, Shuffle, ArrowRight, Pause
} from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [dailyMessage, setDailyMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState<number>(0);

  const handleRecommend = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!theme.trim()) return;

    setIsLoading(true);
    setError(null);
    setHasStarted(true);

    try {
      const data = await fetchMusicRecommendations(theme);
      setRecommendations(data.songs);
      setDailyMessage(data.dailyMessage);
      setCurrentTrackIdx(0);
    } catch (err) {
      setError('음악 정보를 가져오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  const handleReset = () => {
    setHasStarted(false);
    setTheme('');
    setRecommendations([]);
  };

  const playSong = (link: string, idx: number) => {
    setCurrentTrackIdx(idx);
    window.open(link, '_blank');
  };

  return (
    <div className="min-h-screen bg-white text-[#121212] font-sans selection:bg-indigo-600 selection:text-white pb-32">
      {/* 고감도 미니멀 헤더 */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-2xl px-8 h-20 flex items-center border-b border-slate-50">
        <div className="max-w-screen-xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="w-8 h-8 bg-[#121212] rounded-lg flex items-center justify-center text-white transition-all group-hover:rotate-90">
              <Disc size={16} className={isLoading ? 'animate-spin' : ''} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase italic">Beat.log</span>
          </div>
          
          <div className="flex items-center gap-8">
            <nav className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
              <a href="#" className="text-black border-b-2 border-black pb-1">Listen Now</a>
              <a href="#" className="hover:text-black transition-colors">Browse</a>
              <a href="#" className="hover:text-black transition-colors">Radio</a>
            </nav>
            {hasStarted && (
              <button onClick={() => setHasStarted(false)} className="text-slate-300 hover:text-black transition-colors">
                <Search size={20} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-screen-xl mx-auto px-8 pt-32">
        {!hasStarted ? (
          <section className="animate-in fade-in slide-in-from-bottom-12 duration-1000 py-12">
            <div className="mb-20">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-indigo-500 mb-6">Music Discovery Engine</p>
              <h2 className="text-[4.5rem] md:text-[7rem] font-black leading-[0.9] tracking-tighter mb-12">
                WHAT'S YOUR<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-rose-400">SOUNDTRACK?</span>
              </h2>
            </div>

            <form onSubmit={handleRecommend} className="relative mb-24 max-w-3xl">
              <div className="flex items-center gap-6 border-b-[6px] border-black pb-4 group transition-all focus-within:border-indigo-600">
                <input
                  type="text"
                  placeholder="가수, 장르, 혹은 지금의 기분"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="flex-grow bg-transparent border-none focus:ring-0 py-4 px-0 text-3xl md:text-5xl font-black placeholder:text-slate-100 uppercase tracking-tighter outline-none"
                />
                <button
                  disabled={isLoading || !theme.trim()}
                  className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-xl"
                >
                  <ArrowRight size={32} />
                </button>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {['NewJeans', 'City Pop', 'Day6', 'Rainy Day', 'Morning Calm'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTheme(tag)}
                  className="py-6 px-8 bg-slate-50 rounded-[2rem] text-left hover:bg-black hover:text-white transition-all group"
                >
                  <p className="text-[10px] font-black text-slate-300 group-hover:text-slate-500 uppercase tracking-widest mb-2">Explore</p>
                  <p className="font-black text-lg">#{tag}</p>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <section className="animate-in fade-in duration-1000">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-48">
                <div className="flex gap-1 items-end h-12 mb-10">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className="w-2 bg-black rounded-full animate-bounce" 
                      style={{ animationDelay: `${i * 0.1}s`, height: `${20 + Math.random() * 30}px` }}
                    ></div>
                  ))}
                </div>
                <h3 className="text-2xl font-black tracking-widest uppercase italic animate-pulse">Curating your vibe...</h3>
              </div>
            ) : error ? (
              <div className="p-16 border border-slate-100 rounded-[3rem] text-center max-w-md mx-auto shadow-2xl">
                <p className="text-black font-black mb-8 text-xl uppercase italic">{error}</p>
                <button onClick={handleRecommend} className="w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">Retry Selection</button>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-20">
                {/* 왼쪽: 플레이리스트 정보 카드 */}
                <div className="lg:w-1/3">
                  <div className="sticky top-32 space-y-10">
                    <div className="space-y-4">
                      <div className="w-20 h-1 bg-black"></div>
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">Now Playing Selection</p>
                      <h2 className="text-6xl font-black tracking-tighter uppercase leading-[0.9] break-words">{theme}</h2>
                      <div className="flex items-center gap-4 pt-4">
                        <button onClick={handleRecommend} className="px-6 py-2 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-colors">
                          <RefreshCw size={12} /> Reshuffle
                        </button>
                        <button className="p-2 border border-slate-200 rounded-full text-slate-400 hover:text-rose-500 hover:border-rose-100 transition-all">
                          <Heart size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="p-10 bg-[#FBFBFC] rounded-[3rem] border border-slate-100/50 shadow-inner">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-6 flex items-center gap-2">
                        <ListMusic size={14} /> AI Commentary
                      </p>
                      <p className="text-lg font-bold text-slate-700 leading-relaxed italic break-keep">
                        "{dailyMessage}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* 오른쪽: 트랙 리스트 */}
                <div className="lg:w-2/3">
                  <div className="flex items-center justify-between mb-10 px-4">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">Track</span>
                    <div className="flex gap-8 text-slate-300">
                      <Shuffle size={16} className="cursor-pointer hover:text-black transition-colors" />
                      <Volume2 size={16} className="cursor-pointer hover:text-black transition-colors" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {recommendations.map((song, idx) => (
                      <div
                        key={idx}
                        onClick={() => playSong(song.youtubeLink, idx)}
                        className={`group flex items-center p-6 rounded-[2rem] transition-all duration-500 cursor-pointer border ${currentTrackIdx === idx ? 'bg-indigo-50 border-indigo-100 shadow-xl shadow-indigo-100/20' : 'bg-white border-transparent hover:bg-slate-50'}`}
                      >
                        {/* 번호 및 재생 아이콘 */}
                        <div className="w-16 md:w-20 flex-shrink-0 relative">
                          <span className={`text-4xl md:text-5xl font-black tracking-tighter transition-all duration-500 ${currentTrackIdx === idx ? 'text-indigo-600' : 'text-slate-100 group-hover:text-slate-300'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>

                        <div className="flex-grow pl-4">
                          <div className="flex items-center gap-3 mb-1">
                            <h5 className={`font-black text-xl md:text-2xl tracking-tighter uppercase line-clamp-1 transition-colors ${currentTrackIdx === idx ? 'text-indigo-900' : 'text-slate-900'}`}>
                              {song.title}
                            </h5>
                          </div>
                          <p className="text-base font-bold text-slate-400 group-hover:text-indigo-500 transition-colors">{song.artist}</p>
                        </div>

                        <div className="flex items-center gap-6">
                           <div className="hidden md:block text-right">
                             <span className={`text-[9px] font-black px-2 py-1 rounded-md border ${song.isKorean ? 'border-indigo-200 text-indigo-400' : 'border-slate-200 text-slate-300'}`}>
                               {song.isKorean ? 'KOR' : 'INT'}
                             </span>
                           </div>
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentTrackIdx === idx ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-100 text-slate-300 group-hover:bg-black group-hover:text-white group-hover:scale-110'}`}>
                             {currentTrackIdx === idx ? <Pause fill="white" size={18} /> : <Play fill="currentColor" size={18} className="ml-0.5" />}
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-16 p-8 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">End of selection</p>
                    <button onClick={handleRecommend} className="text-xs font-black uppercase tracking-widest hover:text-indigo-600 flex items-center gap-2">
                      Get More <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* 하단 고정 스트리밍 바 (Apple Music Style) */}
      {hasStarted && !isLoading && !error && (
        <footer className="fixed bottom-0 left-0 right-0 z-[60] px-8 pb-8 pointer-events-none">
          <div className="max-w-screen-md mx-auto bg-white/80 backdrop-blur-3xl p-4 pr-8 rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-white flex items-center justify-between pointer-events-auto ring-1 ring-slate-100">
            <div className="flex items-center gap-5 flex-grow max-w-[280px]">
              <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-xl flex-shrink-0 animate-spin-slow">
                <Disc size={24} />
              </div>
              <div className="overflow-hidden">
                <p className="font-black text-sm text-slate-900 truncate tracking-tight">{recommendations[currentTrackIdx]?.title}</p>
                <p className="text-[10px] text-indigo-500 font-black uppercase tracking-widest truncate">{recommendations[currentTrackIdx]?.artist}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-8 md:gap-12 px-4">
              <SkipBack size={20} className="text-slate-300 hover:text-black cursor-pointer transition-colors" />
              <button 
                onClick={() => window.open(recommendations[currentTrackIdx]?.youtubeLink, '_blank')}
                className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-105 active:scale-95 transition-all"
              >
                <Pause fill="white" size={20} />
              </button>
              <SkipForward size={20} className="text-slate-300 hover:text-black cursor-pointer transition-colors" />
            </div>

            <div className="hidden md:flex gap-6 items-center">
              <Share2 size={18} className="text-slate-300 hover:text-black cursor-pointer" />
              <div className="w-px h-6 bg-slate-100"></div>
              <Volume2 size={18} className="text-slate-300 hover:text-black cursor-pointer" />
            </div>
          </div>
        </footer>
      )}

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        body {
          -webkit-font-smoothing: antialiased;
          background-color: #ffffff;
        }
        * {
          transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
        }
        ::-webkit-scrollbar {
          width: 0px;
        }
      `}</style>
    </div>
  );
};

export default App;
