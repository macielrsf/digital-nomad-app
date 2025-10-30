import { PropsWithChildren } from 'react';
import { Box, BoxProps } from '../ui/Box';
import { ScrollView, View, ScrollViewProps } from 'react-native';

type ScreenProps = {
  scrollable?: boolean;
  contentContainerStyle?: ScrollViewProps['contentContainerStyle'];
  header?: React.ReactNode;
};

export function Screen({
  children,
  scrollable = false,
  contentContainerStyle,
  header,
  ...boxProps
}: PropsWithChildren & BoxProps & ScreenProps) {
  return (
    <Box
      flex={1}
      backgroundColor='background'
      paddingHorizontal='padding'
      {...boxProps}
    >
      {header}
      {scrollable ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={contentContainerStyle}
        >
          {children}
        </ScrollView>
      ) : (
        <View>{children}</View>
      )}
    </Box>
  );
}
