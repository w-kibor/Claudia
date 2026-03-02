import { Package, ShoppingCart } from 'lucide-react';

export function KitchenStats() {
  const stats = {
    onHand: 24,
    missing: 6,
    total: 30
  };

  const percentage = (stats.onHand / stats.total) * 100;

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-sm text-muted-foreground mb-4">Kitchen Inventory</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Package className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-2xl font-medium">{stats.onHand}</div>
            <div className="text-xs text-muted-foreground">On Hand</div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <div className="text-2xl font-medium">{stats.missing}</div>
            <div className="text-xs text-muted-foreground">Missing</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Completion</span>
          <span>{Math.round(percentage)}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
}
