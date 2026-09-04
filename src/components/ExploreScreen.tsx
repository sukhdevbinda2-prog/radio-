import React, { useState } from 'react';
import { Station } from '../types';
import { ASSETS, GENRE_BANDS, WORLD_RELAYS } from '../data/radioData';
import { audioEngine } from '../services/audioEngine';

interface ExploreScreenProps {
  stations: Station[];
  onSelectStation: (station: Station) => void;
  onOpenTuner: () => void;
}

export const ExploreScreen: React.FC<ExploreScreenProps> = ({
  stations,
  onSelectStation,
  onOpenTuner,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'local' | 'global' | 'college' | 'pirate'>('local');
  const [featuredTuneState, setFeaturedTuneState] = useState<'Tune In' | 'Live Lock'>('Tune In');

  const handleTuneFeatured = () => {
    audioEngine.playTick();
    const kexp = stations.find((s) => s.id === 'kexp');
    if (kexp) {
      onSelectStation(kexp);
      setFeaturedTuneState(featuredTuneState === 'Tune In' ? 'Live Lock' : 'Tune In');
      if (!audioEngine.getIsPlaying()) {
        audioEngine.togglePlay();
      }
    }
  };

  const handleSelectRelay = (relayFreq: string, name: string) => {
    audioEngine.playTick();
    const parsedFreq = parseFloat(relayFreq);
    const matchedStation = stations.find(
      (s) => Math.abs(s.frequency - parsedFreq) < 0.2 || s.name.toLowerCase().includes(name.toLowerCase().split(' ')[0])
    );
    if (matchedStation) {
      onSelectStation(matchedStation);
    } else {
      // Create ad-hoc station if needed
      onSelectStation({
        id: `relay-${parsedFreq}`,
        frequency: parsedFreq,
        frequencyDisplay: relayFreq,
        name: name,
        genre: 'International Relay Broadcast',
        location: 'Global',
        band: 'FM',
        signalStrength: 95,
        listenersCount: 18900,
        isFavorite: false,
      });
    }
    onOpenTuner();
  };

  const filteredTrending = stations.filter((s) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.frequencyDisplay.includes(q) ||
      s.genre.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col w-full pb-space-lg">
      {/* Search Input Bar */}
      <div className="px-5 pt-1 pb-3">
        <div className="relative flex items-center w-full rounded-xl bg-[#262a30] shadow-md overflow-hidden transition-all duration-300 focus-within:shadow-[0_0_16px_rgba(255,107,53,0.25)] border border-white/[0.04]">
          <div className="pl-3 pr-1 flex items-center justify-center text-[#ff6b35]">
            <span className="material-symbols-outlined text-[20px]">radio</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent py-3 pr-10 text-[14px] font-['Inter'] text-[#e0e2ea] placeholder:text-[#a98a80] focus:outline-none"
            placeholder="Search frequency, city, genre, callsign..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-10 text-[#a98a80] hover:text-[#e0e2ea] p-1"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
          <div className="absolute right-3 flex items-center gap-1">
            <button
              onClick={onOpenTuner}
              className="w-8 h-8 rounded-lg bg-[#1c2025] flex items-center justify-center text-[#e1bfb5] hover:text-[#ffb59d] transition-colors"
              title="Open Graphic Tuner"
            >
              <span className="material-symbols-outlined text-[16px]">graphic_eq</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Chips Horizontal Rail */}
      <div className="w-full overflow-x-auto scrollbar-none py-1 px-5">
        <div className="flex items-center gap-2 whitespace-nowrap min-w-max" id="filter-chips">
          <button
            onClick={() => setActiveFilter('local')}
            className={`px-3.5 py-1.5 rounded-full font-['Space_Mono'] text-[11px] leading-[14px] flex items-center gap-1.5 transition-all active:scale-95 ${
              activeFilter === 'local'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_12px_rgba(255,107,53,0.35)] font-bold'
                : 'bg-[#1c2025] text-[#e0e2ea] hover:bg-[#262a30]'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#0a0e13] animate-ping" />
            <span>Local (Near You • 15km)</span>
          </button>

          <button
            onClick={() => setActiveFilter('global')}
            className={`px-3.5 py-1.5 rounded-full font-['Space_Mono'] text-[11px] leading-[14px] flex items-center gap-1.5 transition-all ${
              activeFilter === 'global'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_12px_rgba(255,107,53,0.35)] font-bold'
                : 'bg-[#1c2025] text-[#e0e2ea] hover:bg-[#262a30]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#00e297]">public</span>
            <span>Global Frequencies</span>
          </button>

          <button
            onClick={() => setActiveFilter('college')}
            className={`px-3.5 py-1.5 rounded-full font-['Space_Mono'] text-[11px] leading-[14px] flex items-center gap-1.5 transition-all ${
              activeFilter === 'college'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_12px_rgba(255,107,53,0.35)] font-bold'
                : 'bg-[#1c2025] text-[#e0e2ea] hover:bg-[#262a30]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffb86f]">school</span>
            <span>College Radio</span>
          </button>

          <button
            onClick={() => setActiveFilter('pirate')}
            className={`px-3.5 py-1.5 rounded-full font-['Space_Mono'] text-[11px] leading-[14px] flex items-center gap-1.5 transition-all ${
              activeFilter === 'pirate'
                ? 'bg-[#ff6b35] text-[#5d1900] shadow-[0_0_12px_rgba(255,107,53,0.35)] font-bold'
                : 'bg-[#1c2025] text-[#e0e2ea] hover:bg-[#262a30]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px] text-[#ffb4ab]">radar</span>
            <span>Pirate & Underground</span>
          </button>
        </div>
      </div>

      {/* Featured Spotlight Card (KEXP 90.3 FM) */}
      <div className="px-5 mt-2 mb-4">
        <div className="relative rounded-2xl overflow-hidden bg-[#1c2025] shadow-xl border border-white/[0.04]">
          <div
            className="w-full h-52 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${ASSETS.featuredKexp}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#1c2025] via-[#1c2025]/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0e13]/80 via-transparent to-transparent" />

            {/* Top Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-md bg-[#0a0e13]/90 backdrop-blur-md text-[#00e297] font-['Space_Mono'] text-[14px] font-bold tracking-wider shadow-sm flex items-center gap-1 border border-white/[0.05]">
                <span className="w-2 h-2 rounded-full bg-[#00e297] animate-pulse" /> 90.3 FM
              </span>
              <span className="px-2 py-0.5 rounded-md bg-[#d07d0b]/80 backdrop-blur-md text-[#402300] font-['Space_Mono'] text-[11px] font-semibold">
                PACIFIC NW
              </span>
            </div>

            <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0a0e13]/80 backdrop-blur-md text-[#e1bfb5] font-['Space_Mono'] text-[11px]">
              <span className="material-symbols-outlined text-[14px] text-[#ffb59d]">headphones</span>
              <span>14.8k tuned</span>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="px-1.5 py-0.5 rounded bg-[#00af74]/40 text-[#00e297] font-['Space_Mono'] text-[11px] uppercase tracking-widest font-semibold">
                    LIVE NOW
                  </span>
                  <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5] truncate">
                    Hosted by DJ Kevin Cole
                  </span>
                </div>
                <h2 className="font-['Sora'] text-[26px] leading-[32px] text-[#e0e2ea] font-bold tracking-tight truncate">
                  KEXP 90.3 FM
                </h2>
                <p className="font-['Inter'] text-[12px] text-[#e1bfb5] line-clamp-1 italic">
                  "Where the Music Matters • The Midday Show live from Seattle"
                </p>
              </div>

              <button
                onClick={handleTuneFeatured}
                id="featured-tune-btn"
                className={`px-4 py-2.5 rounded-xl font-['Sora'] text-[16px] font-semibold shadow-[0_0_20px_rgba(255,107,53,0.4)] flex items-center gap-2 active:scale-95 transition-all duration-200 shrink-0 ${
                  featuredTuneState === 'Live Lock'
                    ? 'bg-[#00e297] text-[#003822]'
                    : 'bg-[#ff6b35] text-[#5d1900]'
                }`}
              >
                <div className="flex items-end gap-0.5 h-3.5 w-3.5">
                  <span className="w-0.5 h-full bg-current rounded-full animate-bounce" />
                  <span className="w-0.5 h-2/3 bg-current rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-0.5 h-4/5 bg-current rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
                <span>{featuredTuneState}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* World Transmitters Card */}
      <div className="px-5 mb-4">
        <div className="relative rounded-2xl bg-[#1c2025] overflow-hidden shadow-lg border border-white/[0.04]">
          <div
            className="w-full h-44 bg-cover bg-center relative"
            style={{ backgroundImage: `url('${ASSETS.worldMap}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e13]/60 via-[#0a0e13]/70 to-[#1c2025]" />

            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#00e297]">language</span>
                <span className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold">
                  World Transmitters
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-[#262a30]/80 text-[#e1bfb5] font-['Space_Mono'] text-[11px] border border-white/[0.04]">
                4 active relays
              </span>
            </div>

            {/* 4 World Transmitters Relays Grid */}
            <div className="absolute inset-x-4 bottom-3 grid grid-cols-2 gap-2">
              {WORLD_RELAYS.map((relay) => (
                <button
                  key={relay.city}
                  onClick={() => handleSelectRelay(relay.freq, relay.station)}
                  className="p-2 rounded-xl bg-[#262a30]/90 backdrop-blur-md flex items-center gap-2 text-left hover:bg-[#31353b] active:scale-95 transition-all border border-white/[0.04]"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                    style={{ backgroundColor: relay.color }}
                  />
                  <div className="min-w-0">
                    <p className="font-['Space_Mono'] text-[14px] font-bold text-[#e0e2ea] leading-tight truncate">
                      {relay.city} {relay.freq}
                    </p>
                    <p className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] truncate">
                      {relay.station}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Signal Bands & Genres Grid */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#ffb86f]">category</span>
            <h3 className="font-['Sora'] text-[20px] leading-[28px] text-[#e0e2ea] font-semibold tracking-tight">
              Signal Bands & Genres
            </h3>
          </div>
          <button
            onClick={onOpenTuner}
            className="font-['Space_Mono'] text-[11px] text-[#ffb59d] hover:underline"
          >
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {GENRE_BANDS.map((genre) => (
            <div
              key={genre.name}
              onClick={() => {
                audioEngine.playTick();
                setSearchQuery(genre.name.split(' ')[0]);
              }}
              className={`relative h-24 rounded-xl overflow-hidden bg-gradient-to-br ${genre.gradient} p-3 flex flex-col justify-between shadow-md active:scale-95 transition-transform cursor-pointer border border-white/[0.04]`}
            >
              <div className="flex justify-between items-start">
                <span
                  className="font-['Space_Mono'] text-[10px] uppercase font-bold tracking-wider"
                  style={{ color: genre.color }}
                >
                  {genre.category}
                </span>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: genre.color }}
                >
                  {genre.icon}
                </span>
              </div>
              <div>
                <span className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold block leading-tight">
                  {genre.name}
                </span>
                <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5]">
                  {genre.towers} Active Towers
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending On Spectrum List */}
      <div className="px-5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[20px] text-[#00e297]">bolt</span>
            <h3 className="font-['Sora'] text-[20px] leading-[28px] text-[#e0e2ea] font-semibold tracking-tight">
              Trending On Spectrum
            </h3>
          </div>
          <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5]">Realtime Gain</span>
        </div>

        <div className="space-y-2">
          {filteredTrending.slice(0, 3).map((station, idx) => {
            const covers = [ASSETS.trendingVinyl, ASSETS.trendingAmp, ASSETS.trendingSynth];
            return (
              <div
                key={station.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#1c2025] hover:bg-[#262a30] transition-colors shadow-sm border border-white/[0.04]"
              >
                <div
                  className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
                  onClick={() => {
                    onSelectStation(station);
                    onOpenTuner();
                  }}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-[#262a30]">
                    <img
                      className="w-full h-full object-cover"
                      src={covers[idx % covers.length]}
                      alt={station.name}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-['Space_Mono'] text-[14px] text-[#e0e2ea] font-bold truncate">
                        {station.name}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[#31353b] text-[#ffb86f] font-['Space_Mono'] text-[11px]">
                        {station.frequencyDisplay} {station.band}
                      </span>
                    </div>
                    <p className="font-['Inter'] text-[12px] text-[#e1bfb5] truncate">
                      {station.currentTrack?.showName || station.genre}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-end gap-0.5 h-2 w-3">
                        <span className="w-0.5 h-full bg-[#00e297] rounded-full" />
                        <span className="w-0.5 h-full bg-[#00e297] rounded-full" />
                        <span className="w-0.5 h-3/4 bg-[#00e297] rounded-full" />
                        <span
                          className={`w-0.5 ${
                            station.signalStrength > 80 ? 'h-full bg-[#00e297]' : 'h-1/3 bg-[#a98a80]'
                          } rounded-full`}
                        />
                      </div>
                      <span className="font-['Space_Mono'] text-[11px] text-[#00e297] font-bold">
                        {station.signalStrength}% SIGNAL
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onSelectStation(station);
                    if (!audioEngine.getIsPlaying()) {
                      audioEngine.togglePlay();
                    }
                  }}
                  className="w-9 h-9 rounded-full bg-[#31353b] flex items-center justify-center text-[#ffb59d] hover:bg-[#ff6b35] hover:text-[#5d1900] transition-colors shrink-0 active:scale-95"
                  title="Play Station"
                >
                  <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
