import { useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
export type ListQuery = Record<string, string | number | boolean | undefined>;
export function useUrlQuery<T extends ListQuery = ListQuery>(defaults: T){
  const [params, setParams] = useSearchParams();
  const query = useMemo(()=>{
    const out: any = { ...defaults };
    for (const [k, v] of params.entries()) {
      if (v==='true'||v==='false') out[k]= (v==='true');
      else if (!Number.isNaN(Number(v)) && v.trim()!=='') out[k]= Number(v);
      else out[k]= v;
    }
    return out as T;
  }, [params, defaults]);
  const update = useCallback((patch: Partial<T>)=>{
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k,v])=>{
      if (v===undefined || v===null || v==='') next.delete(k);
      else next.set(k, String(v));
    });
    setParams(next, { replace: false });
  }, [params, setParams]);
  return { query, update };
}
