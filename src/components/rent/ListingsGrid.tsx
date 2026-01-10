import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Apartment {
  id: number;
  title: string;
  image: string;
  price: number;
  metro: string;
  metroWalkMinutes?: number;
  address: string;
  area: number;
  areaRange?: string;
  telegram: string;
  views: number;
  telegramClicks: number;
  lat: number;
  lon: number;
  category: 'hotels' | 'apartments' | 'saunas' | 'conference';
  minHours?: number;
  parking?: { available: boolean; paid: boolean; price?: number };
  phone?: string;
}

interface ListingsGridProps {
  activeCategory: 'hotels' | 'apartments' | 'saunas' | 'conference' | null;
  filteredListings: Apartment[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedApartment: number | null;
  setSelectedApartment: (id: number | null) => void;
  phoneVisibleMap: Record<number, boolean>;
  setPhoneVisibleMap: (map: Record<number, boolean>) => void;
  trackView: (id: number) => void;
  trackTelegramClick: (id: number) => void;
}

const categoryConfig = {
  hotels: { title: 'Отели', placeholder: 'Найти отель по адресу или метро', icon: 'Building2' },
  apartments: { title: 'Апартаменты', placeholder: 'Найти апартаменты по адресу или метро', icon: 'Home' },
  saunas: { title: 'Сауны', placeholder: 'Найти сауну по адресу или метро', icon: 'Droplets' },
  conference: { title: 'Конференц-залы', placeholder: 'Найти конференц-зал по адресу или метро', icon: 'Presentation' }
};

export default function ListingsGrid({
  activeCategory,
  filteredListings,
  searchQuery,
  setSearchQuery,
  selectedApartment,
  setSelectedApartment,
  phoneVisibleMap,
  setPhoneVisibleMap,
  trackView,
  trackTelegramClick
}: ListingsGridProps) {
  const resultsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  if (!activeCategory) return null;

  const config = categoryConfig[activeCategory];

  return (
    <section ref={resultsRef} id="results-section" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {config.title}
          </h2>
          <div className="relative">
            <Icon name="Search" className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder={config.placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg border-2 border-gray-300 focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <Card 
              key={item.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              onClick={() => {
                trackView(item.id);
                setSelectedApartment(item.id);
                navigate(`/hotel/${item.id}`);
              }}
            >
              <div className="relative h-56">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Badge className="bg-white/95 text-purple-600 hover:bg-white font-bold text-base px-3 py-1.5 shadow-lg">
                    {item.price} ₽/час
                  </Badge>
                  {item.minHours && item.minHours > 1 && (
                    <Badge className="bg-blue-500/90 text-white hover:bg-blue-600 text-xs px-2 py-1 shadow-lg">
                      мин {item.minHours}ч
                    </Badge>
                  )}
                </div>
                <div className="absolute top-3 left-3">
                  <Badge className="bg-purple-600/90 text-white hover:bg-purple-700 text-xs px-2 py-1 shadow-lg">
                    <Icon name={config.icon as any} size={12} className="mr-1" />
                    {config.title}
                  </Badge>
                </div>
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-xl mb-3 line-clamp-2 min-h-[3.5rem]">{item.title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                  <div className="flex items-start gap-2">
                    <Icon name="MapPin" size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
                    <span className="line-clamp-2">{item.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Train" size={16} className="flex-shrink-0 text-purple-600" />
                    <span>м. {item.metro}</span>
                    {item.metroWalkMinutes && (
                      <span className="text-xs text-gray-500">({item.metroWalkMinutes} мин пешком)</span>
                    )}
                  </div>
                  {item.areaRange ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Maximize" size={16} className="flex-shrink-0 text-purple-600" />
                      <span>{item.areaRange} м²</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Icon name="Maximize" size={16} className="flex-shrink-0 text-purple-600" />
                      <span>{item.area} м²</span>
                    </div>
                  )}
                  {item.parking && item.parking.available && (
                    <div className="flex items-center gap-2">
                      <Icon name="Car" size={16} className="flex-shrink-0 text-purple-600" />
                      <span>
                        Парковка {item.parking.paid ? `${item.parking.price} ₽/час` : 'бесплатно'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-auto">
                  {item.telegram && (
                    <Button
                      size="sm"
                      className="flex-1 bg-[#0088cc] hover:bg-[#006699] text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackTelegramClick(item.id);
                        window.open(`https://t.me/${item.telegram.replace('@', '')}`, '_blank');
                      }}
                    >
                      <Icon name="Send" size={16} className="mr-2" />
                      Telegram
                    </Button>
                  )}
                  {item.phone && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPhoneVisibleMap({ ...phoneVisibleMap, [item.id]: !phoneVisibleMap[item.id] });
                      }}
                    >
                      <Icon name="Phone" size={16} className="mr-2" />
                      {phoneVisibleMap[item.id] ? item.phone : 'Показать'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <Icon name="SearchX" size={64} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600">Ничего не найдено</p>
            <p className="text-gray-500 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>
    </section>
  );
}