import { Station, Track, ScheduleSlot, ArchiveItem } from '../types';

export const ASSETS = {
  logo: 'https://lh3.googleusercontent.com/aida/AEtjO1V9CW6cACkRBHNa4xt4eO0B-DaTGHdMY-Kbl84HC0ORQQ59TmQLYtABtvTUC_GKR43ZPHkrfvWpTj64jMuLsMeEynmCUK7Kt4xilDsEhDEiKA1ZYTDKk3evdnzk_PuvN7B0TKhqGRMs4nV9tZVO8hpJXcxMJEHyAiwg4bRLXhjotxkRMWjaO0Hrp6UG1EGUzHqq9jEPBeMFq_9A98g8LUDBSeocqlDbrdoppIS3eEW5w8cQuNZYqCSvec_1',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIsIrb3tka-fLsfkCQeWdcd2mBETZZsy9fmtp5zP49zK60Pjw60z3xKARwG1t2KSwfWQQPwgm10eFgdFxq688_EIgEXJASPMLPxShSegLjn3eByoVsRmhMqI1Q7JUb_n3aVghyBhU6omrJPCBfwodWROgNHpRDl6UPY446yMBH7n9C_Q-ot2oUCLJhM1QJsTCy7-hM7OOmjWO9bst0AFbgAjwrELkHhrslkNKBFsd5Ve0HlU3EuXnGfg',
  albumBabaAyoola: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeUeSbFBurwz_77VQeLnfaC56BFDI3J_c28UesFr57v4yV73ul3_7lRMgflHpsz_jCAWl5jgUEkJ7aNJ0qV0m7V75luiLkyaygokLM1Rrbw-73I0NcABlaXk8mWM9_ye5r1ymJGhzBmcOIHwEenlCrwgh41o86SxHZYWe6OLUY6yJkop0uGgmmzVE7nlAjwiOKFusebaMJd8Gh-zrSWPKxSJM7ePATazJBRvLj10iPygY4kGhZwZZGjA',
  featuredKexp: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYEJpdlLIED2TjUdTc9NyxevnbGNTr2O3an2399_8KnrDSBxG-rUIFN1oO124MAfr7E1OF0Hwx604BkjhhKxLzCecMo1XBYgzY6tPhV65PmB0ylF37MxMlcR5OH2tQwsWT9vWJr6pf_otmwvqH6ooE7fBXpiGvLNb_BPhnBl93zG0w9U_gGOSYCezpY1B4DmtQZRSMtw_q6U3Xz3VpZ89nW6GlwrFvYXGk1rZM_Mr1aytx7O6pbEpQBA',
  worldMap: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfNq7vtI3MjfLAklU3lLovFidLWgaHh5iWuxVOkTaK4l9hwcAX7yeY-u6taPii3iry9DpP6EbHU6-MfZbarL9s6huu7LMc1rLGkfzNp7MAXCkG2q-hN0CWQaFZMj8by7VFi7oeNg9wtf5pm3JDYWoGizNpJ7Sge8-2lGSVDFteeGoQh0yYI3vHI-AL4FprObpQWpLezEzkhBcUkBypEIbDc3TRkEa4C4olXEH5QGcCTv-Yc1qg_ayfPA',
  trendingVinyl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVGUfcIjSAz02Y3JK5DCizdWPfpWkJR_rxEZ_byjXmuXYYOmFcX1BQCCTI-gBjGW8wFHZXOObjrjyT8kjQZzE_vXc-SKYYJGIhJacQCuZQQ2sKP2Hnnmiz5QQ379iZHxpHrRN0IHOFVCTksWc6f_jMUkPcsI0mkxZHfmHqvCmhmk8Fiqz7tNHFhjyJwklmREx8AfN1q0loGuagOjauryB3oYIJJQ-KVxQeY9RaddZDTYtTDwjLbK8YzA',
  trendingAmp: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBImsgdfXWOiBn_QX3U-9-Eyw-MKkYPJo_mlfgZ63TpiIk5dfg5ZsDCRbymioZS0Fd_ZnOsf63eMq5kG856jLEvWe6srqAlJpUagmAvv4LSHUgCZD0_OkZFYwEJL2WqH4F7W0wjt1sABSG67k6meMAihmNsn-r78AHO87FcghqiTmqiLkcb_UtDiob27nhwNS7zg1uP0_IgZf6iACF6T2m0b9OXpTz-G-53nLc_9Xn6-Rpwd4IncyZVGA',
  trendingSynth: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSOCNAKCAwjjqTq3VMsELpop4i44ChhyQe_sECSh88gkJyruagbQR7NTSdplV9p5CnMeC3c_ZyvYz4hVusKrEf5J4H5wLM_XQ10mO-21WBFb6XeKu5uty9slDkUX7kBIorn-2oFd9aQB0VBeE-pn2BGQKjUaocUgCHaXilqEPnS31AHHRwo8e-dQdmdMuxQs0sRR7tIi-kC7-v5StG8CtcEM5l9pwb94WqCzh4gsAnwGVCRrnedd5wXw',
  scheduleElena: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9J1xrPEpgt1JG6zmm4ynhwVDXp9_pET_oeT71aYgrGyQYWlfxdgmao3b0f59maGhYbSV-gD5yQuiEKSw6L7ilsnVpI3tRMxnHnKCrpXeibMybd236vOnpokbmfEgb8a4lG35zMfYVBWRnpE8OtxZ7mVefDa_56ZHjwRnEoAJ2M2IxljtjgfD3xCMR9Pyqc_irMThd6ZlH-1C2loEbmshA908lAJnzUXoIY7pOAWg9AotsLM5Jcv164Q',
  scheduleGilles: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9MEGEvR9UZIO0ILvY9vvyUOlv3saXci-TnkWaQ_MMkFvvYhw-FrevU35RoscEQ2SMHLkWLx73QEAl5LnjCvT4wMZnO83-Jt1Cnk3RsuDQMqnSyV9w69Q11UjDBBbY-2yKzHsqrDuSrYfEz06Vwf22ekuwWz-nj7M9jRAwy1gabqV4jLqF4sb2aUr4WLUHNMVcK5ch-5USm6PlGFlFPTY9F_qoMTeq8RJeXorsbLBNlrQN9Y0Dszn6CA',
  scheduleMarcel: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxTiVvQpwRF1jqg1zVYghm5z9uqch-gEeHIF1_q724eLTLzL_F9p0o9sGxJyYv3ToWl5XcWn2mXO-rd0R0M_LZeWDlrQxnw_-G_QUn28rAEYHj_1-1TYCAsVU8i5L5aQ_756Y7csdsuwKddQWCAKJfC6oFJmjaFwUGi58TmwH-1Inpl4ywQm02CAEcCg5Egk0-e0A0ZnOwZRaZjDHB8crIpUgByFdvlKnnGat6MHsYgrHDKUTreH63fw',
  scheduleAuntie: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD17A5bPuvKfnBj3bSBq4qzcAbDeJvUSuzcyusnMlNSIWHBPQZv4GXOIGs0BxtqtmvmS6rsUdTv7LxJM5pqW5-_TUer8YL4H9XDuxSQcHJVn9ckdQgv_cdB1kkpFN0nEPB6pRBG9qz0BXqc49ITIgIdxzz2pRzOkvFDK2zVUAOzM4q4LQ5IXrE5zud6w0AQcogijVTZTPrtOB4Ia4iI5mHNE6NyQ6zE6mBB-0HHMADNEzzQV5Gbqn_n9A',
  archiveTape: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqFQimyiJsiuo_w2BxpT8DUfp7gREoZ45_6wuDwb0-he68db1FnaFPB1J22Murbw-ZcQmGNOytp2NGJ3oM7yg1M8LWC9D97T6BzeXt9aR2puhi07khJnsM5g14oyTZiBdFsboNKmMU5I1HzbwsFWTySP52yCFwXu6hncoEyDc9MZmc9qmcNVisX4vjGstUEt4MtCStWe086Lp7V7lovKZ4OfUbLdDOqXXytLX1MdMX117XGbw34grZJw',
  archiveMic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcA865-IVOAOk9rm5jX8axqZ1TRV-Ls7kfJJkQjO3HdeuPRXRcZTwNfKY0alB6M68oZB-C51ZgG0TjsEWQ_shzhbjPI2K4s7CMeDj0-RtiaOL-HXDIUmtkpKNXTOokBOq_bdLJJrx2EMeH0fAL6A-TRMDDpRf90sVqWKIldtSbvYDIN_lFHAW21jcCnkjolpYZldLp0fKHfhRzA_a9gkHaQxl5hoNuNxMiW_1QjlQK6ZsWlnDsbkaZVg',
  trackFloatingPoints: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfEcswZTJMBBI8C5pKP_17At78-Lgf5hN1E4tzdO30ULorsBw1M41fLGqxn3O6RSb-yJrTygE8EDtVGAcaZN5KoXtlsTA8u_9n33IKZ-D_ml9fhUqNURlmUNONpIEp5n_FXsx8P-OTQNekGP_mPUmh-92mHCtnon0dca7DbHRk62Y1Rz2mwMqrWBQQNDkzvTS6dzUSArn57p9NfyN8dCqirT2DCnV79pdiD8fi4mHIjOwEBMYw1SBu4A',
  trackYussef: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbAU7mngl8L1iyJXkXOazCUVAB5U9YKsEMX4a7cY8R0UkY_bU2xFKvJZjjhV2cEnpC3FKtIflQetm7oZwmhtGcFeHRi3EDGYJOEJrM6Ma2Vr4LF0nns4qqw3a6C1zwAp-RRb79nsrfWKtOBDSl_cSRW12xHfss3lcYyt6McC6vEJWageuX1UlDNoggd0b082Ss-GFz2VJuYG0SyXn-SJEfwWKIGe_uA0yehfcT4DuMOUceiDqpNs_yeg',
  trackBicep: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSsGWbjBU_Vx8wBNtAyLGysvCkesk-ur_ovxPgrtkdwi7dcd09RLEEbEKOOEz-7snEVPGZyHcNhC7z5u_yJSYYV_WNDt3J0hxR6zEHq1fcGPIRzW-kjU13SomCRTyJgfFGn1FVOCq3W5jLjnom6zEFj6KuZRZNE_nFLTNYPARROnkRCfaj-secsTJmVQSR-D1tJ2zQJyggBPSmvt0QKOJXBbzDXs-ncM_UiXCqMVOhtCnWt9HWd1io6Q',
};

