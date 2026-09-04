export type Waveband = 'FM' | 'AM' | 'DAB+' | 'WEB';

export type ScreenTab = 'tuner' | 'explore' | 'schedule' | 'library';

export type EqProfile = 'Warm Analog Tube' | 'Crisp Vocal Voice' | 'Bass Boost (+6dB)' | 'Flat Studio Ref';

export interface Station {
  id: string;
  frequency: number; // e.g. 102.4
  frequencyDisplay: string; // e.g. "102.4"
  name: string;
  genre: string;
  location: string;
  band: Waveband;
  description?: string;
  currentTrack?: Track;
  signalStrength: number; // 0 - 100
  listenersCount: number;
  isFavorite: boolean;
  streamUrl?: string;
  bitrate?: string;
  djName?: string;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  showName?: string;
  albumArt: string;
  tag: string;
  year?: string;
  frequencyLabel?: string;
  timeAgo?: string;
  duration?: string;
  isFavorite?: boolean;
}

export interface ScheduleSlot {
  id: string;
  timeRange: string;
  status: 'AIRED' | 'ON_AIR' | 'NEXT_UP' | 'SCHEDULED';
  title: string;
  host: string;
  genre: string;
  avatarUrl: string;
  isFlagship?: boolean;
  discussionSnippet?: string;
  vuDb?: string;
  tracks?: { title: string; artist: string; time: string; isCurrent?: boolean }[];
  reminded?: boolean;
}

export interface ArchiveItem {
  id: string;
  title: string;
  host: string;
  tracksCount: number;
  dateLabel: string;
  durationLabel: string;
  coverImage: string;
  downloaded: boolean;
}
