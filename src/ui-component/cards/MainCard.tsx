import { forwardRef, type ReactNode } from 'react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import type { CardProps, SxProps, Theme } from '@mui/material';

import { ThemeMode } from 'config';

const headerStyle: SxProps<Theme> = {
  '& .MuiCardHeader-action': { mr: 0 }
};

export interface MainCardProps extends Omit<CardProps, 'title' | 'content'> {
  border?: boolean;
  boxShadow?: boolean;
  children?: ReactNode;
  content?: boolean;
  contentClass?: string;
  contentSX?: SxProps<Theme>;
  headerSX?: SxProps<Theme>;
  darkTitle?: boolean;
  secondary?: ReactNode;
  shadow?: string;
  title?: ReactNode;
}

const MainCard = forwardRef<HTMLDivElement, MainCardProps>(function MainCard(
  {
    border = false,
    boxShadow,
    children,
    content = true,
    contentClass = '',
    contentSX = {},
    headerSX = {},
    darkTitle,
    secondary,
    shadow,
    sx,
    title,
    ...others
  },
  ref
) {
  const { colorScheme } = useColorScheme();
  const defaultShadow =
    colorScheme === ThemeMode.DARK
      ? '0 2px 14px 0 rgb(33 150 243 / 10%)'
      : '0 2px 14px 0 rgb(32 40 45 / 8%)';

  const cardSx: SxProps<Theme> = (theme) => ({
    border: border ? '1px solid' : 'none',
    borderColor: 'divider',
    ':hover': {
      boxShadow: boxShadow ? (shadow ?? defaultShadow) : 'inherit'
    },
    ...(typeof sx === 'function' ? sx(theme) : (sx ?? {}))
  });

  return (
    <Card ref={ref} {...others} sx={cardSx}>
      {title && (
        <CardHeader
          sx={{ ...headerStyle, ...headerSX }}
          title={darkTitle ? <Typography variant="h3">{title}</Typography> : title}
          action={secondary}
        />
      )}

      {title && <Divider />}

      {content ? (
        <CardContent sx={contentSX} className={contentClass}>
          {children}
        </CardContent>
      ) : (
        children
      )}
    </Card>
  );
});

export default MainCard;