export const STATIONS: Station[] = [
  {
    id: 'worldwide-fm',
    frequency: 102.4,
    frequencyDisplay: '102.4',
    name: 'Worldwide FM',
    genre: 'Neo-Soul & Grooves',
    location: 'London, UK',
    band: 'FM',
    signalStrength: 98,
    listenersCount: 42850,
    isFavorite: true,
    bitrate: '320kbps HD',
    djName: 'Gilles P.',
    currentTrack: {
      id: 'track-baba-ayoola',
      title: 'Baba Ayoola',
      artist: 'KOKOROKO',
      showName: 'MORNING SOUNDSCAPES • GILLES P.',
      albumArt: ASSETS.albumBabaAyoola,
      tag: 'AFROBEAT',
      year: 'REC 2024',
      isFavorite: true,
    }
  },
  {
    id: 'kexp',
    frequency: 90.3,
    frequencyDisplay: '90.3',
    name: 'KEXP Seattle',
    genre: 'Indie Rock / Post-Punk',
    location: 'Seattle, USA',
    band: 'FM',
    signalStrength: 94,
    listenersCount: 14820,
    isFavorite: true,
    bitrate: '320kbps HD',
    djName: 'DJ Kevin Cole',
    description: 'Where the Music Matters • The Midday Show live from Seattle',
    currentTrack: {
      id: 'track-kexp-now',
      title: 'Neon Skyline',
      artist: 'Andy Shauf',
      showName: 'THE MIDDAY SHOW',
      albumArt: ASSETS.featuredKexp,
      tag: 'INDIE',
      year: 'REC 2023',
    }
  },
  {
    id: 'nts-1',
    frequency: 89.9,
    frequencyDisplay: '89.9',
    name: 'NTS Radio 1',
    genre: 'Leftfield / Modular',
    location: 'Hackney, UK',
    band: 'FM',
    signalStrength: 99,
    listenersCount: 28400,
    isFavorite: true,
    bitrate: '320kbps HD',
    currentTrack: {
      id: 'track-bicep',
      title: 'Cerulean Drift (Live Session)',
      artist: 'Bicep',
      showName: 'MODULAR SESSIONS',
      albumArt: ASSETS.trackBicep,
      tag: 'ELECTRONIC',
      year: 'REC 2024',
    }
  },
  {
    id: 'jazz-fm',
    frequency: 91.8,
    frequencyDisplay: '91.8',
    name: 'Jazz FM',
    genre: 'Smooth Jazz / Fusion',
    location: 'Manchester, UK',
    band: 'FM',
    signalStrength: 91,
    listenersCount: 19300,
    isFavorite: true,
    bitrate: '256kbps',
    currentTrack: {
      id: 'track-komorebi',
      title: 'Komorebi Sunlight',
      artist: 'Yussef Dayes',
      showName: 'THE JAZZ MEZZANINE',
      albumArt: ASSETS.trackYussef,
      tag: 'JAZZ FUSION',
      year: 'REC 2024',
    }
  },
  {
    id: 'sub-bass',
    frequency: 104.2,
    frequencyDisplay: '104.2',
    name: 'SUB_BASS Radio',
    genre: 'Underground Dub & Bass',
    location: 'Bristol, UK',
    band: 'FM',
    signalStrength: 96,
    listenersCount: 11200,
    isFavorite: false,
    bitrate: '320kbps HD',
    currentTrack: {
      id: 'track-sub-1',
      title: 'Subterranean Glow',
      artist: 'Floating Points',
      showName: 'LOW FREQUENCY OSCILLATIONS',
      albumArt: ASSETS.trackFloatingPoints,
      tag: 'SUB-BASS',
      year: 'REC 2024',
    }
  },
  {
    id: 'rinse-fm',
    frequency: 106.8,
    frequencyDisplay: '106.8',
    name: 'Rinse FM London',
    genre: 'Grime, Dubstep & UK Garage Archives',
    location: 'London, UK',
    band: 'FM',
    signalStrength: 100,
    listenersCount: 33500,
    isFavorite: false,
    bitrate: '320kbps HD',
    currentTrack: {
      id: 'track-rinse-1',
      title: 'Forward Rhythm',
      artist: 'Skepta & Jme',
      showName: 'PIRATE ARCHIVES',
      albumArt: ASSETS.trendingAmp,
      tag: 'GRIME',
      year: 'REC 2024',
    }
  },
  {
    id: 'radio-nova',
    frequency: 101.5,
    frequencyDisplay: '101.5',
    name: 'Radio Nova Paris',
    genre: 'Le Grand Mix • Afrobeat & Rare Groove',
    location: 'Paris, FR',
    band: 'FM',
    signalStrength: 72,
    listenersCount: 22100,
    isFavorite: false,
    bitrate: '256kbps',
    currentTrack: {
      id: 'track-nova-1',
      title: 'Soul Makossa Reprise',
      artist: 'Manu Dibango',
      showName: 'LE GRAND MIX',
      albumArt: ASSETS.trendingSynth,
      tag: 'RARE GROOVE',
      year: 'REC 2024',
    }
  },
  {
    id: 'bbc-6',
    frequency: 97.2,
    frequencyDisplay: '97.2',
    name: 'BBC 6 Music',
    genre: 'Alternative & Post-Punk',
    location: 'London, UK',
    band: 'DAB+',
    signalStrength: 95,
    listenersCount: 54100,
    isFavorite: true,
    bitrate: '320kbps HD',
    currentTrack: {
      id: 'track-bbc-1',
      title: 'Blue Monday (Peel Session)',
      artist: 'New Order',
      showName: 'THE FREAK ZONE',
      albumArt: ASSETS.trendingVinyl,
      tag: 'SYNTH POP',
      year: 'REC 2023',
    }
  }
];

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  {
    id: 'slot-1',
    timeRange: '08:00 — 10:00',
    status: 'AIRED',
    title: 'The Morning Ambient Routine',
    host: 'Elena Vance',
    genre: 'Deep Drone, Modern Classical',
    avatarUrl: ASSETS.scheduleElena,
  },
  {
    id: 'slot-2',
    timeRange: '10:00 — 12:00',
    status: 'ON_AIR',
    title: 'Future Jazz & Broken Beats',
    host: 'Gilles Peterson & Guest Lonnie Liston Smith',
    genre: 'Spiritual Jazz, Broken Beat, Rare Groove',
    avatarUrl: ASSETS.scheduleGilles,
    isFlagship: true,
    discussionSnippet: '50 years of Spiritual Jazz & rare West London acetates.',
    vuDb: '-3.2 dB',
    tracks: [
      { title: 'Visions of the Third Eye', artist: 'New Horizons Quintet', time: '11:21', isCurrent: true },
      { title: 'Broken Suburbia (Kaidi Tatham Remix)', artist: 'Dego & Kaidi', time: '11:15' },
      { title: 'Expansions (Original 1975 Master)', artist: 'Lonnie Liston Smith', time: '10:52' },
      { title: 'Ancestral Walk', artist: 'KOKOROKO', time: '10:30' }
    ]
  },
  {
    id: 'slot-3',
    timeRange: '12:00 — 14:00',
    status: 'NEXT_UP',
    title: 'Global Underground Dispatch: Berlin Club Culture',
    host: 'DJ Marcel',
    genre: 'Raw Techno, Minimal, Warehouse Dub',
    avatarUrl: ASSETS.scheduleMarcel,
    reminded: false,
  },
  {
    id: 'slot-4',
    timeRange: '14:00 — 16:00',
    status: 'SCHEDULED',
    title: 'Vinyl Archaeology: Rare 70s Funk & Afrobeat',
    host: 'Auntie Flo',
    genre: 'Highlife, Lagos Funk, Analog Masters',
    avatarUrl: ASSETS.scheduleAuntie,
    reminded: false,
  }
];

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: 'arch-1',
    title: 'Analog Horizon: Modular Synthesis Special',
    host: 'Kuedo',
    tracksCount: 28,
    dateLabel: 'YESTERDAY',
    durationLabel: '120 MIN',
    coverImage: ASSETS.archiveTape,
    downloaded: false,
  },
  {
    id: 'arch-2',
    title: 'Mid-Atlantic Soul Odyssey',
    host: 'Donna Leake',
    tracksCount: 34,
    dateLabel: 'OCT 14',
    durationLabel: '114 MIN',
    coverImage: ASSETS.archiveMic,
    downloaded: true,
  }
];

