import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: number;
  label?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Enter text...',
  readOnly = false,
  minHeight = 200,
  label,
}: RichTextEditorProps) {
  const modules = useMemo(
    () => ({
      toolbar: readOnly
        ? false
        : [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ color: [] }, { background: [] }],
            ['link'],
            ['clean'],
          ],
    }),
    [readOnly]
  );

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'color',
    'background',
    'link',
  ];

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
          {label}
        </Typography>
      )}
      <Box
        sx={{
          '& .ql-container': {
            minHeight: `${minHeight}px`,
            fontSize: '14px',
            fontFamily: 'inherit',
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
            borderColor: 'divider',
          },
          '& .ql-editor': {
            minHeight: `${minHeight}px`,
          },
          '& .ql-toolbar': {
            borderTopLeftRadius: 1,
            borderTopRightRadius: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
          },
          '& .ql-editor.ql-blank::before': {
            color: 'text.secondary',
            fontStyle: 'normal',
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          readOnly={readOnly}
        />
      </Box>
    </Box>
  );
}

