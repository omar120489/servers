import { useCallback, useMemo, useState } from 'react';

import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { useComments } from 'hooks/useComments';
import type { EntityIdentifier } from 'types/api';

export interface CommentsPanelProps {
  readonly entityType: string;
  readonly entityId: EntityIdentifier;
  readonly title?: string;
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

export function CommentsPanel({ entityType, entityId, title = 'Comments' }: CommentsPanelProps) {
  const [draft, setDraft] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    comments,
    loading,
    error,
    isCreating,
    deletingIds,
    refresh,
    createComment,
    deleteComment
  } = useComments({
    entityType,
    entityId
  });

  const canSubmit = useMemo(() => draft.trim().length > 0 && !isCreating, [draft, isCreating]);

  const handleSubmit = useCallback(async () => {
    if (!draft.trim()) {
      return;
    }
    try {
      setSubmitError(null);
      await createComment({ content: draft.trim() });
      setDraft('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to post comment.');
    }
  }, [createComment, draft]);

  const handleDelete = useCallback(
    async (id: EntityIdentifier) => {
      try {
        await deleteComment(id);
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : 'Unable to delete comment.');
      }
    },
    [deleteComment]
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        action={
          <Tooltip title="Refresh">
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
          <TextField
            label="Add a comment"
            placeholder="Share an update..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            multiline
            minRows={3}
            disabled={isCreating}
          />
          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={() => void handleSubmit()}
              disabled={!canSubmit}
            >
              {isCreating ? <CircularProgress size={20} /> : 'Post'}
            </Button>
          </Box>
          {submitError && <Alert severity="error">{submitError}</Alert>}
          {error && !submitError && (
            <Alert severity="error">Unable to load comments. Please try again.</Alert>
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
        {!loading && comments.length === 0 && (
          <Box px={3} py={4}>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No comments yet. Start the conversation above.
            </Typography>
          </Box>
        )}
        {!loading && comments.length > 0 && (
          <List sx={{ width: '100%' }}>
            {comments.map((comment) => (
              <ListItem
                key={comment.id}
                alignItems="flex-start"
                secondaryAction={
                  <Tooltip title="Delete comment">
                    <span>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => void handleDelete(comment.id)}
                        disabled={deletingIds.has(comment.id)}
                      >
                        {deletingIds.has(comment.id) ? (
                          <CircularProgress size={20} />
                        ) : (
                          <DeleteOutlineOutlinedIcon fontSize="small" />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                }
              >
                <ListItemText
                  primary={<Typography variant="body1">{comment.content}</Typography>}
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(comment.createdAt)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardActions>
    </Card>
  );
}

export default CommentsPanel;
