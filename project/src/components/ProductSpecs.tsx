import { Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';
import type { Product } from '../config/inventory';

export default function ProductSpecs({ product }: { product: Product }) {
  const specs = [
    { label: 'Processor', value: product.cpu, icon: Cpu },
    { label: 'Graphics', value: product.gpu, icon: Monitor },
    { label: 'Memory', value: product.ram, icon: MemoryStick },
    { label: 'Storage', value: product.storage, icon: HardDrive },
  ].filter(spec => spec.value);
  if (!specs.length) return null;
  return <dl className="pc-specs">{specs.map(({ label, value, icon: Icon }) => (
    <div key={label} className="pc-spec"><dt><Icon size={16} aria-hidden="true" />{label}</dt><dd>{value}</dd></div>
  ))}</dl>;
}
