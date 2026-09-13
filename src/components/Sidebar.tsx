import React from 'react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  criticalCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  mobileOpen,
  onCloseMobile,
  criticalCount,
}) => {
  const supervisoryItems: { id: ScreenId; label: string; icon: string; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard & Map', icon: 'grid_view' },
    {
      id: 'issues',
      label: 'Issue Registration',
      icon: 'notification_important',
      badge: criticalCount > 0 ? `${criticalCount}` : undefined,
    },
    { id: 'field-teams', label: 'Field Team Management', icon: 'group_work', badge: '6/8' },
    { id: 'reports', label: 'Monthly Report Generator', icon: 'analytics' },
  ];

  const governanceItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'settings', label: 'System Settings', icon: 'settings' },
    { id: 'emergency-protocols', label: 'Emergency Protocols', icon: 'emergency_home' },
    { id: 'audit-trail', label: 'Audit Trail', icon: 'history_toggle_off' },
  ];

  const handleItemClick = (screen: ScreenId) => {
    onNavigate(screen);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-inverse-surface/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      {/* Main Sidebar Rail */}
      <aside
        className={`fixed left-0 top-16 bottom-0 w-64 bg-surface-container-lowest z-30 flex flex-col justify-between border-r border-outline-variant/20 shadow-[0_1px_8px_rgba(0,0,0,0.02)] transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Supervisory Operations Section */}
        <div className="flex flex-col pt-space-md">
          <div className="px-space-md pb-space-xs flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
              Supervisory Operations
            </span>
          </div>

          <nav className="flex flex-col gap-1 px-space-sm">
            {supervisoryItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center justify-between px-space-md py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md'
                  }`}
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-data-mono-sm font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.id === 'issues'
                            ? 'bg-error-container text-on-error-container'
                            : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Governance Section */}
        <div className="flex flex-col pb-space-md pt-space-sm border-t border-outline-variant/20">
          <div className="px-space-md pb-space-xs">
            <span className="font-label-caps text-label-caps uppercase text-outline tracking-wider">
              System Governance
            </span>
          </div>

          <nav className="flex flex-col gap-1 px-space-sm">
            {governanceItems.map((item) => {
              const isActive = currentScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-space-sm px-space-md py-2 rounded-lg transition-all text-left ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick System Health Pill */}
          <div className="mx-space-sm mt-space-md p-2 bg-surface-container-low rounded border border-outline-variant/20 flex items-center justify-between text-[11px] font-data-mono-sm">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-on-surface-variant">SCADA Gateway</span>
            </div>
            <span className="text-tertiary font-semibold">ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
};
