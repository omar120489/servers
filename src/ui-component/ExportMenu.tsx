import { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { IconFileSpreadsheet, IconFileTypePdf, IconDownload } from '@tabler/icons-react';

interface ExportMenuProps {
  readonly onExportXLSX: () => void;
  readonly onExportPDF: () => void;
  readonly disabled?: boolean;
}

export default function ExportMenu({ onExportXLSX, onExportPDF, disabled }: ExportMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleExportXLSX = () => {
    handleClose();
    onExportXLSX();
  };

  const handleExportPDF = () => {
    handleClose();
    onExportPDF();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<IconDownload size={18} />}
        onClick={handleClick}
        disabled={disabled}
      >
        Export
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuItem onClick={handleExportXLSX}>
          <ListItemIcon>
            <IconFileSpreadsheet size={20} />
          </ListItemIcon>
          <ListItemText>Export XLSX</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleExportPDF}>
          <ListItemIcon>
            <IconFileTypePdf size={20} />
          </ListItemIcon>
          <ListItemText>Export PDF</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}


