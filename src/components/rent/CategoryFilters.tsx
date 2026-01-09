import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface CategoryFiltersProps {
  activeCategory: 'hotels' | 'apartments' | 'saunas' | 'conference' | null;
  onCategoryClick: (category: 'hotels' | 'apartments' | 'saunas' | 'conference') => void;
}

export default function CategoryFilters({ activeCategory, onCategoryClick }: CategoryFiltersProps) {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
          Что вы ищете?
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => onCategoryClick('hotels')}
            size="lg"
            variant={activeCategory === 'hotels' ? 'default' : 'outline'}
            className="h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Icon name="Building2" size={32} />
            <span>Отели</span>
          </Button>
          <Button 
            onClick={() => onCategoryClick('apartments')}
            size="lg"
            variant={activeCategory === 'apartments' ? 'default' : 'outline'}
            className="h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Icon name="Home" size={32} />
            <span>Апартаменты</span>
          </Button>
          <Button 
            onClick={() => onCategoryClick('saunas')}
            size="lg"
            variant={activeCategory === 'saunas' ? 'default' : 'outline'}
            className="h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Icon name="Droplets" size={32} />
            <span>Сауны</span>
          </Button>
          <Button 
            onClick={() => onCategoryClick('conference')}
            size="lg"
            variant={activeCategory === 'conference' ? 'default' : 'outline'}
            className="h-24 text-lg font-semibold flex flex-col items-center justify-center gap-2"
          >
            <Icon name="Presentation" size={32} />
            <span>Конференц-залы</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
