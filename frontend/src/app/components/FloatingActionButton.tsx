import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function FloatingActionButton() {
  return (
    <motion.button
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-2xl flex items-center justify-center z-50 hover:shadow-accent/50 transition-shadow"
    >
      <Sparkles className="w-6 h-6" />
    </motion.button>
  );
}
