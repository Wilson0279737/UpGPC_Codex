import { Cpu, HardDrive, MemoryStick, Monitor } from 'lucide-react';
import type { Product } from '../config/inventory';

export default function ProductSpecs({ product }: { product: Product }) {
  const specs = [
    { label: 'Graphics', value: product.gpu, icon: Monitor },
    { label: 'Processor', value: product.cpu, icon: Cpu },
    { label: 'Memory', value: product.ram, icon: MemoryStick },
    { label: 'Storage', value: product.storage, icon: HardDrive },
  ];
  if (!specs.some(spec => spec.value)) return null;
  return <dl className="pc-specs">{specs.map(({ label, value, icon: Icon }) => (
    <div key={label} className="pc-spec"><dt><Icon size={15} aria-hidden="true" />{label}</dt><dd>{value || <span className="pc-spec-unlisted">Not listed — ask us</span>}</dd></div>
  ))}</dl>;
}
