import React from 'react';
import { ASSETS } from '../data/radioData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c2025] rounded-2xl p-5 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb86f] text-[20px]">person</span>
            <h3 className="font-['Sora'] text-[18px] text-[#e0e2ea] font-semibold">
              Audiophile Profile
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a30] text-[#e1bfb5] hover:text-[#e0e2ea] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#262a30] border border-white/[0.04]">
          <div className="relative">
            <img
              src={ASSETS.avatar}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#ff6b35]"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#00e297] ring-2 ring-[#1c2025]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-['Sora'] text-[16px] text-[#e0e2ea] font-bold truncate">
              Julian Mercer
            </h4>
            <p className="font-['Space_Mono'] text-[11px] text-[#ffb86f] truncate">
              MASTER BROADCAST TIER
            </p>
            <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] block mt-0.5">
              Listening Member since 2021
            </span>
          </div>
        </div>

        {/* Telemetry Snapshot */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-xl bg-[#262a30] border border-white/[0.03]">
            <span className="font-['Space_Mono'] text-[18px] text-[#ffb59d] font-bold block">
              1,248
            </span>
            <span className="font-['Space_Mono'] text-[9px] text-[#e1bfb5] uppercase">
              Total Hours
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#262a30] border border-white/[0.03]">
            <span className="font-['Space_Mono'] text-[18px] text-[#00e297] font-bold block">
              342
            </span>
            <span className="font-['Space_Mono'] text-[9px] text-[#e1bfb5] uppercase">
              Tracks Saved
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#262a30] border border-white/[0.03]">
            <span className="font-['Space_Mono'] text-[18px] text-[#ffb86f] font-bold block">
              14
            </span>
            <span className="font-['Space_Mono'] text-[9px] text-[#e1bfb5] uppercase">
              Day Streak
            </span>
          </div>
        </div>

        {/* Radio Preferences */}
        <div className="flex flex-col gap-2">
          <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] uppercase tracking-wider">
            Connected Services
          </span>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#262a30] text-[13px] font-['Inter'] text-[#e0e2ea]">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#00e297]">spotify</span>
              Spotify Scrobble Sync
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#00e297]">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#262a30] text-[13px] font-['Inter'] text-[#e0e2ea]">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px] text-[#ff6b35]">broadcast_on_home</span>
              AirPlay / Cast Hub
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#ffb86f]">READY</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#262a30] hover:bg-[#31353b] text-[#e0e2ea] font-['Sora'] text-[14px] font-semibold transition-all mt-1 border border-white/[0.05]"
        >
          Close
        </button>
      </div>
    </div>
  );
};
