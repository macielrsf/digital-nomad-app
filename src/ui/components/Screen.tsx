import { PropsWithChildren } from 'react';
import { Box, BoxProps } from './Box';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ScrollViewProps,
} from 'react-native';

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
  const Container = scrollable ? ScrollView : View;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Box
        flex={1}
        backgroundColor='background'
        paddingHorizontal='padding'
        {...boxProps}
      >
        <Container showsVerticalScrollIndicator={false}>{children}</Container>
      </Box>
    </KeyboardAvoidingView>
  );
}
