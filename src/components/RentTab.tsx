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
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'hotels' | 'apartments' | 'saunas' | 'conference'>('hotels');
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);

  const apartmentCoordinates: Record<number, { lat: number; lon: number }> = {
    1: { lat: 55.740700, lon: 37.597700 }, // Остоженка, 12
    2: { lat: 55.760500, lon: 37.605300 }, // Тверская, 25
    3: { lat: 55.742200, lon: 37.609700 }  // Болотная наб., 3
  };

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
              onClick={() => setActiveCategory('hotels')}
            >
              <Icon name="Building2" size={20} className="mr-2" />
              Отели
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'apartments' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => setActiveCategory('apartments')}
            >
              <Icon name="Home" size={20} className="mr-2" />
              Апартаменты
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'saunas' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => setActiveCategory('saunas')}
            >
              <Icon name="Droplets" size={20} className="mr-2" />
              Сауны
            </Button>
            <Button 
              size="lg" 
              className={`hero-button text-white rounded-full px-6 sm:px-8 h-14 text-base sm:text-lg font-semibold w-full transition-all ${activeCategory === 'conference' ? 'hero-gradient' : 'bg-white/20 hover:bg-white/30'}`}
              onClick={() => setActiveCategory('conference')}
            >
              <Icon name="Presentation" size={20} className="mr-2" />
              Конференц-залы
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12 sm:py-20">
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
              key={selectedApartment}
              src={selectedApartment && apartmentCoordinates[selectedApartment]
                ? `https://yandex.ru/map-widget/v1/?ll=${apartmentCoordinates[selectedApartment].lon}%2C${apartmentCoordinates[selectedApartment].lat}&z=15&l=map&pt=37.597700,55.740700,pm2${selectedApartment === 1 ? 'blm' : 'rdm'}~37.605300,55.760500,pm2${selectedApartment === 2 ? 'blm' : 'rdm'}~37.609700,55.742200,pm2${selectedApartment === 3 ? 'blm' : 'rdm'}`
                : `https://yandex.ru/map-widget/v1/?ll=37.617700%2C55.755800&z=12&l=map&pt=37.597700,55.740700,pm2rdm~37.605300,55.760500,pm2rdm~37.609700,55.742200,pm2rdm`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen
              style={{ position: 'relative' }}
            />
          </div>
        </div>

        <div className="text-center py-16">
          <div className="inline-block p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl">
            <Icon name={categoryConfig[activeCategory].icon as any} size={64} className="mx-auto mb-4 text-purple-600" />
            <h3 className="text-2xl font-bold mb-2">Скоро здесь появятся предложения</h3>
            <p className="text-muted-foreground">Раздел "{categoryConfig[activeCategory].title}" в разработке</p>
          </div>
        </div>
      </section>

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