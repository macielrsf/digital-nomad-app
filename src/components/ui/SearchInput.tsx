import { TextInput, TextInputProps } from 'react-native';
import { useState } from 'react';

import { Box, BoxProps } from './Box';
import { IconButton } from './IconButton';
import { useAppTheme } from '../../theme/useAppTheme';

type SearchInputProps = {} & Pick<
  TextInputProps,
  'value' | 'onChangeText' | 'placeholder' | 'placeholderTextColor'
>;

export function SearchInput({
  value,
  onChangeText,
  placeholder,
  ...textInputProps
}: SearchInputProps) {
  const { colors, textVariants } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Box
      {...boxStyle}
      style={{
        borderColor: isFocused ? colors.primary : colors.gray1,
      }}
    >
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        cursorColor={colors.text}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          ...textVariants.title16,
          color: colors.text,
          height: '100%',
          width: '100%',
          flexShrink: 1,
        }}
        {...textInputProps}
      />
      <IconButton
        iconName={value?.length ? 'Close' : 'Search-outline'}
        onPress={() => onChangeText?.('')}
      />
    </Box>
  );
}

const boxStyle: BoxProps = {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 's8',
  backgroundColor: 'gray1',
  height: 70,
  borderRadius: 'rounded',
  paddingLeft: 's18',
  paddingRight: 's12',
  borderWidth: 2,
};
