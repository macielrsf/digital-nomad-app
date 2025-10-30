import { Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import { Text } from './Text';
import { Icon } from './Icon';
import { Box } from './Box';
import theme from '@/src/theme/theme';

type Props = {
  title: string;
  description: string;
};

export function Accordion({ title, description }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Pressable onPress={() => setIsOpen(!isOpen)}>
      <View>
        <AccordionHeader title={title} isOpen={isOpen} />
        {isOpen && <AccordionContent description={description} />}
      </View>
    </Pressable>
  );
}

function AccordionHeader({
  title,
  isOpen,
}: {
  title: string;
  isOpen: boolean;
}) {
  return (
    <View style={isOpen ? styles.headerOpened : styles.header}>
      <Box flexShrink={1}>
        <Text variant='title16'>{title}</Text>
      </Box>
      <Icon
        name={isOpen ? 'Chevron-up' : 'Chevron-down'}
        color={isOpen ? 'primary' : 'gray2'}
        size={24}
      />
    </View>
  );
}

function AccordionContent({ description }: { description: string }) {
  return (
    <View style={styles.content}>
      <Text>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.gray1,
    borderRadius: theme.borderRadii.default,
    paddingHorizontal: 16,
  },
  headerOpened: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: theme.colors.gray1,
    backgroundColor: theme.colors.gray1,
    borderTopLeftRadius: theme.borderRadii.default,
    borderTopRightRadius: theme.borderRadii.default,
    paddingHorizontal: 16,
  },
  content: {
    paddingBottom: 16,
    backgroundColor: theme.colors.gray1,
    paddingHorizontal: 16,
    borderBottomLeftRadius: theme.borderRadii.default,
    borderBottomRightRadius: theme.borderRadii.default,
  },
});
