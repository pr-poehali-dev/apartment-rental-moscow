import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Hotel {
  id: number;
  name: string;
  image: string;
  pricePerHour: number;
  pricePerNight: number;
  rating: number;
  address: string;
  metro: string;
  amenities: string[];
  telegram: string;
}

const hotels: Hotel[] = [
  {
    id: 1,
    name: 'Гранд Отель Премиум',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
    pricePerHour: 2500,
    pricePerNight: 8500,
    rating: 4.8,
    address: 'ул. Тверская, 15',
    metro: 'Маяковская',
    amenities: ['Wi-Fi', 'Паркинг', 'Бар', 'Спа', 'Конференц-зал'],
    telegram: '@grandhotel_premium'
  },
  {
    id: 2,
    name: 'Люкс Резиденс',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg',
    pricePerHour: 1800,
    pricePerNight: 6500,
    rating: 4.6,
    address: 'Кутузовский проспект, 48',
    metro: 'Парк Победы',
    amenities: ['Wi-Fi', 'Бассейн', 'Фитнес-зал', 'Ресторан', 'Паркинг'],
    telegram: '@luxresidence_hotel'
  }
];

export default function HotelsTab() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10 sm:mb-16">
        <h2 className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">
          Отели Москвы
        </h2>
        <p className="text-base sm:text-xl text-muted-foreground">
          Комфортные номера на час или на ночь
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hotels.map((hotel) => (
          <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                <span className="font-semibold text-sm">{hotel.rating}</span>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{hotel.name}</h3>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Icon name="MapPin" size={16} />
                <span>{hotel.address}</span>
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  {hotel.metro}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {hotel.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="border-t pt-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">На час:</span>
                  <span className="text-xl font-bold">{hotel.pricePerHour} ₽</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">На ночь:</span>
                  <span className="text-xl font-bold">{hotel.pricePerNight} ₽</span>
                </div>
              </div>

              <Button
                className="w-full rounded-full"
                onClick={() => window.open(`https://t.me/${hotel.telegram.replace('@', '')}`, '_blank')}
              >
                <Icon name="MessageCircle" size={18} className="mr-2" />
                Связаться в Telegram
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-muted-foreground mb-4">
          Не нашли подходящий вариант?
        </p>
        <Button size="lg" variant="outline" className="rounded-full">
          <Icon name="Plus" size={18} className="mr-2" />
          Показать больше отелей
        </Button>
      </div>
    </div>
  );
}
