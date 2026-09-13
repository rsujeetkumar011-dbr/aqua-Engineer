import React, { useState } from 'react';
import { ScreenId } from '../types';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenCriticalAlerts: () => void;
  criticalCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenCriticalAlerts,
  criticalCount,
  searchQuery,
  setSearchQuery,
  onToggleMobileMenu,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest/90 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
      <div className="h-16 w-full px-4 lg:px-6 flex items-center justify-between gap-3">
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 min-w-max">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 rounded text-outline hover:text-on-surface hover:bg-surface-container-low"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]">menu</span>
          </button>

          <div
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              alt="AquaFlow Ops Logo"
              className="h-8 w-8 object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1WgInse8TUnTn8SEDw31Nm8Ci3uL9RzCkIlqIZccLaJcoIghaZ6mAXbt-g1Bkyy1v8qvtmyQhhm9Mia4iR9dHPywK90zwBMMHAhrX9mwboZ6rz-m4SC0C3zvynCdYx0aCTm4cvYbLNsYrkG7qxqJ9PSPkfNy7rO_3lz89NkvyXdjyViG8gKrWSlrR9dMh7y4In59T6SFZEyaf0ihmCgDuk4XblQWdFSPnBBMSH0oA9ykzk3zczzKxPAxzA"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              AquaFlow Ops
            </span>
          </div>
        </div>

        {/* Live SCADA Telemetry Badge */}
        <div className="hidden xl:flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded border border-outline-variant/30">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label-caps text-label-caps uppercase text-tertiary font-bold tracking-wider">
            System Telemetry
          </span>
          <span className="font-data-mono-sm text-data-mono-sm text-on-surface-variant font-medium">
            District 4 Grid: Online - 99.4% Flow Normal
          </span>
        </div>

        {/* Global Search Input */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-outline text-[18px] pointer-events-none">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low text-on-surface placeholder:text-outline font-body-sm text-body-sm pl-9 pr-8 py-1.5 rounded focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 transition-all"
              placeholder="Search telemetry, sensor ID, mains, work orders..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-outline hover:text-on-surface text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 min-w-max">
          {/* Critical Alerts Button */}
          <button
            onClick={onOpenCriticalAlerts}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-container text-on-error-container hover:bg-error hover:text-on-error transition-colors shadow-sm cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] animate-pulse">warning</span>
            <span className="font-label-caps text-label-caps font-semibold">
              {criticalCount} Critical
            </span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <div
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 border-l border-outline-variant/40 cursor-pointer hover:opacity-90"
            >
              <div className="text-right hidden sm:block">
                <p className="font-body-sm text-body-sm font-semibold text-on-surface leading-tight">
                  Marcus Vance
                </p>
                <p className="font-label-caps text-label-caps uppercase text-outline leading-tight">
                  Operations Lead
                </p>
              </div>
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgcGnbYU5aR49tYVZDhVK-84QyMHUVF-xA4Q4E1QZreisLSS30R3GI9wJ5D789wR9bvKV3498qVLat6hP9y2HjbZuonT-2TM2PPOOY4-DtAzntaLsDIFGGJBQFmx5ga7GUwRVnqQJZWTdsQIOdLgAWbx_XNrxtAU1DjLexhu4B-flGesKcUJKHPJ_xNLxRAZhezV9-49faoc2TLC-nSmLNGuCqNxpjz1CIxpYYBHFsNyhW53OEPSc0rQ"
              />
            </div>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-lowest rounded-lg shadow-xl border border-outline-variant/30 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-surface-container">
                  <p className="font-body-sm text-body-sm font-semibold text-on-surface">
                    Marcus Vance, PE
                  </p>
                  <p className="font-data-mono-sm text-data-mono-sm text-outline">
                    ID: LEAD-ENG-0842
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-tertiary font-data-mono-sm text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                    <span>Active Shift: 08:00 - 18:00 UTC</span>
                  </div>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => {
                      onNavigate('settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-body-sm hover:bg-surface-container flex items-center gap-2 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      settings
                    </span>
                    <span>SCADA Console Preferences</span>
                  </button>
                  <button
                    onClick={() => {
                      onNavigate('audit-trail');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-1.5 text-body-sm hover:bg-surface-container flex items-center gap-2 text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px] text-outline">
                      history
                    </span>
                    <span>My Actuation Audit Log</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
