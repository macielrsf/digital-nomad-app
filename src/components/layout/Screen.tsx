import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '../ui/Box';

export function Screen({
  children,
  ...boxProps
}: PropsWithChildren & BoxProps) {
  return (
    <Box
      flex={1}
      backgroundColor='background'
      paddingHorizontal='padding'
      {...boxProps}
    >
      {children}
    </Box>
  );
}