export const HEARD_ON_RADIO_TRACKS: Track[] = [
  {
    id: 'heard-1',
    title: 'Subterranean Glow',
    artist: 'Floating Points',
    frequencyLabel: '102.4 FM',
    timeAgo: '12 mins ago on 102.4 FM',
    albumArt: ASSETS.trackFloatingPoints,
    tag: 'SUB-BASS',
  },
  {
    id: 'heard-2',
    title: 'Komorebi Sunlight',
    artist: 'Yussef Dayes',
    frequencyLabel: '91.8 Jazz FM',
    timeAgo: '46 mins ago on 91.8 FM',
    albumArt: ASSETS.trackYussef,
    tag: 'JAZZ FUSION',
  },
  {
    id: 'heard-3',
    title: 'Cerulean Drift (Live Session)',
    artist: 'Bicep',
    frequencyLabel: '89.9 NTS Radio',
    timeAgo: '2 hrs ago on 89.9 FM',
    albumArt: ASSETS.trackBicep,
    tag: 'ELECTRONIC',
  }
];

export const WORLD_RELAYS = [
  { city: 'TOKYO', freq: '81.3', station: 'J-WAVE Roppongi', color: '#00e297' },
  { city: 'BERLIN', freq: '91.1', station: 'FluxFM Spree', color: '#ff6b35' },
  { city: 'LONDON', freq: '104.9', station: 'NTS Radio Hackney', color: '#d07d0b' },
  { city: 'NYC', freq: '89.9 FM', station: 'WKCR Morningside', color: '#00af74' },
];

