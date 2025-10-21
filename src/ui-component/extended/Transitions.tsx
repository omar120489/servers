import type { ReactElement, ReactNode } from 'react';

import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import Box from '@mui/material/Box';
import type { SxProps, Theme } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';

type TransitionType = 'grow' | 'collapse' | 'fade' | 'slide' | 'zoom';
type TransitionPosition =
  | 'top-left'
  | 'top-right'
  | 'top'
  | 'bottom-left'
  | 'bottom-right'
  | 'bottom';
type TransitionDirection = 'up' | 'right' | 'left' | 'down';

type BaseTransitionProps = Omit<TransitionProps, 'children'> & {
  timeout?: TransitionProps['timeout'];
};

export interface TransitionsProps extends BaseTransitionProps {
  children: ReactNode;
  position?: TransitionPosition;
  sx?: SxProps<Theme>;
  type?: TransitionType;
  direction?: TransitionDirection;
}

const POSITION_STYLES: Record<TransitionPosition, SxProps<Theme>> = {
  'top-left': { transformOrigin: '0 0 0' },
  'top-right': { transformOrigin: 'top right' },
  top: { transformOrigin: 'top' },
  'bottom-left': { transformOrigin: 'bottom left' },
  'bottom-right': { transformOrigin: 'bottom right' },
  bottom: { transformOrigin: 'bottom' }
};

export default function Transitions({
  children,
  position = 'top-left',
  sx,
  type = 'grow',
  direction = 'up',
  ...others
}: TransitionsProps): ReactElement {
  const positionSx = POSITION_STYLES[position] ?? POSITION_STYLES['top-left'];

  return (
    <Box sx={sx}>
      {type === 'grow' && (
        <Grow {...others}>
          <Box sx={positionSx}>{children}</Box>
        </Grow>
      )}
      {type === 'collapse' && (
        <Collapse {...others} sx={positionSx}>
          {children}
        </Collapse>
      )}
      {type === 'fade' && (
        <Fade
          {...others}
          timeout={{
            appear: 500,
            enter: 600,
            exit: 400
          }}
        >
          <Box sx={positionSx}>{children}</Box>
        </Fade>
      )}
      {type === 'slide' && (
        <Slide
          {...others}
          timeout={{
            appear: 0,
            enter: 400,
            exit: 200
          }}
          direction={direction}
        >
          <Box sx={positionSx}>{children}</Box>
        </Slide>
      )}
      {type === 'zoom' && (
        <Zoom {...others}>
          <Box sx={positionSx}>{children}</Box>
        </Zoom>
      )}
    </Box>
  );
}
