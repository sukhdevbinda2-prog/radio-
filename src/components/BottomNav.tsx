import React from 'react';
import { ScreenTab } from '../types';

interface BottomNavProps {
  activeTab: ScreenTab;
  onChangeTab: (tab: ScreenTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs: { id: ScreenTab; label: string; icon: string }[] = [
    { id: 'tuner', label: 'Tuner', icon: 'podcasts' },
    { id: 'explore', label: 'Explore', icon: 'explore' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar_today' },
    { id: 'library', label: 'Library', icon: 'radio' },
  ];

  return (
    <nav className="w-full">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[44px] transition-all cursor-pointer ${
                isActive
                  ? 'text-[#ffb59d] font-bold drop-shadow-[0_0_8px_rgba(255,181,157,0.3)]'
                  : 'text-[#e1bfb5] hover:text-[#e0e2ea]'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <span
                className="material-symbols-outlined text-[22px] transition-transform active:scale-90"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span className="font-['Space_Mono'] text-[11px] leading-[14px] tracking-normal">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
