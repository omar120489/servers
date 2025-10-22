export function can(granted: readonly string[] | string[], required?: string){ if(!required) return true; const set=new Set(granted); return set.has(required); }
