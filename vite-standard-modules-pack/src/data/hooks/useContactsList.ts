import { useEffect, useMemo, useState } from 'react';
import api from '../clients/axios';
export type Contact = { id: string; firstName: string; lastName: string; email?: string; phone?: string; companyId?: string; title?: string; ownerId?: string; updatedAt?: string; };
export type ContactsQuery = { page?: number; pageSize?: number; search?: string; dateFrom?: string; dateTo?: string; ownerId?: string; orderBy?: string; order?: 'asc'|'desc'; };
type Resp = { items: Contact[]; total: number };
export function useContactsList(query: ContactsQuery){
  const [rows,setRows]=useState<Contact[]>([]); const [total,setTotal]=useState(0); const [loading,setLoading]=useState(false); const [error,setError]=useState<unknown>(null);
  const params = useMemo(()=>({ page:query.page??1, pageSize:query.pageSize??25, search:query.search||undefined, dateFrom:query.dateFrom||undefined, dateTo:query.dateTo||undefined, ownerId:query.ownerId||undefined, orderBy:query.orderBy||undefined, order:query.order||undefined }), [query]);
  useEffect(()=>{ const ctrl=new AbortController(); (async()=>{ setLoading(true); setError(null); try{ const res=await api.get<Resp>('/contacts',{ params, signal: ctrl.signal }); setRows(res.data.items||[]); setTotal(res.data.total||0); }catch(e){ if((e as any)?.name!=='CanceledError') setError(e); }finally{ setLoading(false);} })(); return ()=>ctrl.abort(); }, [params]);
  const refresh = ()=> setRows(r=>[...r]);
  return { rows,total,loading,error,refresh };
}
