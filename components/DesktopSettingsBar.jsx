"use client";
import { useState, useEffect } from "react";

export default function DesktopSettingsBar() {
  const [isDesktop, setIsDesktop] = useState(false);
  const [opacity, setOpacity] = useState(1.0);
  const [alwaysOnTop, setAlwaysOnTop] = useState(false);
  const [clickThrough, setClickThrough] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.crackDesktopAPI) {
      setIsDesktop(true);
      // Initialize defaults
      window.crackDesktopAPI.setAlwaysOnTop(alwaysOnTop);
    }
  }, []);

  if (!isDesktop) return null; // Only show in Electron wrapper

  const handleOpacityChange = (e) => {
    const val = parseFloat(e.target.value);
    setOpacity(val);
    window.crackDesktopAPI.setOpacity(val);
  };

  const toggleAlwaysOnTop = () => {
    const newVal = !alwaysOnTop;
    setAlwaysOnTop(newVal);
    window.crackDesktopAPI.setAlwaysOnTop(newVal);
  };

  const toggleClickThrough = () => {
    const newVal = !clickThrough;
    setClickThrough(newVal);
    window.crackDesktopAPI.setIgnoreMouseEvents(newVal);
    if (newVal) {
      alert("Click-Through Mode Enabled!\n\nYou can no longer click anything in this application window until you turn it off via Hotkeys (or restart).");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[10000] flex items-center justify-between px-4" 
         style={{ height: '36px', background: 'rgba(8, 3, 14, 0.9)', backdropFilter: 'blur(20px)', WebkitAppRegion: 'drag' }}>
      
      <div className="text-white text-xs font-semibold select-none flex items-center gap-2">
         🔮 CrackAI Native Wrapper
      </div>

      <div style={{ WebkitAppRegion: 'no-drag' }} className="relative">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded transition"
        >
          ⚙️ Settings
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 top-[30px] w-48 bg-[#141414] border border-white/10 shadow-2xl rounded-lg p-3 flex flex-col gap-3 text-xs text-white select-none">
            
            <div className="flex flex-col gap-1">
               <div className="flex justify-between">
                 <span>Opacity</span>
                 <span>{Math.round(opacity * 100)}%</span>
               </div>
               <input 
                 type="range" min="0.1" max="1.0" step="0.05"
                 value={opacity}
                 onChange={handleOpacityChange}
                 className="w-full accent-purple-500"
               />
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span>Always On Top</span>
              <input 
                type="checkbox" 
                checked={alwaysOnTop}
                onChange={toggleAlwaysOnTop}
                className="accent-purple-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-red-400 font-medium">Click-Through</span>
              <input 
                type="checkbox" 
                checked={clickThrough}
                onChange={toggleClickThrough}
                className="accent-red-500 w-4 h-4 cursor-pointer"
              />
            </label>

          </div>
        )}
      </div>

    </div>
  );
}
