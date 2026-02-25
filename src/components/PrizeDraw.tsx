import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Gift, Play, Square, RotateCcw, Settings2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

export default function PrizeDraw() {
  const { names } = useAppContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentName, setCurrentName] = useState<string>('???');
  const [winners, setWinners] = useState<string[]>([]);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  
  const intervalRef = useRef<number | null>(null);

  const availableNames = allowRepeat 
    ? names 
    : names.filter(name => !winners.includes(name));

  const startDraw = () => {
    if (availableNames.length === 0) {
      return;
    }
    
    setIsDrawing(true);
    
    // Rapidly cycle through names
    intervalRef.current = window.setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableNames.length);
      setCurrentName(availableNames[randomIndex]);
    }, 50); // Fast interval for excitement
  };

  const stopDraw = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsDrawing(false);
    
    if (availableNames.length > 0) {
      // Pick the final winner
      const finalIndex = Math.floor(Math.random() * availableNames.length);
      const winner = availableNames[finalIndex];
      setCurrentName(winner);
      setWinners(prev => [winner, ...prev]);
      
      // Trigger confetti
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4f46e5', '#818cf8', '#c7d2fe']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4f46e5', '#818cf8', '#c7d2fe']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const clearWinners = () => {
    setWinners([]);
    setCurrentName('???');
    setIsConfirmingClear(false);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-white flex justify-between items-center shadow-sm z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-indigo-600" />
            奖品抽签
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            随机抽取幸运儿，可设置是否允许重复中奖
          </p>
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
            title="设置"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 p-4 z-20"
              >
                <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b pb-2">抽奖设置</h3>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={allowRepeat}
                      onChange={(e) => setAllowRepeat(e.target.checked)}
                    />
                    <div className={`block w-10 h-6 rounded-full transition-colors ${allowRepeat ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${allowRepeat ? 'transform translate-x-4' : ''}`}></div>
                  </div>
                  <div className="text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">
                    允许重复中奖
                  </div>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-13">
                  开启后，同一个人可以多次中奖。
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Draw Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
          
          {/* Decorative background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative z-10 w-full max-w-2xl">
            <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-12 text-center overflow-hidden relative">
              
              {/* Inner subtle glow */}
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(79,70,229,0.05)] pointer-events-none"></div>

              <div className="mb-4 text-sm font-medium text-indigo-500 uppercase tracking-widest">
                {isDrawing ? '正在抽取...' : '幸运名单'}
              </div>
              
              <div className="h-40 flex items-center justify-center mb-12">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={currentName}
                    initial={isDrawing ? { opacity: 0, y: 20, scale: 0.9 } : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={isDrawing ? { opacity: 0, y: -20, scale: 0.9 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: isDrawing ? 0.1 : 0.5, type: isDrawing ? 'tween' : 'spring' }}
                    className={`text-6xl md:text-8xl font-black tracking-tight ${
                      isDrawing ? 'text-gray-300' : currentName === '???' ? 'text-gray-200' : 'text-indigo-600'
                    }`}
                    style={{ textShadow: !isDrawing && currentName !== '???' ? '0 10px 30px rgba(79,70,229,0.2)' : 'none' }}
                  >
                    {currentName}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex justify-center gap-4">
                {!isDrawing ? (
                  <button
                    onClick={startDraw}
                    disabled={availableNames.length === 0}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-lg hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <Play className="w-6 h-6 fill-current" />
                    <span className="relative">开始抽奖</span>
                  </button>
                ) : (
                  <button
                    onClick={stopDraw}
                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-rose-500 text-white rounded-full font-bold text-lg hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 transition-all overflow-hidden"
                  >
                    <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
                    <Square className="w-6 h-6 fill-current" />
                    <span className="relative">停！</span>
                  </button>
                )}
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                奖池剩余人数: <span className="font-bold text-indigo-600">{availableNames.length}</span> / {names.length}
              </div>
            </div>
          </div>
        </div>

        {/* Winners Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                {winners.length}
              </span>
              中奖名单
            </h3>
            {winners.length > 0 && (
              isConfirmingClear ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">确定清空?</span>
                  <button onClick={clearWinners} className="text-xs text-red-600 hover:text-red-700 font-medium">确定</button>
                  <button onClick={() => setIsConfirmingClear(false)} className="text-xs text-gray-500 hover:text-gray-700">取消</button>
                </div>
              ) : (
                <button
                  onClick={() => setIsConfirmingClear(true)}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  重置
                </button>
              )
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {winners.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <Gift className="w-12 h-12 opacity-20" />
                <p className="text-sm">暂无中奖记录</p>
              </div>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence initial={false}>
                  {winners.map((winner, index) => (
                    <motion.li
                      key={`${winner}-${index}`}
                      initial={{ opacity: 0, x: 20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      className="bg-gradient-to-r from-indigo-50 to-white border border-indigo-100 rounded-lg p-3 flex items-center gap-3 shadow-sm"
                    >
                      <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                        {winners.length - index}
                      </div>
                      <span className="font-medium text-gray-800 truncate">{winner}</span>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
