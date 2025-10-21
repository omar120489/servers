import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import type { SxProps, Theme } from '@mui/material/styles';

import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

interface LogoSectionProps {
  sx?: SxProps<Theme>;
}

export default function LogoSection({ sx }: Readonly<LogoSectionProps>) {
  return (
    <Link component={RouterLink} to={DASHBOARD_PATH} aria-label="theme-logo" sx={sx}>
      <Logo />
    </Link>
  );
}
