export function visibleProducts<T extends { status: string; title: string }>(products: T[]): T[];
export function searchProducts<T extends { status: string; title: string; price?: number | null; description?: string; cpu?: string; gpu?: string; ram?: string; storage?: string }>(products: T[], options?: { query?: string; availability?: string; sort?: string }): T[];
