import { useState } from 'react';
import { Box } from '../components/ui/Box';
import { SearchInput } from '../components/ui/SearchInput';
import { useAppTheme } from '../theme/useAppTheme';
import { Badge } from '../components/ui/Badge';

export function CityFilter() {
  const [search, setSearch] = useState('');
  const { colors } = useAppTheme();

  return (
    <Box>
      <SearchInput
        value={search}
        onChangeText={setSearch}
        placeholder='Qual o seu próximo destino?'
        placeholderTextColor={colors.text}
      />
      <Badge label='Todas' iconName='Home-outline' active={true} />
    </Box>
  );
}
