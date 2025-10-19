import React, { useState } from 'react';
import { Box, Pagination, Stack } from '@mui/material';
import { PageHeader, LoadingState, ErrorState } from 'components/shared';
import AuditLogTable from 'components/auditLog/AuditLogTable';
import AuditLogFilters from 'components/auditLog/AuditLogFilters';
import { useAuditLog, useExportAuditLog } from 'hooks/useAuditLog';

export default function AuditLog() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterResource, setFilterResource] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch audit log with filters
  const { data, isLoading, error } = useAuditLog({
    search,
    action: filterAction,
    resourceType: filterResource,
    page,
    limit: itemsPerPage,
  });

  // Export mutation
  const { mutate: exportLog, isPending: isExporting } = useExportAuditLog();

  const handleExport = () => {
    exportLog({
      search,
      action: filterAction,
      resourceType: filterResource,
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading audit log..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Failed to load audit log. Please try again."
        severity="error"
      />
    );
  }

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  return (
    <Box>
      <PageHeader
        title="Audit Log"
        description="Track all user actions and system changes"
      />

      <AuditLogFilters
        search={search}
        onSearchChange={setSearch}
        filterAction={filterAction}
        onFilterActionChange={setFilterAction}
        filterResource={filterResource}
        onFilterResourceChange={setFilterResource}
        onExport={handleExport}
        isExporting={isExporting}
      />

      <AuditLogTable entries={data?.data || []} />

      {totalPages > 1 && (
        <Stack direction="row" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Stack>
      )}
    </Box>
  );
}

