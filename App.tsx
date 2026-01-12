
import React, { useState, useCallback } from 'react';
import { fetchMusicRecommendations } from './services/geminiService';
import { Song } from './types';
import { Music, RefreshCw, ExternalLink, Play, Search, Loader2, ChevronRight, Headphones } from 'lucide-react';

const App: React.FC = () => {
  const [theme, setTheme] = useState<string>('');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [dailyMessage, setDailyMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState<boolean>(false);

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
    } catch (err) {
      console.error(err);
      setError('음악을 불러오는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  }, [theme]);

  const handleReset = () => {
    setHasStarted(false);
    setTheme('');
    setRecommendations([]);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100/60">
        <div className="max-w-xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleReset}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 ring-4 ring-white">
              <Headphones size={22} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                CommuteMelody
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Curation</p>
            </div>
          </div>
          {hasStarted && !isLoading && (
            <button 
              onClick={handleRecommend}
              className="p-2.5 text-indigo-600 bg-indigo-50 rounded-full hover:bg-indigo-100 transition-colors"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-6 py-8">
        {!hasStarted ? (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="relative mb-12 py-10 px-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-200">
              <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative z-10 text-white">
                <h2 className="text-3xl font-black leading-tight mb-4">
                  지루한 출퇴근길을<br/>영화처럼 만드세요
                </h2>
                <p className="text-indigo-100 text-sm font-medium opacity-90 leading-relaxed">
                  원하는 감정이나 장르를 적어주시면<br/>
                  최적의 플레이리스트 7곡을 선곡합니다.
                </p>
              </div>
            </div>

            <form onSubmit={handleRecommend} className="space-y-6">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="예: 퇴근길 위로가 되는 선율"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent rounded-[2rem] focus:outline-none focus:bg-white focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/10 transition-all text-lg font-medium placeholder:text-slate-300"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !theme.trim()}
                className="w-full py-5 bg-slate-900 text-white font-bold rounded-[2rem] hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
              >
                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Play fill="currentColor" size={18} />}
                플레이리스트 생성하기
              </button>
            </form>

            <div className="mt-12">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2">인기 테마</h3>
              <div className="grid grid-cols-2 gap-3">
                {['몽환적인 시티팝', '따뜻한 어쿠스틱', '비 오는 날의 재즈', '파워풀한 출근길'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setTheme(tag)}
                    className="p-4 text-left bg-slate-50 rounded-2xl hover:bg-indigo-50 hover:text-indigo-700 border border-slate-100 transition-all font-semibold text-slate-600"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                  <Music className="absolute inset-0 m-auto text-indigo-600" size={28} />
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-black text-xl mb-1">감성을 분석하고 있어요</p>
                  <p className="text-slate-400 font-medium">잠시만 기다려주세요...</p>
                </div>
              </div>
            ) : error ? (
              <div className="p-8 bg-red-50 border border-red-100 rounded-[2rem] text-center">
                <p className="text-red-600 font-bold mb-4">{error}</p>
                <button
                  onClick={handleRecommend}
                  className="px-8 py-3 bg-red-600 text-white rounded-2xl font-bold shadow-lg shadow-red-100 transition-transform active:scale-95"
                >
                  다시 시도하기
                </button>
              </div>
            ) : (
              <>
                <div className="relative p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100 overflow-hidden">
                   <div className="absolute bottom-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
                   <div className="relative z-10">
                    <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-[10px] font-black rounded-lg mb-4 uppercase tracking-[0.2em]">Playlist Cover</span>
                    <h3 className="text-2xl font-black text-white mb-2">{theme}</h3>
                    <p className="text-indigo-200/70 leading-relaxed font-medium text-sm">
                      {dailyMessage}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between px-2 mb-2">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">7개의 선곡</h4>
                    <span className="text-[10px] font-bold text-indigo-500 px-2 py-0.5 bg-indigo-50 rounded-full">KR 70% : INT 30%</span>
                  </div>
                  {recommendations.map((song, idx) => (
                    <a
                      key={`${song.title}-${idx}`}
                      href={song.youtubeLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center p-4 bg-white hover:bg-slate-50 border border-slate-100 rounded-3xl transition-all active:scale-[0.98] relative"
                    >
                      <div className="relative w-14 h-14 flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center overflow-hidden">
                        <Music className="text-slate-400 group-hover:scale-110 transition-transform" size={24} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                           <Play size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" />
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-grow">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="font-extrabold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">{song.title}</h4>
                          {song.isKorean ? (
                            <span className="text-[8px] px-1.5 py-0.5 bg-indigo-50 text-indigo-500 font-black rounded border border-indigo-100">K-MUSIC</span>
                          ) : (
                            <span className="text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-600 font-black rounded border border-amber-100">GLOBAL</span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-slate-500">{song.artist}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-medium italic">"{song.reason}"</p>
                      </div>

                      <div className="ml-2 p-2 rounded-full bg-slate-50 text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50 transition-all">
                        <ChevronRight size={20} />
                      </div>
                    </a>
                  ))}
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                  <button
                    onClick={handleRecommend}
                    className="py-5 bg-indigo-600 text-white font-black rounded-[2rem] hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-100"
                  >
                    <RefreshCw size={20} />
                    다시 추천
                  </button>
                  <button
                    onClick={handleReset}
                    className="py-5 bg-slate-100 text-slate-900 font-black rounded-[2rem] hover:bg-slate-200 active:scale-[0.98] transition-all"
                  >
                    홈으로
                  </button>
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="max-w-xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Curation Engine v2.5</span>
        </div>
        <p className="text-slate-300 text-[11px] font-bold">© 2024 COMMUTEMELODY DESIGN SYSTEMS. EVERYDAY COMMUTE REDEFINED.</p>
      </footer>
    </div>
  );
};

export default App;
