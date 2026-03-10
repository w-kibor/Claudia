import { Package, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export function KitchenStats() {
  const stats = {
    onHand: 24,
    missing: 6,
    total: 30,
  };

  const percentage = (stats.onHand / stats.total) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className='bg-card border border-border rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm'
    >
      <h3 className='text-xs md:text-sm text-muted-foreground mb-4'>Kitchen Inventory</h3>

      <div className='grid grid-cols-2 gap-3 md:gap-4 mb-4'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0'>
            <Package className='w-5 h-5 text-accent' />
          </div>
          <div className='min-w-0'>
            <div className='text-xl md:text-2xl font-medium'>{stats.onHand}</div>
            <div className='text-xs text-muted-foreground'>On Hand</div>
          </div>
        </div>

        <div className='flex items-center gap-2 md:gap-3'>
          <div className='w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0'>
            <ShoppingCart className='w-5 h-5 text-destructive' />
          </div>
          <div className='min-w-0'>
            <div className='text-xl md:text-2xl font-medium'>{stats.missing}</div>
            <div className='text-xs text-muted-foreground'>Missing</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className='space-y-2'>
        <div className='flex justify-between text-xs text-muted-foreground'>
          <span>Completion</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className='h-2 bg-muted rounded-full overflow-hidden'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
            className='h-full bg-accent'
          />
        </div>
      </div>
    </motion.div>
  );
}
