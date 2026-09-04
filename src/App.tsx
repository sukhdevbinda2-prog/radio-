import { useState, useEffect } from 'react';
import { ScreenTab, Station, EqProfile } from './types';
import { STATIONS } from './data/radioData';
import { audioEngine } from './services/audioEngine';
import { Header } from './components/Header';
import { BottomPlayer } from './components/BottomPlayer';
import { BottomNav } from './components/BottomNav';
import { TunerScreen } from './components/TunerScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { ScheduleScreen } from './components/ScheduleScreen';
import { LibraryScreen } from './components/LibraryScreen';
import { SettingsModal } from './components/SettingsModal';
import { ProfileModal } from './components/ProfileModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('tuner');
  const [stations, setStations] = useState<Station[]>(STATIONS);
  const [currentStation, setCurrentStation] = useState<Station>(STATIONS[0]);
  const [frequency, setFrequency] = useState<number>(102.4);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentEqProfile, setCurrentEqProfile] = useState<EqProfile>('Warm Analog Tube');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  // Initialize audio engine on first user interaction
  const handleTogglePlay = () => {
    audioEngine.playTick();
    const playing = audioEngine.togglePlay();
    setIsPlaying(playing);
  };

  const handleFrequencyChange = (newFreq: number) => {
    setFrequency(newFreq);
    // Find closest station
    const matched = stations.find((s) => Math.abs(s.frequency - newFreq) < 0.2);
    if (matched && matched.id !== currentStation.id) {
      setCurrentStation(matched);
    }
  };

  const handleSelectStation = (station: Station) => {
    audioEngine.playTick();
    setCurrentStation(station);
    setFrequency(station.frequency);
    audioEngine.setFrequency(station.frequency);
  };

  const handleToggleFavoriteCurrent = () => {
    audioEngine.playTick();
    setStations((prev) =>
      prev.map((s) =>
        s.id === currentStation.id ? { ...s, isFavorite: !s.isFavorite } : s
      )
    );
    setCurrentStation((prev) => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleChangeEqProfile = (profile: EqProfile) => {
    setCurrentEqProfile(profile);
    audioEngine.setEqProfile(profile);
  };

  // Sync isFavorite on current station change
  const isCurrentFavorite = Boolean(
    stations.find((s) => s.id === currentStation.id)?.isFavorite
  );

  const favoriteStations = stations.filter((s) => s.isFavorite);

  useEffect(() => {
    // Warm default DSP profile
    audioEngine.setEqProfile('Warm Analog Tube');
  }, []);

  return (
    <div className="bg-[#0b0f14] min-h-screen text-[#e0e2ea] flex justify-center selection:bg-[#ff6b35]/30 selection:text-[#ffb59d]">
      {/* Centered Mobile/Tablet Frame for Pixel-Perfect Experience */}
      <div className="w-full max-w-md bg-[#101419] min-h-screen flex flex-col relative shadow-[0_0_80px_rgba(0,0,0,0.9)] border-x border-white/[0.04]">
        {/* Fixed Header */}
        <Header
          activeTab={activeTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        {/* Scrollable Main Content */}
        <main className="flex-1 flex flex-col relative w-full pt-16 pb-36 bg-[#101419]">
          {activeTab === 'tuner' && (
            <TunerScreen
              currentStation={currentStation}
              frequency={frequency}
              onFrequencyChange={handleFrequencyChange}
              isPlaying={isPlaying}
              onTogglePlay={handleTogglePlay}
              favoriteStations={favoriteStations}
              onSelectStation={handleSelectStation}
              onOpenEq={() => setIsSettingsOpen(true)}
            />
          )}

          {activeTab === 'explore' && (
            <ExploreScreen
              stations={stations}
              onSelectStation={handleSelectStation}
              onOpenTuner={() => setActiveTab('tuner')}
            />
          )}

          {activeTab === 'schedule' && (
            <ScheduleScreen
              onOpenTuner={() => setActiveTab('tuner')}
              onPlayLive={handleTogglePlay}
              isPlaying={isPlaying}
            />
          )}

          {activeTab === 'library' && (
            <LibraryScreen
              favoriteStations={favoriteStations}
              onSelectStation={handleSelectStation}
              onOpenTuner={() => setActiveTab('tuner')}
              currentEqProfile={currentEqProfile}
              onChangeEqProfile={handleChangeEqProfile}
            />
          )}
        </main>

        {/* Fixed Bottom Controls & Navigation Container */}
        <div className="fixed bottom-0 w-full max-w-md z-50 pb-safe bg-[#101419]/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(0,0,0,0.6)] border-t border-white/[0.04]">
          <BottomPlayer
            currentStation={currentStation}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
            isFavorite={isCurrentFavorite}
            onToggleFavorite={handleToggleFavoriteCurrent}
            onOpenTuner={() => setActiveTab('tuner')}
          />
          <BottomNav activeTab={activeTab} onChangeTab={setActiveTab} />
        </div>

        {/* Settings and Profile Modals */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          currentProfile={currentEqProfile}
          onSelectProfile={handleChangeEqProfile}
        />

        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </div>
  );
}
