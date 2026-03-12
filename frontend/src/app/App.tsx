import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { Outlet, useLocation } from 'react-router';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      // Close mobile sidebar on desktop
      if (window.innerWidth >= 768) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Theme Synchronization
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return { title: 'Home', subtitle: 'Welcome to Claudia' };
      case '/recipes': return { title: 'Recipe Collection', subtitle: 'Discover and cook amazing dishes' };
      case '/my-kitchen': return { title: 'My Kitchen', subtitle: 'Your personal space' };
      case '/ask-ai': return { title: 'Ask AI', subtitle: 'Get cooking inspiration and help' };
      default: return { title: 'Claudia', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <div
      className={`h-screen flex flex-col md:flex-row bg-background text-foreground ${isDark ? 'dark' : ''}`}
    >
      {/* Mobile Sidebar Backdrop */}
      {isMobile && isMobileSidebarOpen && (
        <div
          className='fixed inset-0 bg-black/50 z-10 md:hidden'
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div
        className={`${isMobileSidebarOpen ? 'fixed left-0 top-0 z-20 h-screen' : 'hidden md:flex'}`}
      >
        <Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <main className='flex-1 overflow-y-auto bg-background min-h-screen md:min-h-0 flex flex-col'>
        {/* Header */}
        <header className='sticky top-0 z-10 h-16 border-b border-border bg-background/80 backdrop-blur-xl'>
          <div className='h-full px-4 md:px-6 flex items-center justify-between gap-4'>
            <div className='flex items-center gap-3 flex-1 min-w-0'>
              {isMobile && (
                <button
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className='w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0'
                >
                  {isMobileSidebarOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
                </button>
              )}
              <div className='min-w-0'>
                <h1 className='text-lg md:text-xl font-semibold truncate'>{title}</h1>
                <p className='text-xs text-muted-foreground hidden sm:block'>{subtitle}</p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className='w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center transition-colors flex-shrink-0'
            >
              {isDark ? <Sun className='w-4 h-4' /> : <Moon className='w-4 h-4' />}
            </button>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className='flex-1'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
