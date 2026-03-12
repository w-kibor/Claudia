import { ChefHat, Database, MessageSquare, Menu, X, Home as HomeIcon } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink } from 'react-router';

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: HomeIcon, label: 'Home', path: '/' },
    { icon: Database, label: 'Recipe Collection', path: '/recipes' },
    { icon: ChefHat, label: 'My Kitchen', path: '/my-kitchen' },
    { icon: MessageSquare, label: 'Ask AI', path: '/ask-ai' },
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ width: '4rem' }}
        animate={{ width: isExpanded ? '16rem' : '4rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative z-20 w-16'
      >
        {/* Header */}
        <div className='h-16 flex items-center justify-between px-3 md:px-4 border-b border-sidebar-border flex-shrink-0'>
          {isExpanded ? (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className='text-base md:text-lg tracking-tight text-sidebar-foreground truncate'
            >
              Claudia
            </motion.h1>
          ) : (
            <div className='w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0'>
              <ChefHat className='w-5 h-5 text-accent-foreground' />
            </div>
          )}
          <button
            onClick={() => {
              setIsExpanded(!isExpanded);
              onClose?.();
            }}
            className='w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors md:hidden flex-shrink-0'
          >
            {isExpanded ? (
              <X className='w-4 h-4 text-sidebar-foreground' />
            ) : (
              <Menu className='w-4 h-4 text-sidebar-foreground' />
            )}
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors hidden md:flex flex-shrink-0'
          >
            {isExpanded ? (
              <X className='w-4 h-4 text-sidebar-foreground' />
            ) : (
              <Menu className='w-4 h-4 text-sidebar-foreground' />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className='flex-1 p-2 md:p-3 space-y-1 overflow-y-auto'>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={onClose}
              end={item.path === '/'}
              className={({ isActive }: { isActive: boolean }) => `w-full flex items-center gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className='w-5 h-5 flex-shrink-0' />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className='text-sm whitespace-nowrap overflow-hidden'
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
