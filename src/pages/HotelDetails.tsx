import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { useState } from 'react';

interface Room {
  id: number;
  name: string;
  image: string;
  price: number;
  area: number;
  description: string;
  amenities: string[];
  telegram: string;
  minHours: number;
}

interface Hotel {
  id: number;
  name: string;
  address: string;
  metro: string;
  description: string;
  rooms: Room[];
}

const hotelsData: Record<string, Hotel> = {
  '101': {
    id: 101,
    name: 'Бутик-отель "Уют"',
    address: 'Арбат, 15',
    metro: 'Арбатская',
    description: 'Уютный бутик-отель в самом центре Москвы с комфортными номерами для краткосрочной аренды',
    rooms: [
      {
        id: 1,
        name: 'Стандарт',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
        price: 3500,
        area: 20,
        description: 'Комфортный номер с двуспальной кроватью, идеально подходит для краткосрочного отдыха',
        amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Душ'],
        telegram: '@hotel_uyut_standard',
        minHours: 2
      },
      {
        id: 2,
        name: 'Стандарт Плюс',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
        price: 4500,
        area: 25,
        description: 'Улучшенный номер с зоной отдыха и современными удобствами',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Мини-бар', 'Диван'],
        telegram: '@hotel_uyut_standard_plus',
        minHours: 2
      },
      {
        id: 3,
        name: 'Романтик',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg',
        price: 5500,
        area: 28,
        description: 'Романтический номер с красивым интерьером и джакузи',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Джакузи', 'Мини-бар', 'Свечи'],
        telegram: '@hotel_uyut_romantic',
        minHours: 3
      },
      {
        id: 4,
        name: 'Полулюкс',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
        price: 6500,
        area: 35,
        description: 'Просторный номер повышенной комфортности с отдельной гостиной зоной',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Джакузи', 'Мини-бар', 'Гостиная зона', 'Кофемашина'],
        telegram: '@hotel_uyut_junior',
        minHours: 3
      }
    ]
  },
  '102': {
    id: 102,
    name: 'Отель "Центральный"',
    address: 'Тверская, 10',
    metro: 'Тверская',
    description: 'Современный отель в центре Москвы с различными категориями номеров',
    rooms: [
      {
        id: 5,
        name: 'Стандарт',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg',
        price: 4000,
        area: 22,
        description: 'Уютный стандартный номер с необходимыми удобствами',
        amenities: ['Wi-Fi', 'Телевизор', 'Кондиционер', 'Душ'],
        telegram: '@hotel_central_standard',
        minHours: 2
      },
      {
        id: 6,
        name: 'Бизнес',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
        price: 5000,
        area: 28,
        description: 'Номер для деловых встреч с рабочей зоной',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Рабочий стол', 'Кофемашина'],
        telegram: '@hotel_central_business',
        minHours: 3
      },
      {
        id: 7,
        name: 'Люкс',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg',
        price: 7000,
        area: 40,
        description: 'Роскошный номер с панорамным видом на город',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Ванна', 'Джакузи', 'Мини-бар', 'Панорамные окна'],
        telegram: '@hotel_central_lux',
        minHours: 4
      }
    ]
  },
  '103': {
    id: 103,
    name: 'Мини-отель "Москва"',
    address: 'Павелецкая пл., 2',
    metro: 'Павелецкая',
    description: 'Компактный мини-отель с доступными ценами и уютной атмосферой',
    rooms: [
      {
        id: 8,
        name: 'Эконом',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg',
        price: 2500,
        area: 18,
        description: 'Бюджетный номер с базовыми удобствами',
        amenities: ['Wi-Fi', 'Телевизор', 'Душ'],
        telegram: '@hotel_moscow_econom',
        minHours: 2
      },
      {
        id: 9,
        name: 'Комфорт',
        image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
        price: 3800,
        area: 24,
        description: 'Комфортный номер с улучшенной мебелью',
        amenities: ['Wi-Fi', 'Smart TV', 'Кондиционер', 'Душ', 'Холодильник'],
        telegram: '@hotel_moscow_comfort',
        minHours: 2
      }
    ]
  }
};

export default function HotelDetails() {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  const hotel = hotelId ? hotelsData[hotelId] : null;

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Отель не найден</h2>
          <Button onClick={() => navigate('/')}>Вернуться на главную</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад
          </Button>
          <div className="flex items-center gap-2 sm:gap-3">
            <img 
              src="https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/ce30d053-d4f9-4cf6-9987-524223dff568.jpg"
              alt="120 минут"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <h1 
              className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer" 
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              onClick={() => navigate('/')}
            >
              120 минут
            </h1>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="pt-20 pb-12">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          {/* Hotel Info */}
          <div className="mb-12">
            <h1 className="text-3xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={20} />
                <span>{hotel.address}</span>
              </div>
              <Badge variant="secondary" className="rounded-full">
                <Icon name="Train" size={14} className="mr-1" />
                {hotel.metro}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {hotel.description}
            </p>
          </div>

          {/* Rooms Grid */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              Доступные номера
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotel.rooms.map((room) => (
                <Card 
                  key={room.id}
                  className={`overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                    selectedRoom === room.id ? 'ring-2 ring-purple-500' : ''
                  }`}
                  onClick={() => setSelectedRoom(room.id)}
                >
                  <div className="relative h-64">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="hero-gradient text-white border-0 rounded-full font-bold text-lg px-4 py-2 shadow-lg">
                        {room.price}₽/ч
                      </Badge>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
                      {room.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Icon name="Maximize" size={16} />
                        <span>{room.area} м²</span>
                      </div>
                      <span className="text-red-600 font-semibold">от {room.minHours}ч</span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                      {room.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {room.amenities.map((amenity, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>

                    <Button
                      className="w-full rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`https://t.me/${room.telegram.replace('@', '')}`, '_blank');
                      }}
                    >
                      <Icon name="MessageCircle" size={18} className="mr-2" />
                      Забронировать в Telegram
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>120 минут © 2026 • Почасовая аренда квартир</span>
          </div>
        </div>
      </footer>
    </div>
  );
}