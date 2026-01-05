import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Apartment {
  id: number;
  title: string;
  image: string;
  price: number;
  metro: string;
  address: string;
  area: number;
  rooms: number;
  telegram: string;
  views: number;
  telegramClicks: number;
  lat: number;
  lon: number;
  category: 'hotels' | 'apartments' | 'saunas' | 'conference';
}

interface RentTabProps {
  apartmentStats: Apartment[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  trackView: (id: number) => void;
  trackTelegramClick: (id: number) => void;
  scrollY: number;
  heroTextIndex: number;
  heroTexts: string[];
  heroImageIndex: number;
  heroImages: string[];
}

export default function RentTab({
  apartmentStats,
  searchQuery,
  setSearchQuery,
  trackView,
  trackTelegramClick,
  scrollY,
  heroTextIndex,
  heroTexts,
  heroImageIndex,
  heroImages
}: RentTabProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'hotels' | 'apartments' | 'saunas' | 'conference' | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);

  const handleCategoryClick = (category: 'hotels' | 'apartments' | 'saunas' | 'conference') => {
    setActiveCategory(category);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const categoryListings: Apartment[] = [
    // Отели
    { id: 101, title: 'Бутик-отель "Уют"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg', price: 4500, metro: 'Арбатская', address: 'Арбат, 15', area: 25, rooms: 1, telegram: '@hotel1', views: 0, telegramClicks: 0, lat: 55.752023, lon: 37.593760, category: 'hotels' },
    { id: 102, title: 'Отель "Центральный"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg', price: 5000, metro: 'Тверская', address: 'Тверская, 10', area: 30, rooms: 1, telegram: '@hotel2', views: 0, telegramClicks: 0, lat: 55.764828, lon: 37.605074, category: 'hotels' },
    { id: 103, title: 'Мини-отель "Москва"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg', price: 3800, metro: 'Павелецкая', address: 'Павелецкая пл., 2', area: 22, rooms: 1, telegram: '@hotel3', views: 0, telegramClicks: 0, lat: 55.729625, lon: 37.638869, category: 'hotels' },
    
    // Апартаменты
    { id: 201, title: 'Студия с видом на реку', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg', price: 3500, metro: 'Парк Культуры', address: 'Остоженка, 12', area: 32, rooms: 1, telegram: '@owner1', views: 0, telegramClicks: 0, lat: 55.740700, lon: 37.597700, category: 'apartments' },
    { id: 202, title: 'Двушка в центре', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg', price: 5200, metro: 'Маяковская', address: 'Тверская, 25', area: 65, rooms: 2, telegram: '@owner2', views: 0, telegramClicks: 0, lat: 55.760500, lon: 37.605300, category: 'apartments' },
    { id: 203, title: 'Лофт в арт-кластере', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg', price: 7800, metro: 'Кропоткинская', address: 'Болотная наб., 3', area: 85, rooms: 3, telegram: '@owner3', views: 0, telegramClicks: 0, lat: 55.742200, lon: 37.609700, category: 'apartments' },
    
    // Сауны
    { id: 301, title: 'Сауна "Релакс"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg', price: 6000, metro: 'Сокол', address: 'Ленинградский пр., 45', area: 50, rooms: 2, telegram: '@sauna1', views: 0, telegramClicks: 0, lat: 55.805563, lon: 37.514996, category: 'saunas' },
    { id: 302, title: 'Финская сауна', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg', price: 7500, metro: 'Белорусская', address: '1-я Тверская-Ямская, 8', area: 60, rooms: 3, telegram: '@sauna2', views: 0, telegramClicks: 0, lat: 55.777109, lon: 37.582039, category: 'saunas' },
    
    // Конференц-залы
    { id: 401, title: 'Зал "Переговорная"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg', price: 8000, metro: 'Белорусская', address: 'Ленинградский пр., 1', area: 40, rooms: 1, telegram: '@conf1', views: 0, telegramClicks: 0, lat: 55.776556, lon: 37.583206, category: 'conference' },
    { id: 402, title: 'Конференц-зал "Бизнес"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg', price: 10000, metro: 'Курская', address: 'Земляной вал, 27', area: 80, rooms: 2, telegram: '@conf2', views: 0, telegramClicks: 0, lat: 55.758389, lon: 37.660644, category: 'conference' }
  ];

  const filteredListings = categoryListings.filter(item => item.category === activeCategory);

  const categoryConfig = {
    hotels: { title: 'Отели', placeholder: 'Найти отель по адресу или метро', icon: 'Building2' },
    apartments: { title: 'Апартаменты', placeholder: 'Найти апартаменты по адресу или метро', icon: 'Home' },
    saunas: { title: 'Сауны', placeholder: 'Найти сауну по адресу или метро', icon: 'Droplets' },
    conference: { title: 'Конференц-залы', placeholder: 'Найти конференц-зал по адресу или метро', icon: 'Presentation' }
  };

  const getWeatherIcon = (code: number | null) => {
    if (code === null) return 'Cloud';
    if (code === 0 || code === 1) return 'Sun'; // Ясно
    if (code === 2 || code === 3) return 'CloudSun'; // Облачно
    if (code >= 45 && code <= 48) return 'CloudFog'; // Туман
    if (code >= 51 && code <= 67) return 'CloudRain'; // Дождь
    if (code >= 71 && code <= 77) return 'CloudSnow'; // Снег
    if (code >= 80 && code <= 82) return 'CloudDrizzle'; // Ливень
    if (code >= 85 && code <= 86) return 'Snowflake'; // Снегопад
    if (code >= 95 && code <= 99) return 'CloudLightning'; // Гроза
    return 'Cloud';
  };

  useEffect(() => {
    const fetchTemperature = () => {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true')
        .then(res => res.json())
        .then(data => {
          setTemperature(Math.round(data.current_weather.temperature));
          setWeatherCode(data.current_weather.weathercode);
        })
        .catch(() => {
          setTemperature(null);
          setWeatherCode(null);
        });
    };

    // Получаем температуру сразу
    fetchTemperature();

    // Обновляем каждые 10 минут (600000 мс)
    const interval = setInterval(fetchTemperature, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <section ref={heroRef} className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        {heroImages.map((image, idx) => (
          <img 
            key={idx}
            src={image}
            alt={`Hero ${idx + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1500ms] ease-in-out ${
              idx === heroImageIndex ? 'opacity-40 scale-100' : 'opacity-0 scale-105'
            }`}
            style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
        <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-5xl">
          <div className="mb-4 sm:mb-6 fade-slide-in flex flex-wrap items-center justify-center gap-3">
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full promo-badge">
              <span className="text-sm sm:text-base md:text-lg font-bold text-white whitespace-nowrap">ПОЧАСОВАЯ АРЕНДА В МОСКВЕ</span>
            </div>
            <div className="inline-block px-4 sm:px-6 py-2 sm:py-3 rounded-full promo-badge">
              <span className="text-sm sm:text-base md:text-lg font-bold text-white whitespace-nowrap">БЕЗ ПОСРЕДНИКОВ</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 sm:gap-6 mb-6 fade-slide-in" style={{ animationDelay: '0.1s' }}>
            <h2 
              className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-blue-200 via-white to-purple-200 bg-clip-text text-transparent"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              УЮТНАЯ ЗИМА
            </h2>
            {temperature !== null && (
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20">
                <Icon name={getWeatherIcon(weatherCode)} size={36} className="text-yellow-300" />
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold">{temperature > 0 ? '+' : ''}{temperature}</span>
                  <span className="text-2xl font-light">°C</span>
                </div>
              </div>
            )}
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold mb-6 tracking-tight transition-all duration-500 fade-slide-in"
            style={{ fontFamily: 'Syne, sans-serif', animationDelay: '0.2s' }}
            dangerouslySetInnerHTML={{ __html: heroTexts[heroTextIndex] }}
          />
          <p className="text-xl md:text-2xl font-light mb-2 text-white/90 fade-slide-in" style={{ animationDelay: '0.3s' }}>
            №1 в почасовой аренде
          </p>
          <p className="text-lg md:text-xl font-light mb-8 text-white/80 fade-slide-in" style={{ animationDelay: '0.3s' }}>
            Без посредников / Без регистрации
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto fade-slide-in px-4" style={{ animationDelay: '0.4s' }}>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'hotels' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => handleCategoryClick('hotels')}
            >
              <Icon name="Building2" size={20} className="mr-2" />
              Отели
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'apartments' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => handleCategoryClick('apartments')}
            >
              <Icon name="Home" size={20} className="mr-2" />
              Апартаменты
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'saunas' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => handleCategoryClick('saunas')}
            >
              <Icon name="Droplets" size={20} className="mr-2" />
              Сауны
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'conference' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => handleCategoryClick('conference')}
            >
              <Icon name="Presentation" size={20} className="mr-2" />
              Конференц-залы
            </Button>
          </div>
        </div>
      </section>

      {activeCategory && (
        <section ref={resultsRef} className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
              <Icon name={categoryConfig[activeCategory].icon as any} size={32} className="inline mr-3 text-purple-600" />
              {categoryConfig[activeCategory].title}
            </h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div>
              <Input
                type="search"
                placeholder={categoryConfig[activeCategory].placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 sm:h-14 rounded-full border-gray-300 px-4 sm:px-6 text-sm sm:text-base"
              />
            </div>
            <div className="h-[300px] lg:h-[400px] rounded-2xl overflow-hidden border-2 border-gray-200">
              <iframe
                key={`${activeCategory}-${selectedApartment}`}
                src={(() => {
                  const selectedListing = filteredListings.find(item => item.id === selectedApartment);
                  const markers = filteredListings.map(item => 
                    `${item.lon},${item.lat},pm2${item.id === selectedApartment ? 'blm' : 'rdm'}`
                  ).join('~');
                  
                  if (selectedListing) {
                    return `https://yandex.ru/map-widget/v1/?ll=${selectedListing.lon}%2C${selectedListing.lat}&z=15&l=map&pt=${markers}`;
                  }
                  
                  const centerLat = filteredListings.reduce((sum, item) => sum + item.lat, 0) / filteredListings.length;
                  const centerLon = filteredListings.reduce((sum, item) => sum + item.lon, 0) / filteredListings.length;
                  return `https://yandex.ru/map-widget/v1/?ll=${centerLon}%2C${centerLat}&z=12&l=map&pt=${markers}`;
                })()}
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ position: 'relative' }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((apt) => {
              const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`Москва, ${apt.address}`)}`;
              return (
                <Card 
                  key={apt.id} 
                  className={`overflow-hidden border-2 shadow-lg hover:shadow-2xl cursor-pointer group rounded-3xl bg-white transition-all duration-300 hover:-translate-y-2 ${selectedApartment === apt.id ? 'border-purple-500 ring-2 ring-purple-300' : 'border-transparent'}`}
                  onClick={() => {
                    trackView(apt.id);
                    setSelectedApartment(apt.id);
                  }}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100 relative">
                    <img 
                      src={apt.image} 
                      alt={apt.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="hero-gradient text-white border-0 rounded-full font-bold text-base px-4 py-2 shadow-lg">
                        {apt.price}₽/ч
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 bg-gradient-to-b from-white to-gray-50">
                    <h3 className="text-xl font-bold tracking-tight mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>{apt.title}</h3>
                    <div className="space-y-3 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          <Icon name="MapPin" size={14} className="text-purple-600" />
                        </div>
                        <span className="font-medium">{apt.metro}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <Icon name="Home" size={14} className="text-blue-600" />
                        </div>
                        <span className="font-medium">{apt.area} м² • {apt.rooms} комн.</span>
                      </div>
                      <a 
                        href={yandexMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-primary hover:text-purple-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                          <Icon name="Navigation" size={14} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-medium underline">{apt.address}</span>
                      </a>
                    </div>
                    <Button 
                      className="w-full rounded-full h-12 mt-2 hero-gradient text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        trackTelegramClick(apt.id);
                        window.open(`https://t.me/${apt.telegram.replace('@', '')}`, '_blank');
                      }}
                    >
                      <Icon name="MessageCircle" size={18} />
                      Заявка в Telegram
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>
      )}

      <section className="bg-secondary py-20">
        <div className="max-w-[1200px] mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
            Как это работает
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { icon: 'Search', title: 'Выбираете', desc: 'Смотрите предложения с фото и описанием' },
              { icon: 'MessageCircle', title: 'Связываетесь', desc: 'Пишете собственнику в Telegram' },
              { icon: 'CalendarCheck', title: 'Бронируете', desc: 'Договариваетесь и бронируете' }
            ].map((step, idx) => (
              <div key={idx} className="text-center step-fade-in step-card">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center step-icon">
                  <Icon name={step.icon as any} size={28} className="text-background" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}