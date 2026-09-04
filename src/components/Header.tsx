import React from 'react';
import { ScreenTab } from '../types';
import { ASSETS } from '../data/radioData';

interface HeaderProps {
  activeTab: ScreenTab;
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onOpenSettings,
  onOpenProfile,
}) => {
  const getTabSubtitle = () => {
    switch (activeTab) {
      case 'tuner':
        return 'Tuner';
      case 'explore':
        return 'Explore';
      case 'schedule':
        return 'Schedule';
      case 'library':
        return 'Library';
      default:
        return 'Tuner';
    }
  };

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-[#101419]/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.4)] border-b border-white/[0.04]">
      <div className="max-w-md mx-auto h-16 px-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            alt="WaveFM Logo"
            className="h-8 w-auto object-contain cursor-pointer"
            src={ASSETS.logo}
          />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-['Sora'] text-[16px] leading-6 font-semibold tracking-tight text-[#e0e2ea] uppercase">
                WaveFM
              </span>
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#31353b]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] animate-ping" />
                <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#00e297] font-bold tracking-wider">
                  LIVE
                </span>
              </div>
            </div>
            <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#e1bfb5] truncate max-w-[120px]">
              {getTabSubtitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSettings}
            className="w-11 h-11 flex items-center justify-center text-[#e1bfb5] hover:text-[#e0e2ea] active:scale-95 transition-all rounded-full hover:bg-[#1c2025]"
            title="Audio Hardware & DSP Settings"
            aria-label="DSP and Audio Settings"
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
          </button>
          <button
            onClick={onOpenProfile}
            className="relative rounded-full focus:outline-none focus:ring-2 focus:ring-[#ff6b35]/60 active:scale-95 transition-transform"
            title="Audiophile Profile"
            aria-label="Audiophile Profile"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-[#31353b]"
              src={ASSETS.avatar}
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#00e297] ring-2 ring-[#101419]" />
          </button>
        </div>
      </div>
    </header>
  );
};