export const GENRE_BANDS = [
  {
    category: 'SOUL SPECTRUM',
    name: 'Jazz & Soul',
    towers: 42,
    gradient: 'from-[#1b2430] to-[#2a1b12]',
    color: '#ffb86f',
    icon: 'album'
  },
  {
    category: 'LOW-RES RESONANCE',
    name: 'Ambient & Lo-Fi',
    towers: 67,
    gradient: 'from-[#122220] to-[#0a1618]',
    color: '#00e297',
    icon: 'cloud'
  },
  {
    category: 'SUB-BASS GRID',
    name: 'Underground Techno',
    towers: 31,
    gradient: 'from-[#2a130f] to-[#120a14]',
    color: '#ff6b35',
    icon: 'speaker'
  },
  {
    category: 'SHORTWAVE RELAY',
    name: 'Global News & BBC',
    towers: 118,
    gradient: 'from-[#151c27] to-[#1a1c30]',
    color: '#ffb59d',
    icon: 'public'
  },
  {
    category: 'ANALOG 1984',
    name: 'Vintage Synthwave',
    towers: 29,
    gradient: 'from-[#25102a] to-[#3a1518]',
    color: '#ffdcbe',
    icon: 'mobile_share_stack'
  },
  {
    category: 'ACOUSTIC CHAMBER',
    name: 'Classical & Opera',
    towers: 54,
    gradient: 'from-[#161c1a] to-[#121922]',
    color: '#4dffb2',
    icon: 'music_note'
  }
];
