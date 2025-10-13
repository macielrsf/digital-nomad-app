import { Box } from '../components/ui/Box';
import { SearchInput } from '../components/ui/SearchInput';
import { useAppTheme } from '../theme/useAppTheme';
import { CategoryBadge } from '../components/category/CategoryBadge';
import { Category } from '../types';
import { ScrollView } from 'react-native';

type CityFilterProps = {
  categories: Category[];
  search: string;
  onChangeSearch: (search: string) => void;
  selectedCategoryId: string | null;
  onChangeSelectedCategoryId: (id: string | null) => void;
};

export function CityFilter({
  categories = [],
  search,
  onChangeSearch,
  selectedCategoryId,
  onChangeSelectedCategoryId,
}: CityFilterProps) {
  const { colors } = useAppTheme();

  return (
    <Box>
      <Box paddingHorizontal='padding'>
        <SearchInput
          value={search}
          onChangeText={onChangeSearch}
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
              onPress={() =>
                onChangeSelectedCategoryId(
                  selectedCategoryId === category.id ? null : category.id
                )
              }
            />
          ))}
        </Box>
      </ScrollView>
    </Box>
  );
}
