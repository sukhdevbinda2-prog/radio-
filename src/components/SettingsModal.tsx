import React from 'react';
import { EqProfile } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: EqProfile;
  onSelectProfile: (p: EqProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-[#1c2025] rounded-2xl p-5 border border-white/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.8)] flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff6b35] text-[22px]">tune</span>
            <h3 className="font-['Sora'] text-[18px] text-[#e0e2ea] font-semibold">
              Audio Hardware & DSP
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#262a30] text-[#e1bfb5] hover:text-[#e0e2ea] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Receiver Sensitivity & AGC */}
        <div className="flex flex-col gap-2">
          <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] uppercase tracking-wider">
            RF Front-End Parameters
          </span>
          <div className="p-3 rounded-xl bg-[#262a30] flex flex-col gap-2 border border-white/[0.03]">
            <div className="flex justify-between items-center text-[13px] font-['Inter'] text-[#e0e2ea]">
              <span>Automatic Gain Control (AGC)</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#00e297] font-bold">HI (+18dB)</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-['Inter'] text-[#e0e2ea]">
              <span>Intermediate Frequency (IF)</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#ffb86f]">10.7 MHz</span>
            </div>
            <div className="flex justify-between items-center text-[13px] font-['Inter'] text-[#e0e2ea]">
              <span>Stereo Demodulation Threshold</span>
              <span className="font-['Space_Mono'] text-[11px] text-[#00e297]">-9 dB</span>
            </div>
          </div>
        </div>

        {/* DSP Acoustic Valve Profile */}
        <div className="flex flex-col gap-2">
          <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] uppercase tracking-wider">
            Active DSP Valve Stage
          </span>
          <div className="grid grid-cols-2 gap-2">
            {(['Warm Analog Tube', 'Crisp Vocal Voice', 'Bass Boost (+6dB)', 'Flat Studio Ref'] as EqProfile[]).map((p) => (
              <button
                key={p}
                onClick={() => onSelectProfile(p)}
                className={`p-2 rounded-lg text-left text-[12px] font-['Sora'] transition-all ${
                  currentProfile === p
                    ? 'bg-[#ff6b35] text-[#5d1900] font-bold shadow-[0_0_12px_rgba(255,107,53,0.3)]'
                    : 'bg-[#262a30] text-[#e1bfb5] hover:text-[#e0e2ea]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Buffer & Bitrate */}
        <div className="p-3 rounded-xl bg-[#262a30] flex items-center justify-between border border-white/[0.03]">
          <div className="flex flex-col">
            <span className="text-[13px] font-['Inter'] text-[#e0e2ea] font-semibold">
              Stream Buffer Engine
            </span>
            <span className="text-[11px] font-['Space_Mono'] text-[#e1bfb5]">
              Low Latency (120ms Jitter)
            </span>
          </div>
          <span className="font-['Space_Mono'] text-[11px] text-[#00e297] bg-[#00af74]/20 px-2 py-1 rounded">
            OPTIMAL
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#ff6b35] text-[#5d1900] font-['Sora'] text-[14px] font-bold shadow-[0_0_16px_rgba(255,107,53,0.35)] active:scale-95 transition-all mt-1"
        >
          Save & Apply
        </button>
      </div>
    </div>
  );
};
