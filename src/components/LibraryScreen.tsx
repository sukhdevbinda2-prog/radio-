import React, { useState } from 'react';
import { EqProfile, Station } from '../types';
import { HEARD_ON_RADIO_TRACKS } from '../data/radioData';
import { audioEngine } from '../services/audioEngine';

interface LibraryScreenProps {
  favoriteStations: Station[];
  onSelectStation: (station: Station) => void;
  onOpenTuner: () => void;
  currentEqProfile: EqProfile;
  onChangeEqProfile: (profile: EqProfile) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  favoriteStations,
  onSelectStation,
  onOpenTuner,
  currentEqProfile,
  onChangeEqProfile,
}) => {
  const [activeLibTab, setActiveLibTab] = useState<string>('saved');
  const [isFlacEnabled, setIsFlacEnabled] = useState<boolean>(true);
  const [playingSnippetId, setPlayingSnippetId] = useState<string | null>(null);
  const [tracksList, setTracksList] = useState(HEARD_ON_RADIO_TRACKS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handlePlaySnippet = (id: string) => {
    audioEngine.playTick();
    if (playingSnippetId === id) {
      setPlayingSnippetId(null);
    } else {
      setPlayingSnippetId(id);
      showToast('Playing 30s High-Res Master Snippet');
    }
  };

  const handleExportTrack = (title: string, artist: string) => {
    audioEngine.playTick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${title} - ${artist}`);
    }
    showToast(`Track "${title}" saved to export queue`);
  };

  const handleClearHistory = () => {
    audioEngine.playTick();
    setTracksList([]);
    showToast('Radio listening history cleared');
  };

  const eqProfiles: EqProfile[] = [
    'Warm Analog Tube',
    'Crisp Vocal Voice',
    'Bass Boost (+6dB)',
    'Flat Studio Ref',
  ];

  // Visual EQ curve heights based on current profile
  const getEqBars = (profile: EqProfile) => {
    switch (profile) {
      case 'Warm Analog Tube':
        return [80, 65, 45, 55, 70];
      case 'Crisp Vocal Voice':
        return [40, 50, 85, 75, 60];
      case 'Bass Boost (+6dB)':
        return [95, 80, 50, 45, 40];
      case 'Flat Studio Ref':
        return [55, 55, 55, 55, 55];
    }
  };

  const currentEqHeights = getEqBars(currentEqProfile);

  return (
    <div className="flex flex-col w-full px-5 pb-space-xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#ff6b35] text-[#5d1900] font-['Space_Mono'] text-[11px] font-bold py-2 px-4 rounded-full shadow-[0_0_20px_rgba(255,107,53,0.6)] animate-bounce flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Audio Insights / Activity Strip */}
      <div className="w-full mt-2 mb-4 p-4 rounded-xl bg-[#262a30] shadow-lg relative overflow-hidden border border-white/[0.04]">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-[#ff6b35]/10 blur-2xl pointer-events-none" />
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00e297] text-[18px]">
              graphic_eq
            </span>
            <span className="font-['Space_Mono'] text-[11px] text-[#00e297] uppercase tracking-wider">
              Acoustic Telemetry
            </span>
          </div>
          <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5]">SYNCED 2M AGO</span>
        </div>

        <p className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold tracking-tight leading-snug">
          48 hrs listened this week <span className="text-[#ffb59d]">•</span> 34 tracks discovered{' '}
          <span className="text-[#ffb59d]">•</span> Fav band:{' '}
          <span className="text-[#ffb86f] font-['Space_Mono'] text-[14px]">FM 102.4</span>
        </p>

        <div className="mt-3 flex items-center gap-4 pt-1">
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-center text-[11px] font-['Space_Mono'] text-[#e1bfb5]">
              <span>WEEKLY QUOTA</span>
              <span className="text-[#00e297]">96%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0a0e13] overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ffb86f] rounded-full"
                style={{ width: '78%' }}
              />
              <div className="h-full bg-[#00e297] rounded-full ml-0.5" style={{ width: '18%' }} />
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0a0e13] text-[#e0e2ea] border border-white/[0.04]">
            <span className="material-symbols-outlined text-[14px] text-[#ffb86f]">bolt</span>
            <span className="font-['Space_Mono'] text-[14px] font-bold text-[#ffb86f]">
              320<span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]">kbps</span>
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Control Pills */}
      <div className="w-full overflow-x-auto scrollbar-none pb-2 mb-4">
        <div className="flex items-center gap-2 min-w-max" id="library-pills">
          <button
            onClick={() => setActiveLibTab('saved')}
            className={`px-4 py-2 rounded-full font-['Sora'] text-[15px] flex items-center gap-1.5 transition-all ${
              activeLibTab === 'saved'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)] font-semibold'
                : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">radio</span>
            <span>Saved Stations ({favoriteStations.length})</span>
          </button>

          <button
            onClick={() => setActiveLibTab('history')}
            className={`px-4 py-2 rounded-full font-['Inter'] text-[14px] transition-all ${
              activeLibTab === 'history'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)] font-semibold'
                : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea]'
            }`}
          >
            Heard on Radio (Track History)
          </button>

          <button
            onClick={() => setActiveLibTab('recorded')}
            className={`px-4 py-2 rounded-full font-['Inter'] text-[14px] transition-all ${
              activeLibTab === 'recorded'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)] font-semibold'
                : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea]'
            }`}
          >
            Recorded Shows (3)
          </button>

          <button
            onClick={() => setActiveLibTab('downloads')}
            className={`px-4 py-2 rounded-full font-['Inter'] text-[14px] transition-all ${
              activeLibTab === 'downloads'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.35)] font-semibold'
                : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea]'
            }`}
          >
            Offline Downloads
          </button>
        </div>
      </div>

      {/* Pinned Favorite Frequencies Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ffb59d] animate-ping" />
          <h2 className="font-['Sora'] text-[20px] leading-[28px] text-[#e0e2ea] font-semibold tracking-tight">
            Pinned Transmitters
          </h2>
        </div>
        <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5]">
          {favoriteStations.length} LOCKED PRESETS
        </span>
      </div>

      {/* Pinned Frequencies Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {favoriteStations.slice(0, 4).map((station, index) => {
          const isLiveTag = index === 0;
          return (
            <div
              key={station.id}
              onClick={() => {
                onSelectStation(station);
                onOpenTuner();
              }}
              className="group relative p-3 rounded-xl bg-[#262a30] hover:bg-[#36393f] transition-all shadow-md flex flex-col justify-between overflow-hidden cursor-pointer border border-white/[0.04]"
            >
              <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#ffb59d]/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-start justify-between gap-1 mb-2">
                {isLiveTag ? (
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#00af74]/30 text-[#00e297]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] animate-pulse" />
                    <span className="font-['Space_Mono'] text-[10px] font-bold">LIVE</span>
                  </div>
                ) : (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#1c2025] text-[#e1bfb5] font-['Space_Mono'] text-[10px]">
                    P{index + 1} PRESET
                  </span>
                )}
                <div className="flex items-center gap-1 text-[#00e297] font-['Space_Mono'] text-[12px] font-bold">
                  <span className="material-symbols-outlined text-[15px]">wifi_tethering</span>
                  <span>{station.signalStrength}%</span>
                </div>
              </div>

              <div className="my-1">
                <span className="font-['Sora'] text-[34px] leading-tight text-[#ffb59d] font-bold tracking-tight block">
                  {station.frequencyDisplay}
                </span>
                <h3 className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold truncate">
                  {station.name}
                </h3>
                <p className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] uppercase mt-0.5 truncate">
                  {station.genre}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/[0.03]">
                <span className="font-['Space_Mono'] text-[10px] text-[#ffb86f] uppercase truncate max-w-[80px]">
                  {station.location}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectStation(station);
                    if (!audioEngine.getIsPlaying()) {
                      audioEngine.togglePlay();
                    }
                  }}
                  className="w-8 h-8 rounded-full bg-[#ff6b35] text-[#5d1900] flex items-center justify-center shadow-md active:scale-95 transition-transform"
                  title="Play Station"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Heard on Live Radio Section */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#ffb86f] text-[20px]">history_edu</span>
          <h2 className="font-['Sora'] text-[20px] leading-[28px] text-[#e0e2ea] font-semibold tracking-tight">
            Heard on Live Radio
          </h2>
        </div>
        <button
          onClick={handleClearHistory}
          className="font-['Space_Mono'] text-[11px] text-[#ffb59d] hover:underline flex items-center gap-0.5"
        >
          CLEAR HISTORY
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-6">
        {tracksList.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#1c2025] text-center text-[#e1bfb5] font-['Inter'] text-[14px]">
            No recent tracks cataloged. Tune into a station to log broadcast history.
          </div>
        ) : (
          tracksList.map((track) => {
            const isPlayingSnippet = playingSnippetId === track.id;
            return (
              <div
                key={track.id}
                className="p-3 rounded-xl bg-[#1c2025] flex items-center justify-between gap-3 hover:bg-[#262a30] transition-colors group border border-white/[0.04]"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#31353b]">
                    <img className="w-full h-full object-cover" src={track.albumArt} alt={track.title} />
                    <button
                      onClick={() => handlePlaySnippet(track.id)}
                      className="absolute inset-0 bg-[#0a0e13]/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[#ffb59d] transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[24px]">
                        {isPlayingSnippet ? 'pause_circle' : 'play_circle'}
                      </span>
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold truncate">
                        {track.title}
                      </h4>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ffb86f]" />
                    </div>
                    <p className="font-['Inter'] text-[12px] text-[#e1bfb5] truncate">
                      {track.artist} • <span className="text-[#ffb86f]">{track.frequencyLabel}</span>
                    </p>
                    <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]/70 block mt-0.5">
                      {track.timeAgo}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePlaySnippet(track.id)}
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isPlayingSnippet
                        ? 'bg-[#ff6b35] text-[#5d1900]'
                        : 'bg-[#31353b] text-[#e0e2ea] hover:text-[#ffb59d]'
                    }`}
                    title="Play 30s Snippet"
                  >
                    <span className="material-symbols-outlined text-[18px]">volume_up</span>
                  </button>
                  <button
                    onClick={() => handleExportTrack(track.title, track.artist)}
                    className="w-9 h-9 rounded-lg bg-[#31353b] flex items-center justify-center text-[#e0e2ea] hover:text-[#00e297] transition-colors"
                    title="Export to Spotify / Apple Music"
                  >
                    <span className="material-symbols-outlined text-[18px]">ios_share</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* DSP Valve Calibration Card */}
      <div className="p-4 rounded-xl bg-[#262a30] shadow-xl relative overflow-hidden border border-white/[0.05]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b35]/20 flex items-center justify-center text-[#ffb59d]">
              <span className="material-symbols-outlined text-[20px]">equalizer</span>
            </div>
            <div>
              <h3 className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold">
                DSP Valve Calibration
              </h3>
              <p className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]">
                ANALOG HARMONIC STAGE
              </p>
            </div>
          </div>
          <span className="flex items-center gap-1 font-['Space_Mono'] text-[11px] text-[#00e297] bg-[#00af74]/20 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] animate-pulse" /> ACTIVE
          </span>
        </div>

        {/* Equalizer Preset Selector */}
        <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] block mb-2 uppercase tracking-wider">
          Acoustic Profiles
        </span>
        <div className="grid grid-cols-2 gap-2 mb-4" id="eq-presets">
          {eqProfiles.map((profile) => {
            const isActive = currentEqProfile === profile;
            return (
              <button
                key={profile}
                onClick={() => {
                  audioEngine.playTick();
                  onChangeEqProfile(profile);
                  showToast(`Applied ${profile} profile`);
                }}
                className={`flex items-center justify-between p-2 px-3 rounded-lg font-['Sora'] text-[13px] font-medium transition-all ${
                  isActive
                    ? 'bg-[#ffb59d] text-[#5d1900] shadow-[0_0_16px_rgba(255,107,53,0.3)] font-bold'
                    : 'bg-[#1c2025] text-[#e1bfb5] hover:text-[#e0e2ea]'
                }`}
              >
                <span>{profile}</span>
                {isActive && (
                  <span className="material-symbols-outlined text-[16px]">check</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Visualizer / Harmonic EQ Curve Graph */}
        <div className="p-2 rounded-lg bg-[#0a0e13] mb-4 flex flex-col gap-1 border border-white/[0.03]">
          <div className="flex justify-between items-center text-[10px] font-['Space_Mono'] text-[#e1bfb5] px-1">
            <span>60Hz</span>
            <span>250Hz</span>
            <span>1kHz</span>
            <span>4kHz</span>
            <span>16kHz</span>
          </div>
          <div className="h-12 w-full flex items-end justify-between px-2 pb-1 gap-1">
            <div
              className="w-full bg-[#ff6b35]/80 rounded-t transition-all duration-300"
              style={{ height: `${currentEqHeights[0]}%` }}
            />
            <div
              className="w-full bg-[#ff6b35]/90 rounded-t transition-all duration-300"
              style={{ height: `${currentEqHeights[1]}%` }}
            />
            <div
              className="w-full bg-[#ffb86f]/80 rounded-t transition-all duration-300"
              style={{ height: `${currentEqHeights[2]}%` }}
            />
            <div
              className="w-full bg-[#ffb86f]/90 rounded-t transition-all duration-300"
              style={{ height: `${currentEqHeights[3]}%` }}
            />
            <div
              className="w-full bg-[#00e297]/90 rounded-t transition-all duration-300"
              style={{ height: `${currentEqHeights[4]}%` }}
            />
          </div>
        </div>

        {/* Hi-Fi Stream Quality Selector Toggle */}
        <div className="p-3 rounded-lg bg-[#1c2025] flex items-center justify-between border border-white/[0.04]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#00af74]/20 text-[#00e297] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">high_quality</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold">
                  Hi-Fi FLAC Lossless
                </span>
                <span className="font-['Space_Mono'] text-[10px] px-1 py-0.5 rounded bg-[#00e297] text-[#003822] font-bold">
                  24-BIT
                </span>
              </div>
              <p className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]">
                96kHz Ultra High-Res Broadcast Stream
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isFlacEnabled}
              onChange={(e) => {
                audioEngine.playTick();
                setIsFlacEnabled(e.target.checked);
                showToast(e.target.checked ? '24-bit 96kHz Mode Engaged' : 'Standard 320kbps Mode');
              }}
              className="sr-only peer"
              id="flac-toggle"
            />
            <div className="w-12 h-6 bg-[#31353b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e0e2ea] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff6b35] shadow-inner" />
          </label>
        </div>
      </div>
    </div>
  );
};
