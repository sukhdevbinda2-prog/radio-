import React from 'react';
import { Station } from '../types';

interface BottomPlayerProps {
  currentStation: Station;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onOpenTuner: () => void;
}

export const BottomPlayer: React.FC<BottomPlayerProps> = ({
  currentStation,
  isPlaying,
  onTogglePlay,
  isFavorite,
  onToggleFavorite,
  onOpenTuner,
}) => {
  return (
    <div className="px-5 pt-2">
      <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-[#262a30]/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)] border border-white/[0.04]">
        <div
          className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          onClick={onOpenTuner}
          title="Open Tuner Deck"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1c2025] flex items-center justify-center text-[#ffb59d] relative overflow-hidden shrink-0">
            <span className="material-symbols-outlined text-[20px]">sensors</span>
            <span
              className={`absolute bottom-0 inset-x-0 h-0.5 bg-[#ff6b35] ${
                isPlaying ? 'animate-pulse' : 'opacity-40'
              }`}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-['Space_Mono'] text-[14px] leading-[18px] font-bold text-[#e0e2ea] truncate tracking-[0.04em]">
              {currentStation.frequencyDisplay} FM • {currentStation.name.toUpperCase().replace(/\s+/g, '_')}
            </span>
            <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#00e297] truncate flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] inline-block animate-ping" />
              STEREO LOCK -9dB
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            className="w-11 h-11 flex items-center justify-center text-[#e1bfb5] hover:text-[#ff6b35] active:scale-90 transition-colors"
            title={isFavorite ? 'Favorited' : 'Add to Favorites'}
            aria-label="Toggle Favorite Station"
          >
            <span
              className="material-symbols-outlined text-[22px] transition-transform"
              style={{
                fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                color: isFavorite ? '#ff6b35' : undefined,
              }}
            >
              {isFavorite ? 'favorite' : 'favorite_border'}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlay();
            }}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)] active:scale-95 hover:brightness-110 transition-all"
            title={isPlaying ? 'Pause' : 'Play Live Broadcast'}
            aria-label="Play or Pause Stream"
          >
            <span
              className="material-symbols-outlined text-[20px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
