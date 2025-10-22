import { useCallback, useMemo, useRef, useState } from 'react';

import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useAttachments } from 'hooks/useAttachments';
import { buildAttachmentDownloadUrl } from 'services/attachments';
import type { Attachment, EntityIdentifier } from 'types/api';

export interface AttachmentUploaderProps {
  readonly entityType: string;
  readonly entityId: EntityIdentifier;
  readonly title?: string;
  readonly accept?: string;
}

function formatFileSize(bytes?: number): string {
  if (!bytes || Number.isNaN(bytes)) {
    return '—';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  const units = ['KB', 'MB', 'GB', 'TB'];
  let size = bytes / 1024;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function formatTimestamp(value: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function AttachmentUploader({
  entityType,
  entityId,
  title = 'Attachments',
  accept
}: AttachmentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const {
    attachments,
    loading,
    uploading,
    uploadProgress,
    deletingIds,
    error,
    refresh,
    uploadAttachment,
    deleteAttachment
  } = useAttachments({
    entityType,
    entityId
  });

  const hasProgress = useMemo(
    () => typeof uploadProgress === 'number' && uploadProgress > 0 && uploadProgress < 100,
    [uploadProgress]
  );

  const handleSelectFile = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        setActionError(null);
        await uploadAttachment(file);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Unable to upload file.');
      } finally {
        // reset input so same file can be selected again
        event.target.value = '';
      }
    },
    [uploadAttachment]
  );

  const handleDelete = useCallback(
    async (attachment: Attachment) => {
      try {
        setActionError(null);
        await deleteAttachment(attachment.id);
      } catch (err) {
        setActionError(err instanceof Error ? err.message : 'Unable to delete file.');
      }
    },
    [deleteAttachment]
  );

  const handleTriggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        action={
          <Tooltip title="Refresh list">
            <span>
              <IconButton onClick={() => void refresh()} disabled={loading}>
                {loading ? <CircularProgress size={20} /> : <RefreshOutlinedIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={2}>
          <input
            type="file"
            ref={fileInputRef}
            hidden
            accept={accept}
            onChange={(event) => void handleSelectFile(event)}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUploadOutlinedIcon />}
            onClick={handleTriggerUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading…' : 'Upload File'}
          </Button>
          {hasProgress && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                Uploading… {uploadProgress}%
              </Typography>
              <LinearProgress variant="determinate" value={uploadProgress ?? 0} sx={{ mt: 1 }} />
            </Box>
          )}
          {(error || actionError) && (
            <Alert severity="error">{actionError ?? 'Unable to load attachments.'}</Alert>
          )}
        </Stack>
      </CardContent>
      <Divider />
      <CardActions disableSpacing sx={{ flexDirection: 'column', alignItems: 'stretch', p: 0 }}>
        {loading && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress size={24} />
          </Box>
        )}
        {!loading && attachments.length === 0 && (
          <Box px={3} py={4}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No attachments yet.
            </Typography>
          </Box>
        )}
        {!loading && attachments.length > 0 && (
          <List sx={{ width: '100%' }}>
            {attachments.map((attachment) => {
              const downloadUrl = buildAttachmentDownloadUrl(attachment.path);
              return (
                <ListItem
                  key={attachment.id}
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Download">
                        <IconButton
                          component="a"
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          <DownloadOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <span>
                          <IconButton
                            onClick={() => void handleDelete(attachment)}
                            disabled={deletingIds.has(attachment.id)}
                          >
                            {deletingIds.has(attachment.id) ? (
                              <CircularProgress size={20} />
                            ) : (
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            )}
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={attachment.filename}
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {formatFileSize(attachment.fileSize)} • {formatTimestamp(attachment.createdAt)}
                      </Typography>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </CardActions>
    </Card>
  );
}

export default AttachmentUploader;
