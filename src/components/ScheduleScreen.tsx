import React, { useState } from 'react';
import { SCHEDULE_SLOTS, ARCHIVE_ITEMS } from '../data/radioData';
import { audioEngine } from '../services/audioEngine';

interface ScheduleScreenProps {
  onOpenTuner: () => void;
  onPlayLive: () => void;
  isPlaying: boolean;
}

export const ScheduleScreen: React.FC<ScheduleScreenProps> = ({
  onPlayLive,
  isPlaying,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStationName, setSelectedStationName] = useState('Worldwide FM');
  const [selectedDate, setSelectedDate] = useState('WED 16');
  const [isTracklistOpen, setIsTracklistOpen] = useState(false);
  const [reminders, setReminders] = useState<{ [id: string]: boolean }>({});
  const [downloads, setDownloads] = useState<{ [id: string]: 'idle' | 'downloading' | 'done' }>({
    'arch-1': 'idle',
    'arch-2': 'done',
  });

  const stationPresets = [
    { name: 'Worldwide FM', freq: '91.4 FM', online: true },
    { name: 'NTS Radio 1', freq: '104.2 FM', online: true },
    { name: 'Rinse FM London', freq: '106.8 FM', online: true },
    { name: 'Dublab LA', freq: '99.1 FM', online: true },
  ];

  const dates = [
    { day: 'Mon', num: '14' },
    { day: 'Tue', num: '15' },
    { day: 'Wed', num: '16', isToday: true },
    { day: 'Thu', num: '17' },
    { day: 'Fri', num: '18' },
    { day: 'Sat', num: '19' },
  ];

  const toggleReminder = (slotId: string) => {
    audioEngine.playTick();
    setReminders((prev) => ({
      ...prev,
      [slotId]: !prev[slotId],
    }));
  };

  const handleDownload = (id: string) => {
    audioEngine.playTick();
    if (downloads[id] === 'done') return;
    setDownloads((prev) => ({ ...prev, [id]: 'downloading' }));
    setTimeout(() => {
      setDownloads((prev) => ({ ...prev, [id]: 'done' }));
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full pb-space-lg">
      {/* Station Switcher & Hardware Mode Bar */}
      <div className="px-5 pt-1 pb-3 flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            id="stationDropdownBtn"
            className="flex items-center gap-2 bg-[#262a30] px-4 py-1.5 rounded-full shadow-md active:scale-95 transition-all text-left border border-white/[0.05]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00e297] animate-pulse" />
            <div className="flex flex-col">
              <span className="font-['Space_Mono'] text-[9px] text-[#e1bfb5] uppercase tracking-widest leading-none">
                TRANSMITTER 01
              </span>
              <span className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold flex items-center gap-1">
                {selectedStationName}
                <span className="material-symbols-outlined text-[18px] text-[#ffb59d]">
                  {isDropdownOpen ? 'expand_less' : 'expand_more'}
                </span>
              </span>
            </div>
          </button>

          {/* Station Selector Dropdown Modal */}
          {isDropdownOpen && (
            <div
              id="stationDropdown"
              className="absolute top-full mt-2 left-0 w-64 bg-[#262a30]/95 backdrop-blur-xl rounded-xl shadow-[0_12px_32px_rgba(0,0,0,0.8)] z-40 p-2 space-y-1 border border-white/[0.08]"
            >
              <div className="px-3 py-1 flex items-center justify-between text-[#e1bfb5] font-['Space_Mono'] text-[10px] uppercase">
                <span>Preset Channels</span>
                <span className="text-[#00e297] font-bold">4 ONLINE</span>
              </div>
              {stationPresets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => {
                    setSelectedStationName(preset.name);
                    setIsDropdownOpen(false);
                    audioEngine.playTick();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors text-left ${
                    selectedStationName === preset.name
                      ? 'bg-[#36393f] text-[#ffb59d]'
                      : 'hover:bg-[#36393f] text-[#e0e2ea]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#ffb59d]">
                      radio
                    </span>
                    <span className="font-['Inter'] text-[14px] font-semibold">
                      {preset.name}
                    </span>
                  </div>
                  <span className="font-['Space_Mono'] text-[11px] text-[#00e297]">
                    {preset.freq}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quartz Sync Badge */}
        <div className="flex items-center gap-1.5 bg-[#1c2025] px-3 py-1.5 rounded-full shadow-sm border border-white/[0.04]">
          <span className="material-symbols-outlined text-[#00e297] text-[14px]">schedule</span>
          <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5] uppercase">
            UTC+00:00
          </span>
        </div>
      </div>

      {/* Horizontal Date Navigation Tape */}
      <div className="w-full overflow-x-auto scrollbar-none pb-3 px-5 flex items-center gap-2">
        {dates.map((d) => {
          const isSelected = selectedDate === `${d.day.toUpperCase()} ${d.num}`;
          if (d.isToday) {
            return (
              <button
                key={d.num}
                onClick={() => setSelectedDate(`${d.day.toUpperCase()} ${d.num}`)}
                className="flex-shrink-0 flex flex-col items-center justify-center w-16 py-2 rounded-lg bg-[#d07d0b] text-[#402300] shadow-[0_0_20px_rgba(208,125,11,0.45)] relative overflow-hidden active:scale-95 transition-all"
              >
                <span className="absolute top-0 inset-x-0 h-0.5 bg-[#ffb86f]" />
                <span className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-wider">
                  TODAY
                </span>
                <div className="flex items-baseline gap-0.5">
                  <span className="font-['Space_Mono'] text-[11px] font-bold">{d.day.toUpperCase()}</span>
                  <span className="font-['Space_Mono'] text-[16px] font-bold">{d.num}</span>
                </div>
              </button>
            );
          }
          return (
            <button
              key={d.num}
              onClick={() => setSelectedDate(`${d.day.toUpperCase()} ${d.num}`)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-14 py-2 rounded-lg transition-all border border-white/[0.03] ${
                isSelected
                  ? 'bg-[#ff6b35] text-[#5d1900] font-bold'
                  : 'bg-[#1c2025] text-[#e1bfb5] hover:bg-[#262a30]'
              }`}
            >
              <span className="font-['Space_Mono'] text-[10px] uppercase opacity-75">{d.day}</span>
              <span className="font-['Space_Mono'] text-[14px] text-[#e0e2ea]">{d.num}</span>
            </button>
          );
        })}
      </div>

      {/* Main Broadcast Timeline */}
      <div className="px-5 mt-1 flex flex-col gap-3 relative">
        {/* Slot 1: Aired */}
        <div className="bg-[#181c21] rounded-xl p-4 shadow-sm relative overflow-hidden opacity-80 hover:opacity-100 transition-opacity border border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Mono'] text-[14px] text-[#e1bfb5]">
                {SCHEDULE_SLOTS[0].timeRange}
              </span>
              <span className="bg-[#31353b] text-[#e1bfb5] font-['Space_Mono'] text-[10px] px-2 py-0.5 rounded uppercase">
                Aired
              </span>
            </div>
            <button
              onClick={() => audioEngine.playTick()}
              className="flex items-center gap-1 text-[#ffb59d] hover:text-[#ff6b35] font-['Space_Mono'] text-[11px] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">replay</span>
              <span>Archive</span>
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#1c2025] shadow-inner">
              <img
                className="w-full h-full object-cover"
                src={SCHEDULE_SLOTS[0].avatarUrl}
                alt={SCHEDULE_SLOTS[0].title}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold truncate">
                {SCHEDULE_SLOTS[0].title}
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#e1bfb5] mt-0.5">
                w/ {SCHEDULE_SLOTS[0].host} • {SCHEDULE_SLOTS[0].genre}
              </p>
            </div>
          </div>
        </div>

        {/* Live Needle Calibration Indicator Bar */}
        <div className="relative py-1 flex items-center justify-between my-0.5">
          <div className="h-0.5 flex-1 bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
          <div className="bg-[#ff6b35] text-[#5d1900] font-['Space_Mono'] text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1.5 shadow-[0_0_12px_rgba(255,107,53,0.9)] mx-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#5d1900] animate-ping" />
            <span>CURRENT LOCAL: 11:24</span>
          </div>
          <div className="h-0.5 flex-1 bg-[#ff6b35] shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
        </div>

        {/* Slot 2: ON AIR NOW (Flagship Broadcast Card) */}
        <div className="bg-[#262a30] rounded-xl p-4 shadow-[0_8px_32px_rgba(208,125,11,0.25)] relative overflow-hidden border border-[#ff6b35]/20">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#ff6b35]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-[#d07d0b]/15 rounded-full blur-2xl pointer-events-none" />

          {/* Live Metadata Header */}
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Mono'] text-[14px] text-[#ffb86f] font-bold">
                {SCHEDULE_SLOTS[1].timeRange}
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff6b35] text-[#5d1900] shadow-[0_0_12px_rgba(255,107,53,0.5)]">
                <span className="material-symbols-outlined text-[13px] animate-pulse">sensors</span>
                <span className="font-['Space_Mono'] text-[10px] font-bold uppercase tracking-wider">
                  ON AIR NOW
                </span>
              </div>
            </div>
            <span className="font-['Space_Mono'] text-[11px] text-[#00e297] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00e297] animate-ping" /> 320 KBPS
            </span>
          </div>

          {/* Show Content */}
          <div className="flex gap-3 items-start relative z-10">
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-[#1c2025] relative shadow-lg">
              <img
                className="w-full h-full object-cover"
                src={SCHEDULE_SLOTS[1].avatarUrl}
                alt={SCHEDULE_SLOTS[1].title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-1 right-1 material-symbols-outlined text-[#ffb86f] text-[16px]">
                graphic_eq
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-['Space_Mono'] text-[10px] text-[#ffb86f] uppercase font-bold tracking-wider">
                Flagship Broadcast
              </span>
              <h2 className="font-['Sora'] text-[18px] text-[#e0e2ea] font-bold leading-tight truncate">
                {SCHEDULE_SLOTS[1].title}
              </h2>
              <p className="font-['Inter'] text-[12px] text-[#e1bfb5] mt-0.5">
                w/ {SCHEDULE_SLOTS[1].host}
              </p>
            </div>
          </div>

          {/* Guest Snip & Highlight Pill */}
          <div className="mt-3 p-2 rounded-lg bg-[#1c2025]/80 backdrop-blur-md flex items-center gap-2 text-[#e0e2ea] relative z-10 border border-white/[0.04]">
            <span className="material-symbols-outlined text-[#ffb86f] text-[18px]">chat</span>
            <p className="font-['Inter'] text-[12px] text-[#e1bfb5] truncate">
              <strong className="text-[#e0e2ea]">Live Discussion:</strong> 50 years of Spiritual Jazz & rare West London acetates.
            </p>
          </div>

          {/* Audio Spectrum LED Meter */}
          <div className="mt-3 flex items-center justify-between gap-1 py-1.5 px-2 rounded bg-[#0a0e13]/80 border border-white/[0.02]">
            <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]">VU LEVEL</span>
            <div className="flex items-center gap-1 flex-1 max-w-[160px] h-2">
              <span className="h-full flex-1 bg-[#00e297] rounded-xs" />
              <span className="h-full flex-1 bg-[#00e297] rounded-xs" />
              <span className="h-full flex-1 bg-[#00e297] rounded-xs" />
              <span className="h-full flex-1 bg-[#00e297] rounded-xs" />
              <span className="h-full flex-1 bg-[#ffb86f] rounded-xs" />
              <span className="h-full flex-1 bg-[#ffb86f] rounded-xs" />
              <span className="h-full flex-1 bg-[#ff6b35] animate-pulse rounded-xs" />
              <span className="h-full flex-1 bg-[#31353b] rounded-xs" />
            </div>
            <span className="font-['Space_Mono'] text-[#ffb59d] text-[12px] font-bold">
              -3.2 dB
            </span>
          </div>

          {/* Primary Action CTA & Tracklist Toggler */}
          <div className="mt-4 flex items-center gap-3 relative z-10">
            <button
              onClick={onPlayLive}
              className="flex-1 h-11 flex items-center justify-center gap-2 bg-[#ff6b35] text-[#5d1900] rounded-xl font-['Sora'] text-[16px] font-semibold shadow-[0_0_24px_rgba(255,107,53,0.45)] active:scale-95 hover:brightness-110 transition-all"
            >
              <span
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              <span>{isPlaying ? 'Pause Stream' : 'Listen Live'}</span>
            </button>

            <button
              onClick={() => setIsTracklistOpen(!isTracklistOpen)}
              id="tracklistToggleBtn"
              className="h-11 px-4 flex items-center justify-center gap-1.5 rounded-xl bg-[#36393f] hover:bg-[#31353b] text-[#e0e2ea] transition-all border border-white/[0.05]"
            >
              <span className="material-symbols-outlined text-[18px]">queue_music</span>
              <span className="font-['Space_Mono'] text-[11px] uppercase">Tracks</span>
            </button>
          </div>

          {/* Collapsible Tracklist Drawer */}
          {isTracklistOpen && (
            <div
              id="tracklistDrawer"
              className="mt-3 pt-3 border-t border-white/5 space-y-2 relative z-10 animate-fadeIn"
            >
              <div className="flex items-center justify-between text-[#e1bfb5] font-['Space_Mono'] text-[10px]">
                <span>SPUN RECENTLY</span>
                <span className="text-[#00e297]">CURRENT #04</span>
              </div>
              {SCHEDULE_SLOTS[1].tracks?.map((track, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg ${
                    track.isCurrent ? 'bg-[#1c2025]' : 'bg-[#1c2025]/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        track.isCurrent ? 'bg-[#00e297] animate-ping' : 'bg-[#31353b]'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-['Inter'] text-[12px] text-[#e0e2ea] font-semibold truncate">
                        {track.title}
                      </p>
                      <p className="font-['Space_Mono'] text-[10px] text-[#e1bfb5] truncate">
                        {track.artist}
                      </p>
                    </div>
                  </div>
                  <span className="font-['Space_Mono'] text-[11px] text-[#e1bfb5]">
                    {track.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slot 3: NEXT UP */}
        <div className="bg-[#1c2025] rounded-xl p-4 shadow-sm relative overflow-hidden border border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Mono'] text-[14px] text-[#e0e2ea]">
                {SCHEDULE_SLOTS[2].timeRange}
              </span>
              <span className="bg-[#31353b] text-[#ffb86f] font-['Space_Mono'] text-[10px] px-2 py-0.5 rounded uppercase">
                NEXT UP
              </span>
            </div>
            <button
              onClick={() => toggleReminder('slot-3')}
              className={`remind-btn flex items-center gap-1 font-['Space_Mono'] text-[10px] transition-all px-2.5 py-1 rounded-full ${
                reminders['slot-3']
                  ? 'text-[#ffb86f] bg-[#d07d0b]/30 font-bold'
                  : 'text-[#e1bfb5] hover:text-[#ffb86f] bg-[#262a30]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: reminders['slot-3'] ? "'FILL' 1" : "'FILL' 0" }}
              >
                {reminders['slot-3'] ? 'notifications_active' : 'notifications_none'}
              </span>
              <span>{reminders['slot-3'] ? 'Alert Set' : 'Remind Me'}</span>
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#262a30] shadow-inner">
              <img
                className="w-full h-full object-cover"
                src={SCHEDULE_SLOTS[2].avatarUrl}
                alt={SCHEDULE_SLOTS[2].title}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold truncate">
                {SCHEDULE_SLOTS[2].title}
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#e1bfb5] mt-0.5">
                w/ {SCHEDULE_SLOTS[2].host} • {SCHEDULE_SLOTS[2].genre}
              </p>
            </div>
          </div>
        </div>

        {/* Slot 4: SCHEDULED */}
        <div className="bg-[#1c2025] rounded-xl p-4 shadow-sm relative overflow-hidden border border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-['Space_Mono'] text-[14px] text-[#e1bfb5]">
                {SCHEDULE_SLOTS[3].timeRange}
              </span>
              <span className="bg-[#31353b] text-[#e1bfb5] font-['Space_Mono'] text-[10px] px-2 py-0.5 rounded uppercase">
                SCHEDULED
              </span>
            </div>
            <button
              onClick={() => toggleReminder('slot-4')}
              className={`remind-btn flex items-center gap-1 font-['Space_Mono'] text-[10px] transition-all px-2.5 py-1 rounded-full ${
                reminders['slot-4']
                  ? 'text-[#ffb86f] bg-[#d07d0b]/30 font-bold'
                  : 'text-[#e1bfb5] hover:text-[#ffb86f] bg-[#262a30]'
              }`}
            >
              <span
                className="material-symbols-outlined text-[16px]"
                style={{ fontVariationSettings: reminders['slot-4'] ? "'FILL' 1" : "'FILL' 0" }}
              >
                {reminders['slot-4'] ? 'notifications_active' : 'notifications_none'}
              </span>
              <span>{reminders['slot-4'] ? 'Alert Set' : 'Remind Me'}</span>
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#262a30] shadow-inner">
              <img
                className="w-full h-full object-cover"
                src={SCHEDULE_SLOTS[3].avatarUrl}
                alt={SCHEDULE_SLOTS[3].title}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-['Sora'] text-[16px] text-[#e0e2ea] font-semibold truncate">
                {SCHEDULE_SLOTS[3].title}
              </h3>
              <p className="font-['Inter'] text-[12px] text-[#e1bfb5] mt-0.5">
                w/ {SCHEDULE_SLOTS[3].host} • {SCHEDULE_SLOTS[3].genre}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* On-Demand Archives Carousel */}
      <div className="mt-8 px-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ffb59d] text-[20px]">
              inventory_2
            </span>
            <h2 className="font-['Sora'] text-[20px] leading-[28px] text-[#e0e2ea] font-bold">
              On-Demand Archives
            </h2>
          </div>
          <button className="font-['Space_Mono'] text-[11px] text-[#ffb59d] hover:underline flex items-center gap-0.5 uppercase tracking-wider">
            <span>View All</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          </button>
        </div>

        {ARCHIVE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c2025] rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm hover:bg-[#262a30] transition-colors border border-white/[0.04]"
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-[#181c21] relative cursor-pointer group">
              <img className="w-full h-full object-cover" src={item.coverImage} alt={item.title} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <span className="material-symbols-outlined text-[#e0e2ea] text-[22px]">
                  play_circle
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-['Space_Mono'] text-[10px] text-[#ffb86f]">
                  {item.dateLabel}
                </span>
                <span className="font-['Space_Mono'] text-[10px] text-[#e1bfb5]">
                  • {item.durationLabel}
                </span>
              </div>
              <h4 className="font-['Sora'] text-[15px] text-[#e0e2ea] font-semibold truncate">
                {item.title}
              </h4>
              <p className="font-['Inter'] text-[12px] text-[#e1bfb5] truncate">
                w/ {item.host} • {item.tracksCount} Tracks Cataloged
              </p>
            </div>
            <button
              onClick={() => handleDownload(item.id)}
              className={`w-10 h-10 rounded-full bg-[#262a30] flex items-center justify-center transition-colors flex-shrink-0 ${
                downloads[item.id] === 'done'
                  ? 'text-[#00e297]'
                  : 'text-[#e1bfb5] hover:text-[#00e297]'
              }`}
              title={downloads[item.id] === 'done' ? 'Downloaded' : 'Download Offline'}
            >
              <span className="material-symbols-outlined text-[20px]">
                {downloads[item.id] === 'done'
                  ? 'download_done'
                  : downloads[item.id] === 'downloading'
                  ? 'sync'
                  : 'download'}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
