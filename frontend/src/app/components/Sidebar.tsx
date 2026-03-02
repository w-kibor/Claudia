import { ChefHat, Database, MessageSquare, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { icon: ChefHat, label: 'My Kitchen', active: true },
    { icon: Database, label: 'Kaggle Database', active: false },
    { icon: MessageSquare, label: 'AI Chat', active: false },
  ];

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ width: '4rem' }}
        animate={{ width: isExpanded ? '16rem' : '4rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative z-20"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {isExpanded ? (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-lg tracking-tight text-sidebar-foreground"
            >
              Claudia
            </motion.h1>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <ChefHat className="w-5 h-5 text-accent-foreground" />
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-8 h-8 rounded-lg hover:bg-sidebar-accent flex items-center justify-center transition-colors"
          >
            {isExpanded ? (
              <X className="w-4 h-4 text-sidebar-foreground" />
            ) : (
              <Menu className="w-4 h-4 text-sidebar-foreground" />
            )}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                item.active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          ))}
        </nav>
      </motion.aside>
    </>
  );
}
