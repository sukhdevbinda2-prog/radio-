import React, { useState, useEffect, useRef } from 'react';
import { Station, Waveband } from '../types';
import { audioEngine } from '../services/audioEngine';

interface TunerScreenProps {
  currentStation: Station;
  frequency: number;
  onFrequencyChange: (freq: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  favoriteStations: Station[];
  onSelectStation: (station: Station) => void;
  onOpenEq: () => void;
}

export const TunerScreen: React.FC<TunerScreenProps> = ({
  currentStation,
  frequency,
  onFrequencyChange,
  isPlaying,
  onTogglePlay,
  favoriteStations,
  onSelectStation,
  onOpenEq,
}) => {
  const [selectedBand, setSelectedBand] = useState<Waveband>('FM');
  const [isFavorite, setIsFavorite] = useState<boolean>(true);
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [showShareToast, setShowShareToast] = useState<boolean>(false);
  const [rulerOffset, setRulerOffset] = useState<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const startXRef = useRef<number>(0);
  const currentFreqRef = useRef<number>(frequency);

  // Equalizer spectrum bars simulation / real audio data
  const [spectrumHeights, setSpectrumHeights] = useState<number[]>([
    45, 70, 95, 60, 80, 100, 75, 55, 88, 65, 40, 70, 50, 30,
  ]);

  useEffect(() => {
    currentFreqRef.current = frequency;
  }, [frequency]);

  useEffect(() => {
    let animationFrameId: number;
    const updateSpectrum = () => {
      if (isPlaying) {
        const byteData = audioEngine.getSpectrumData();
        const hasAudio = byteData.some((v) => v > 0);
        if (hasAudio) {
          const heights = Array.from(byteData).map((v) =>
            Math.max(15, Math.min(100, Math.round((v / 255) * 100)))
          );
          setSpectrumHeights(heights);
        } else {
          // Dynamic organic pulse wave
          const t = Date.now() / 180;
          setSpectrumHeights([
            Math.round(40 + Math.sin(t) * 25),
            Math.round(65 + Math.cos(t * 1.2) * 25),
            Math.round(85 + Math.sin(t * 1.5) * 15),
            Math.round(55 + Math.sin(t * 0.8) * 30),
            Math.round(75 + Math.cos(t * 1.1) * 20),
            Math.round(95 + Math.sin(t * 1.4) * 5),
            Math.round(70 + Math.cos(t * 0.9) * 25),
            Math.round(50 + Math.sin(t * 1.3) * 35),
            Math.round(82 + Math.cos(t * 1.7) * 15),
            Math.round(60 + Math.sin(t * 0.7) * 28),
            Math.round(38 + Math.cos(t * 1.6) * 22),
            Math.round(68 + Math.sin(t * 1.1) * 26),
            Math.round(48 + Math.cos(t * 0.9) * 24),
            Math.round(32 + Math.sin(t * 1.4) * 18),
          ]);
        }
      } else {
        // Idle ambient low baseline
        setSpectrumHeights([18, 24, 30, 22, 28, 35, 26, 20, 32, 24, 18, 25, 20, 15]);
      }
      animationFrameId = requestAnimationFrame(updateSpectrum);
    };

    animationFrameId = requestAnimationFrame(updateSpectrum);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  const handleStep = (delta: number) => {
    audioEngine.playTick();
    const nextFreq = Math.round((frequency + delta) * 10) / 10;
    if (nextFreq >= 87.5 && nextFreq <= 108.5) {
      onFrequencyChange(nextFreq);
      audioEngine.setFrequency(nextFreq);
    }
  };

  const handleShare = () => {
    setShowShareToast(true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Listening to ${currentStation.name} (${frequency.toFixed(1)} MHz) on WaveFM`
      );
    }
    setTimeout(() => setShowShareToast(false), 2200);
  };

  // Tape ruler calculations: center is currently tuned frequency
  // Each 0.1 MHz is approx 8 pixels
  const centerFrequency = 102.4;
  const pixelsPerMHz = 80;
  const tapeOffset = (centerFrequency - frequency) * pixelsPerMHz;

  // Touch and drag handlers for interactive tape ruler
  const handleRulerMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
  };

  const handleRulerMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.clientX - startXRef.current;
    if (Math.abs(diff) >= 8) {
      const step = diff > 0 ? -0.1 : 0.1;
      const newFreq = Math.round((currentFreqRef.current + step) * 10) / 10;
      if (newFreq >= 87.5 && newFreq <= 108.5) {
        onFrequencyChange(newFreq);
        audioEngine.playTick();
        audioEngine.setFrequency(newFreq);
      }
      startXRef.current = e.clientX;
    }
  };

  const handleRulerMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleRulerTouchStart = (e: React.TouchEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.touches[0].clientX;
  };

  const handleRulerTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;
    const diff = e.touches[0].clientX - startXRef.current;
    if (Math.abs(diff) >= 8) {
      const step = diff > 0 ? -0.1 : 0.1;
      const newFreq = Math.round((currentFreqRef.current + step) * 10) / 10;
      if (newFreq >= 87.5 && newFreq <= 108.5) {
        onFrequencyChange(newFreq);
        audioEngine.playTick();
        audioEngine.setFrequency(newFreq);
      }
      startXRef.current = e.touches[0].clientX;
    }
  };

  const handleRulerTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Build ruler tick marks for 96 to 108 MHz
  const rulerFrequencies = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108];

  return (
    <div className="flex flex-col w-full px-5 pb-space-lg gap-4 select-none">
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ff6b35] text-[#5d1900] font-['Space_Mono'] text-[12px] font-bold py-2 px-4 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.6)] animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Station Link Copied to Clipboard</span>
        </div>
      )}

      {/* Waveband Selector */}
      <div className="flex items-center justify-between p-1 bg-[#181c21] rounded-xl border border-white/[0.03]">
        {(['FM', 'AM', 'DAB+', 'WEB'] as Waveband[]).map((band) => (
          <button
            key={band}
            onClick={() => {
              setSelectedBand(band);
              audioEngine.playTick();
            }}
            className={`flex-1 py-1.5 px-2 rounded-lg font-['Space_Mono'] text-[11px] leading-[14px] text-center font-bold tracking-wider transition-all ${
              selectedBand === band
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)]'
                : 'text-[#e1bfb5] hover:text-[#e0e2ea]'
            }`}
          >
            {band}
          </button>
        ))}
      </div>

      {/* Main Frequency Tuner Deck & Tactile Tape Ruler */}
      <div className="relative w-full bg-[#1c2025] rounded-xl p-4 overflow-hidden flex flex-col gap-3 shadow-[0_4px_24px_rgba(0,0,0,0.5)] border border-white/[0.05]">
        {/* Top Signal Lock Header inside Hardware Frame */}
        <div className="flex items-center justify-between text-[#e1bfb5]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00e297] shadow-[0_0_8px_rgba(0,226,151,0.8)] animate-pulse" />
            <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#00e297] font-bold tracking-widest uppercase">
              STEREO LOCKED
            </span>
          </div>
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] tracking-widest text-[#e1bfb5]/80">
            IF: 10.7 MHz • AGC HI
          </span>
        </div>

        {/* Central Frequency Readout Display */}
        <div className="flex flex-col items-center justify-center my-1 relative">
          <div className="flex items-baseline gap-1">
            <span
              className="font-['Sora'] text-[44px] sm:text-[48px] leading-[48px] font-bold tracking-tighter text-[#e0e2ea] drop-shadow-[0_0_24px_rgba(255,181,157,0.25)]"
              id="freq-display"
            >
              {frequency.toFixed(1)}
            </span>
            <span className="font-['Space_Mono'] text-[11px] leading-[14px] font-bold text-[#ffb59d] tracking-widest uppercase">
              MHz
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-['Sora'] text-[16px] leading-[24px] text-[#ffb86f] font-semibold">
              {currentStation.name}
            </span>
            <span className="text-[#e1bfb5] text-[12px]">•</span>
            <span className="font-['Inter'] text-[12px] leading-[16px] text-[#e1bfb5]">
              {currentStation.genre}
            </span>
          </div>
        </div>

        {/* Analog Dial Ruler Box */}
        <div
          className="relative w-full h-16 bg-[#0a0e13] rounded-lg overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing border border-white/[0.04]"
          onMouseDown={handleRulerMouseDown}
          onMouseMove={handleRulerMouseMove}
          onMouseUp={handleRulerMouseUp}
          onTouchStart={handleRulerTouchStart}
          onTouchMove={handleRulerTouchMove}
          onTouchEnd={handleRulerTouchEnd}
        >
          {/* Glow needle aura */}
          <div className="absolute inset-y-0 w-8 bg-gradient-to-r from-transparent via-[#ff6b35]/20 to-transparent pointer-events-none z-10" />

          {/* Needle Line Indicator */}
          <div className="absolute inset-y-0 w-[2px] bg-[#ff6b35] z-20 pointer-events-none flex flex-col items-center shadow-[0_0_12px_rgba(255,107,53,0.9)]">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] -top-1 absolute shadow-[0_0_8px_rgba(255,107,53,1)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b35] -bottom-0.5 absolute" />
          </div>

          {/* Linear Frequency Ruler Tick Tape */}
          <div
            className="flex items-end h-full gap-2 px-32 overflow-x-hidden scrollbar-none w-full transition-transform duration-100 ease-out"
            style={{ transform: `translateX(${tapeOffset}px)` }}
          >
            <div className="flex items-end gap-1.5 py-2">
              {rulerFrequencies.map((f) => {
                const isCurrent = Math.abs(frequency - f) < 0.3;
                return (
                  <React.Fragment key={f}>
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={`w-[1.5px] ${
                          isCurrent
                            ? 'h-7 bg-[#ffb59d]'
                            : 'h-6 bg-[#e1bfb5]/50'
                        }`}
                      />
                      <span
                        className={`font-['Space_Mono'] text-[9px] ${
                          isCurrent
                            ? 'text-[#ffb59d] font-bold'
                            : 'text-[#e1bfb5]/70'
                        }`}
                      >
                        {f}
                      </span>
                    </div>
                    <div className="w-[1px] h-3 bg-[#e1bfb5]/20" />
                    <div className="w-[1px] h-3 bg-[#e1bfb5]/20" />
                    <div className="w-[1px] h-4 bg-[#e1bfb5]/30" />
                    <div className="w-[1px] h-3 bg-[#e1bfb5]/20" />
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Optical Glass Vignette Masks */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0a0e13] to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0a0e13] to-transparent pointer-events-none" />
        </div>

        {/* Fine Tuning Stepper Controls */}
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => handleStep(-0.1)}
            className="flex items-center gap-1 px-3 py-1 rounded bg-[#262a30] text-[#e1bfb5] hover:text-[#e0e2ea] active:scale-95 transition-transform"
            title="Fine step backward"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_left</span>
            <span className="font-['Space_Mono'] text-[10px] font-bold tracking-wider">
              -0.1 MHz
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="font-['Space_Mono'] text-[10px] text-[#00e297] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] animate-ping" />
              OPTIMAL CARRIER
            </span>
          </div>

          <button
            onClick={() => handleStep(0.1)}
            className="flex items-center gap-1 px-3 py-1 rounded bg-[#262a30] text-[#e1bfb5] hover:text-[#e0e2ea] active:scale-95 transition-transform"
            title="Fine step forward"
          >
            <span className="font-['Space_Mono'] text-[10px] font-bold tracking-wider">
              +0.1 MHz
            </span>
            <span className="material-symbols-outlined text-[16px]">arrow_right</span>
          </button>
        </div>
      </div>

      {/* Real-time Equalizer Wave Visualizer */}
      <div className="w-full bg-[#181c21] rounded-xl p-3 flex flex-col gap-1 border border-white/[0.04]">
        <div className="flex items-center justify-between px-2">
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#e1bfb5] tracking-wider uppercase">
            Spectrum Analyzer
          </span>
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#ffb86f] font-bold">
            24-BIT • FLAC
          </span>
        </div>

        {/* Dynamic Equalizer Bars with Gradients */}
        <div className="flex items-end justify-between h-10 px-2 gap-1">
          {spectrumHeights.map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-[#00af74] via-[#ffb86f] to-[#ff6b35] rounded-t-sm transition-all duration-150"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* Live Studio Broadcast Metrics Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#1c2025] rounded-lg border border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffb4ab] animate-pulse shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] font-bold text-[#e0e2ea] tracking-wider">
            LIVE ON AIR
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#e1bfb5]">
          <span className="material-symbols-outlined text-[16px] text-[#ffb86f]">headset</span>
          <span className="font-['Space_Mono'] text-[12px]">
            {currentStation.listenersCount.toLocaleString()} tuning in
          </span>
        </div>
        <div className="flex items-center gap-1 text-[#e1bfb5]">
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#00e297] font-bold">
            320kbps HD
          </span>
        </div>
      </div>

      {/* Now Playing Track Card with Vinyl Accent */}
      <div className="relative w-full bg-[#1c2025] rounded-xl p-4 flex flex-col gap-4 shadow-[0_6px_20px_rgba(0,0,0,0.4)] overflow-hidden border border-white/[0.04]">
        <div className="flex items-center gap-4">
          {/* Vinyl + Album Sleeve Deck */}
          <div className="relative w-20 h-20 shrink-0">
            {/* Vinyl peeking right */}
            <div
              className={`absolute top-1 -right-3 w-[72px] h-[72px] rounded-full bg-[#0a0e13] flex items-center justify-center shadow-md ${
                isPlaying ? 'animate-[spin_8s_linear_infinite]' : ''
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-[#1c2025] flex items-center justify-center border border-white/10">
                <div className="w-3 h-3 rounded-full bg-[#ffb59d]" />
              </div>
            </div>

            {/* Album Art Thumbnail */}
            <img
              className="relative z-10 w-20 h-20 rounded-lg object-cover shadow-[0_4px_12px_rgba(0,0,0,0.6)]"
              src={currentStation.currentTrack?.albumArt}
              alt={currentStation.currentTrack?.title}
            />
          </div>

          {/* Track Information */}
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-['Space_Mono'] text-[10px] font-bold text-[#ffb59d] tracking-widest uppercase truncate">
              {currentStation.currentTrack?.showName || 'MORNING SOUNDSCAPES • GILLES P.'}
            </span>
            <h2 className="font-['Sora'] text-[18px] leading-snug font-bold text-[#e0e2ea] truncate">
              {currentStation.currentTrack?.title || 'Baba Ayoola'}
            </h2>
            <span className="font-['Inter'] text-[14px] text-[#e1bfb5] truncate">
              {currentStation.currentTrack?.artist || 'KOKOROKO'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-['Space_Mono'] text-[10px] px-1.5 py-0.5 rounded bg-[#31353b] text-[#e0e2ea] font-semibold">
                {currentStation.currentTrack?.tag || 'AFROBEAT'}
              </span>
              <span className="font-['Space_Mono'] text-[10px] text-[#00e297]">
                {currentStation.currentTrack?.year || 'REC 2024'}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-9 h-9 rounded-full bg-[#262a30] flex items-center justify-center text-[#ffb59d] hover:text-[#e0e2ea] active:scale-90 transition-transform"
              title="Favorite track"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{
                  fontVariationSettings: isFavorite ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                favorite
              </span>
            </button>
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-[#262a30] flex items-center justify-center text-[#e1bfb5] hover:text-[#e0e2ea] active:scale-90 transition-transform"
              title="Share track"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
            </button>
          </div>
        </div>

        {/* Playback Transport Hub */}
        <div className="flex items-center justify-around pt-1 bg-[#181c21]/60 rounded-xl p-3 border border-white/[0.02]">
          {/* Equalizer Preset */}
          <button
            onClick={onOpenEq}
            className="w-11 h-11 rounded-full flex items-center justify-center text-[#e1bfb5] hover:text-[#e0e2ea] active:scale-95 transition-all"
            title="DSP Valve Calibration"
          >
            <span className="material-symbols-outlined text-[22px]">graphic_eq</span>
          </button>

          {/* Scan Backward */}
          <button
            onClick={() => handleStep(-0.2)}
            className="w-12 h-12 rounded-full bg-[#262a30] flex items-center justify-center text-[#e0e2ea] hover:text-[#ffb59d] active:scale-95 transition-transform shadow-sm"
            title="Tune lower"
          >
            <span className="material-symbols-outlined text-[24px]">fast_rewind</span>
          </button>

          {/* Main Central Glowing Play/Pause Action */}
          <button
            onClick={onTogglePlay}
            className="w-16 h-16 rounded-full bg-[#ff6b35] text-[#5d1900] flex items-center justify-center shadow-[0_0_24px_rgba(255,107,53,0.5)] active:scale-90 hover:brightness-110 transition-transform"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span
              className="material-symbols-outlined text-[34px] text-white"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Scan Forward */}
          <button
            onClick={() => handleStep(0.2)}
            className="w-12 h-12 rounded-full bg-[#262a30] flex items-center justify-center text-[#e0e2ea] hover:text-[#ffb59d] active:scale-95 transition-transform shadow-sm"
            title="Tune higher"
          >
            <span className="material-symbols-outlined text-[24px]">fast_forward</span>
          </button>

          {/* AirPlay / Stream Casting */}
          <button
            onClick={() => setIsCasting(!isCasting)}
            className={`w-11 h-11 rounded-full flex items-center justify-center active:scale-95 transition-all ${
              isCasting ? 'text-[#00e297]' : 'text-[#00e297]/60 hover:text-[#00e297]'
            }`}
            title="Cast to Studio Monitors"
          >
            <span className="material-symbols-outlined text-[22px]">cast_connected</span>
          </button>
        </div>
      </div>

      {/* Quick Station Presets Rail */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Space_Mono'] text-[11px] leading-[14px] text-[#e1bfb5] uppercase tracking-wider font-bold">
            FAVORITE PRESETS
          </span>
          <button
            onClick={onOpenEq}
            className="font-['Space_Mono'] text-[10px] text-[#ffb59d] hover:underline"
          >
            EDIT ALL
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {favoriteStations.map((station) => {
            const isStationActive = Math.abs(frequency - station.frequency) < 0.2;
            return (
              <button
                key={station.id}
                onClick={() => onSelectStation(station)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg shrink-0 active:scale-95 transition-all border ${
                  isStationActive
                    ? 'bg-[#262a30] text-[#e0e2ea] shadow-[0_0_12px_rgba(255,107,53,0.25)] border-[#ff6b35]/40'
                    : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea] border-white/[0.04]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStationActive ? 'bg-[#ff6b35] animate-pulse' : 'bg-[#31353b]'
                  }`}
                />
                <div className="flex flex-col items-start">
                  <span className="font-['Space_Mono'] text-[14px] leading-tight text-[#e0e2ea] font-bold">
                    {station.frequencyDisplay}
                  </span>
                  <span className="font-['Space_Mono'] text-[9px] text-[#e1bfb5] tracking-wider uppercase truncate max-w-[70px]">
                    {station.name.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
