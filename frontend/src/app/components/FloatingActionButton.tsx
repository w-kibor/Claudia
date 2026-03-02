import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function FloatingActionButton() {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 w-12 sm:w-14 h-12 sm:h-14 rounded-full bg-accent text-accent-foreground shadow-2xl flex items-center justify-center z-50 hover:shadow-accent/50 transition-shadow active:scale-90 sm:active:scale-95"
    >
      <Sparkles className="w-5 sm:w-6 h-5 sm:h-6" />
    </motion.button>
  );
}
