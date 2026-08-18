// Shram Setu — Trade Icon Mapper
import {
  Zap, Droplets, BrickWall, Hammer, Paintbrush, Flame,
  Wind, Trees, Grid3X3, HardHat, Wrench,
} from 'lucide-react';

const ICON_MAP = {
  zap: Zap,
  droplets: Droplets,
  'brick-wall': BrickWall,
  hammer: Hammer,
  paintbrush: Paintbrush,
  flame: Flame,
  wind: Wind,
  trees: Trees,
  'grid-3x3': Grid3X3,
  'hard-hat': HardHat,
  wrench: Wrench,
};

export function TradeIcon({ icon, size = 24, color, className = '' }) {
  const IconComponent = ICON_MAP[icon] || Wrench;
  return <IconComponent size={size} color={color} className={className} strokeWidth={1.5} />;
}
