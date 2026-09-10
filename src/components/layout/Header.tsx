import React, { useState, useEffect } from 'react';
import { Sun, Moon, Monitor, Sliders, PlayCircle, FolderArchive, Menu, X, Check } from 'lucide-react';
import { WorkflowStep } from '../../types/screening';
import { useTheme } from '../../context/ThemeContext';
import { NetraRakshakLogo } from '../brand/NetraRakshakLogo';

interface HeaderProps {
  currentStep: WorkflowStep;
  isHomeActive: boolean;
  onNavigateHome: () => void;
  onStartScreening: () => void;
  onOpenBenchmark: () => void;
  onOpenSettings: () => void;
  backendStatus?: { isOnline: boolean; url: string; latencyMs?: number };
}

export const Header: React.FC<HeaderProps> = ({
  currentStep,
  isHomeActive,
  onNavigateHome,
  onStartScreening,
  onOpenBenchmark,
  onOpenSettings,
  backendStatus,
}) => {
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMobileNav = (action: () => void) => {
    setIsMobileMenuOpen(false);
    action();
  };

  return (
    <header className="border-b border-[var(--border-app)] bg-[var(--bg-surface)] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Official Brand Identity */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => {
            setIsMobileMenuOpen(false);
            onNavigateHome();
          }}
          id="brand-logo-button"
          role="button"
          tabIndex={0}
          aria-label="NetraRakshakAI Home"
        >
          {/* Desktop Full Lockup */}
          <div className="hidden sm:block">
            <NetraRakshakLogo variant="full" size={34} />
          </div>

          {/* Mobile Compact Lockup */}
          <div className="block sm:hidden">
            <NetraRakshakLogo variant="compact" size={28} />
          </div>
        </div>

        {/* Center: Desktop Workstation Navigation */}
        <nav
          className="hidden md:flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]"
          aria-label="Main Navigation"
        >
          <button
            type="button"
            onClick={onStartScreening}
            id="nav-screening-btn"
            className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 min-h-[36px] ${
              !isHomeActive
                ? 'text-rose-600 dark:text-rose-400 bg-rose-500/10 font-semibold'
                : 'hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Screening</span>
          </button>

          <button
            type="button"
            onClick={onOpenBenchmark}
            id="nav-cases-btn"
            className="px-3 py-1.5 rounded-md hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1.5 min-h-[36px]"
            title="Open Curated Benchmark Cases"
          >
            <FolderArchive className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Cases</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            id="nav-settings-btn"
            className="px-3 py-1.5 rounded-md hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-1.5 min-h-[36px]"
            title="Screening Threshold and Facility Settings"
          >
            <Sliders className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Right: Desktop Controls (Theme Switcher & Status) */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Edge status micro-indicator */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded border border-[var(--border-app)] text-[10px] font-mono text-[var(--text-muted)]"
            title={
              backendStatus?.isOnline
                ? `Configured screening service connected: ${backendStatus.url}`
                : `Configured screening service unavailable: ${backendStatus?.url || 'unknown'}`
            }
          >
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block ${
                backendStatus?.isOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <span>{backendStatus?.isOnline ? 'Edge Ready' : 'Edge Offline'}</span>
          </div>

          {/* Theme switcher segmented control */}
          <div
            className="flex items-center p-0.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
            role="group"
            aria-label="Theme selection"
          >
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'light'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'hover:text-[var(--text-primary)]'
              }`}
              title="Light theme"
              aria-label="Select light theme"
              aria-pressed={theme === 'light'}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'dark'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'hover:text-[var(--text-primary)]'
              }`}
              title="Dark theme"
              aria-label="Select dark theme"
              aria-pressed={theme === 'dark'}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setTheme('system')}
              className={`p-1.5 rounded-md transition-colors ${
                theme === 'system'
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                  : 'hover:text-[var(--text-primary)]'
              }`}
              title="System theme"
              aria-label="Follow system theme"
              aria-pressed={theme === 'system'}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Toggle Button */}
        <div className="flex md:hidden items-center gap-2">
          {/* Subtle status dot on mobile */}
          <div
            className="w-2 h-2 rounded-full bg-emerald-500"
            title="Edge engine online"
            aria-label="System status online"
          />

          <button
            type="button"
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label={isMobileMenuOpen ? 'Close clinical menu' : 'Open clinical menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Clinical Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden border-b border-[var(--border-app)] bg-[var(--bg-surface)] px-4 py-4 space-y-4 shadow-xl transition-all"
          id="mobile-navigation-drawer"
        >
          {/* Primary Mobile Navigation Actions */}
          <div className="space-y-1">
            <button
              type="button"
              id="mobile-nav-screening"
              onClick={() => handleMobileNav(onStartScreening)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium transition-colors min-h-[44px] ${
                !isHomeActive
                  ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold border border-rose-500/30'
                  : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <PlayCircle className="w-4 h-4 text-rose-500" />
                <span>Screening Workstation</span>
              </div>
              {!isHomeActive && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400">
                  ACTIVE
                </span>
              )}
            </button>

            <button
              type="button"
              id="mobile-nav-cases"
              onClick={() => handleMobileNav(onOpenBenchmark)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <FolderArchive className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Benchmark Cases (ICDR 0–4)</span>
              </div>
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                6 Cases
              </span>
            </button>

            <button
              type="button"
              id="mobile-nav-settings"
              onClick={() => handleMobileNav(onOpenSettings)}
              className="w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface-elevated)] transition-colors min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Sliders className="w-4 h-4 text-[var(--text-muted)]" />
                <span>Screening Protocol & PHC Settings</span>
              </div>
            </button>
          </div>

          {/* Mobile Theme Switcher & System Status */}
          <div className="pt-3 border-t border-[var(--border-app)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--text-muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span>Edge Pipeline Online</span>
            </div>

            {/* Segmented Theme Picker */}
            <div
              className="flex items-center p-0.5 rounded-lg border border-[var(--border-app)] bg-[var(--bg-surface-elevated)] text-[var(--text-muted)]"
              role="group"
              aria-label="Theme selection"
            >
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`p-2 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  theme === 'light'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'hover:text-[var(--text-primary)]'
                }`}
                aria-label="Light theme"
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`p-2 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  theme === 'dark'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'hover:text-[var(--text-primary)]'
                }`}
                aria-label="Dark theme"
              >
                <Moon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                className={`p-2 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center ${
                  theme === 'system'
                    ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm'
                    : 'hover:text-[var(--text-primary)]'
                }`}
                aria-label="System theme"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
