import { useState } from 'react';
import { Box } from '../components/ui/Box';
import { SearchInput } from '../components/ui/SearchInput';
import { useAppTheme } from '../theme/useAppTheme';
import { CategoryBadge } from '../components/category/CategoryBadge';
import { Category } from '../types';
import { ScrollView } from 'react-native';

type CityFilterProps = {
  categories: Category[];
};

export function CityFilter({ categories = [] }: CityFilterProps) {
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { colors } = useAppTheme();

  return (
    <Box>
      <Box paddingHorizontal='padding'>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder='Qual o seu próximo destino?'
          placeholderTextColor={colors.text}
        />
      </Box>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Box mt='s16' flexDirection='row' gap='s8' paddingHorizontal='padding'>
          {categories.map(category => (
            <CategoryBadge
              key={category.id}
              category={category}
              active={category.id === selectedCategoryId}
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
