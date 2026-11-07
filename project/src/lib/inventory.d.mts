export function visibleProducts<T extends { status: string; title: string }>(products: T[]): T[];
