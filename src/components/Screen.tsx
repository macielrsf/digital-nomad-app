import { PropsWithChildren } from 'react';
import { Box, BoxProps } from './Box';

export function Screen({
  children,
  ...boxProps
}: PropsWithChildren & BoxProps) {
  return (
    <Box backgroundColor='background' paddingHorizontal='s16' {...boxProps}>
      {children}
    </Box>
  );
}
