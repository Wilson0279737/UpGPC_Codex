export function visibleProducts<T extends { status: string; title: string }>(products: T[]): T[];
export function soldProducts<T extends { status: string; title: string }>(products: T[]): T[];
export function searchSoldProducts<T extends { status: string; title: string; formFactor?: string; price?: number | null; description?: string; cpu?: string; gpu?: string; ram?: string; storage?: string }>(products: T[], options?: { query?: string; formFactor?: string; sort?: string }): T[];
export function searchProducts<T extends { status: string; title: string; price?: number | null; description?: string; cpu?: string; gpu?: string; ram?: string; storage?: string }>(products: T[], options?: { query?: string; availability?: string; sort?: string }): T[];
