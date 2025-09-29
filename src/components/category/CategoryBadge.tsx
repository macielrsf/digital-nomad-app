import { Category, CategoryCode } from '@/src/types';
import { Badge, BadgeProps } from '../ui/Badge';
import { IconName } from '../ui/Icon';

type CategoryBadgeProps = {
  category: Category;
} & Pick<BadgeProps, 'active'>;

export function CategoryBadge({ category, ...badgeProps }: CategoryBadgeProps) {
  return (
    <Badge
      {...badgeProps}
      label={category.name}
      iconName={categoryIconMap[category.code]}
    />
  );
}

const categoryIconMap: Record<CategoryCode, IconName> = {
  ADVENTURE: 'Adventure',
  BEACH: 'Beach',
  CULTURE: 'Culture',
  GASTRONOMY: 'Gastronomy',
  HISTORY: 'History',
  LUXURY: 'Luxury',
  NATURE: 'Nature',
  URBAN: 'Urban',
  SHOPPING: 'Shopping',
  FAVORITE: 'Star',
};
