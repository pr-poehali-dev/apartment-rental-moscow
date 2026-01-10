import { useRef, useState, useEffect } from 'react';
import HeroSection from '@/components/rent/HeroSection';
import CategoryFilters from '@/components/rent/CategoryFilters';
import ListingsGrid from '@/components/rent/ListingsGrid';

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

const API_URL = 'https://functions.poehali.dev/1961571b-26cd-4f80-9709-45455d336430';

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
  const resultsRef = useRef<HTMLDivElement>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weatherCode, setWeatherCode] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'hotels' | 'apartments' | 'saunas' | 'conference' | null>(null);
  const [selectedApartment, setSelectedApartment] = useState<number | null>(null);
  const [phoneVisibleMap, setPhoneVisibleMap] = useState<Record<number, boolean>>({});
  const [hotelsFromDB, setHotelsFromDB] = useState<Apartment[]>([]);

  const handleCategoryClick = (category: 'hotels' | 'apartments' | 'saunas' | 'conference') => {
    setActiveCategory(category);
    if (category === 'hotels') {
      loadHotels();
    }
    setTimeout(() => {
      const section = document.getElementById('results-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const loadHotels = async () => {
    try {
      const response = await fetch(`${API_URL}?entity=hotels`);
      const data = await response.json();
      
      const mapped: Apartment[] = data.map((hotel: any) => ({
        id: hotel.id,
        title: hotel.name,
        image: hotel.images && hotel.images.length > 0 && hotel.images[0] 
          ? hotel.images[0] 
          : 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
        price: hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0].price : Number(hotel.price || 0),
        metro: hotel.metro || '',
        address: hotel.address,
        area: hotel.rooms && hotel.rooms.length > 0 ? hotel.rooms[0].area : 0,
        telegram: hotel.owner_telegram || '',
        views: 0,
        telegramClicks: 0,
        lat: 55.7558,
        lon: 37.6173,
        category: 'hotels' as const,
        minHours: 2,
        phone: hotel.owner_phone
      }));
      setHotelsFromDB(mapped);
    } catch (error) {
      console.error('Failed to load hotels:', error);
    }
  };

  const staticListings: Apartment[] = [
    // Апартаменты
    { id: 201, title: 'Студия с видом на реку', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg', price: 3500, metro: 'Парк Культуры', metroWalkMinutes: 8, address: 'Остоженка, 12', area: 32, telegram: '@owner1', views: 0, telegramClicks: 0, lat: 55.740700, lon: 37.597700, category: 'apartments' },
    { id: 202, title: 'Двушка в центре', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg', price: 5200, metro: 'Маяковская', metroWalkMinutes: 4, address: 'Тверская, 25', area: 65, telegram: '@owner2', views: 0, telegramClicks: 0, lat: 55.760500, lon: 37.605300, category: 'apartments' },
    { id: 203, title: 'Лофт в арт-кластере', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg', price: 7800, metro: 'Кропоткинская', metroWalkMinutes: 6, address: 'Болотная наб., 3', area: 85, telegram: '@owner3', views: 0, telegramClicks: 0, lat: 55.742200, lon: 37.609700, category: 'apartments' },
    
    // Сауны
    { id: 301, title: 'Сауна "Релакс"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg', price: 6000, metro: 'Сокол', metroWalkMinutes: 10, address: 'Ленинградский пр., 45', area: 50, telegram: '@sauna1', views: 0, telegramClicks: 0, lat: 55.805563, lon: 37.514996, category: 'saunas' },
    { id: 302, title: 'Финская сауна', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg', price: 7500, metro: 'Белорусская', metroWalkMinutes: 5, address: '1-я Тверская-Ямская, 8', area: 60, telegram: '@sauna2', views: 0, telegramClicks: 0, lat: 55.777109, lon: 37.582039, category: 'saunas' },
    
    // Конференц-залы
    { id: 401, title: 'Зал "Переговорная"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg', price: 8000, metro: 'Белорусская', metroWalkMinutes: 2, address: 'Ленинградский пр., 1', area: 40, telegram: '@conf1', views: 0, telegramClicks: 0, lat: 55.776556, lon: 37.583206, category: 'conference' },
    { id: 402, title: 'Конференц-зал "Бизнес"', image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg', price: 10000, metro: 'Курская', metroWalkMinutes: 4, address: 'Земляной вал, 27', area: 80, telegram: '@conf2', views: 0, telegramClicks: 0, lat: 55.758389, lon: 37.660644, category: 'conference' }
  ];

  const allListings = activeCategory === 'hotels' ? hotelsFromDB : staticListings;
  const filteredListings = allListings.filter(item => item.category === activeCategory);

  const getWeatherIcon = (code: number | null) => {
    if (code === null) return 'Cloud';
    if (code === 0 || code === 1) return 'Sun';
    if (code === 2 || code === 3) return 'CloudSun';
    if (code >= 45 && code <= 48) return 'CloudFog';
    if (code >= 51 && code <= 67) return 'CloudRain';
    if (code >= 71 && code <= 77) return 'CloudSnow';
    if (code >= 80 && code <= 82) return 'CloudDrizzle';
    if (code >= 85 && code <= 86) return 'Snowflake';
    if (code >= 95 && code <= 99) return 'CloudLightning';
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

    fetchTemperature();
    const interval = setInterval(fetchTemperature, 600000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="animate-fade-in">
      <HeroSection
        heroImageIndex={heroImageIndex}
        heroImages={heroImages}
        heroTextIndex={heroTextIndex}
        heroTexts={heroTexts}
        temperature={temperature}
        weatherCode={weatherCode}
        getWeatherIcon={getWeatherIcon}
        onCategoryClick={handleCategoryClick}
      />
      
      <CategoryFilters
        activeCategory={activeCategory}
        onCategoryClick={handleCategoryClick}
      />
      
      <ListingsGrid
        activeCategory={activeCategory}
        filteredListings={filteredListings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedApartment={selectedApartment}
        setSelectedApartment={setSelectedApartment}
        phoneVisibleMap={phoneVisibleMap}
        setPhoneVisibleMap={setPhoneVisibleMap}
        trackView={trackView}
        trackTelegramClick={trackTelegramClick}
      />
    </div>
  );
}