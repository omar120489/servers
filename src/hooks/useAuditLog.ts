import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchAuditLog, exportAuditLog, AuditLogFilters } from 'services/auditLog.api';

// Query Keys
export const auditLogKeys = {
  all: ['auditLog'] as const,
  list: (filters: AuditLogFilters) => [...auditLogKeys.all, 'list', filters] as const,
};

// Hooks
export function useAuditLog(filters: AuditLogFilters = {}) {
  return useQuery({
    queryKey: auditLogKeys.list(filters),
    queryFn: () => fetchAuditLog(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useExportAuditLog() {
  return useMutation({
    mutationFn: (filters: AuditLogFilters) => exportAuditLog(filters),
    onSuccess: (blob) => {
      // Auto-download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-log-${new Date().toISOString()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });
}

