import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import styles from '@/components/NavButton.module.scss';
import RentTab from '@/components/RentTab';
import OwnersTab from '@/components/OwnersTab';
import AboutTab from '@/components/AboutTab';
import DashboardTab from '@/components/DashboardTab';
import { Link } from 'react-router-dom';

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

interface CleaningTask {
  id: number;
  apartmentId: number;
  date: string;
  time: string;
  status: 'pending' | 'in_progress' | 'completed';
  cleaner: string;
  price: number;
  duration: number;
  notes: string;
}

const apartments: Apartment[] = [
  {
    id: 1,
    title: 'Студия с видом на реку',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
    price: 3500,
    metro: 'Парк Культуры',
    address: 'Остоженка, 12',
    area: 32,
    rooms: 1,
    telegram: '@owner1',
    views: 0,
    telegramClicks: 0
  },
  {
    id: 2,
    title: 'Двушка в центре',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
    price: 5200,
    metro: 'Маяковская',
    address: 'Тверская, 25',
    area: 65,
    rooms: 2,
    telegram: '@owner2',
    views: 0,
    telegramClicks: 0
  },
  {
    id: 3,
    title: 'Лофт в арт-кластере',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
    price: 7800,
    metro: 'Кропоткинская',
    address: 'Болотная наб., 3',
    area: 85,
    rooms: 3,
    telegram: '@owner3',
    views: 0,
    telegramClicks: 0
  }
];

const initialCleaningTasks: CleaningTask[] = [
  { id: 1, apartmentId: 1, date: '2026-01-05', time: '10:00', status: 'completed', cleaner: 'Анна И.', price: 1500, duration: 120, notes: 'Стандартная уборка' },
  { id: 2, apartmentId: 1, date: '2026-01-06', time: '14:00', status: 'completed', cleaner: 'Мария С.', price: 1500, duration: 110, notes: '' },
  { id: 3, apartmentId: 2, date: '2026-01-05', time: '11:00', status: 'completed', cleaner: 'Анна И.', price: 2200, duration: 150, notes: 'Генеральная уборка' },
  { id: 4, apartmentId: 1, date: '2026-01-07', time: '10:00', status: 'in_progress', cleaner: 'Анна И.', price: 1500, duration: 0, notes: '' },
  { id: 5, apartmentId: 3, date: '2026-01-07', time: '15:00', status: 'pending', cleaner: 'Мария С.', price: 2500, duration: 0, notes: 'Трёхкомнатная' },
  { id: 6, apartmentId: 2, date: '2026-01-08', time: '12:00', status: 'pending', cleaner: 'Анна И.', price: 2200, duration: 0, notes: '' },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'rent' | 'owners' | 'about' | 'dashboard'>('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [apartmentStats, setApartmentStats] = useState<Apartment[]>(apartments);
  const [heroTextIndex, setHeroTextIndex] = useState(0);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [cleaningTasks] = useState<CleaningTask[]>(initialCleaningTasks);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const heroTexts = [
    'ВЫБИРАЕТЕ - СВЯЗЫВАЕТЕСЬ - БРОНИРУЕТЕ',
    'УДОБНЫЙ ПОИСК ОТЕЛЕЙ И АПАРТАМЕНТОВ НА ЧАС'
  ];

  const heroImages = [
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/abf18d9f-7064-4f95-b54f-65f635715d35.jpg',
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/24bbf238-9489-49c2-9a1c-81a85408acaa.jpg',
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/4128894a-32d8-4d8c-8189-e74382772cf2.jpg',
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/c9cd164a-bdc0-4a82-9802-9c92f0bd8b04.jpg',
    'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/638df8ca-c153-486e-8706-073cd19a93f2.jpg'
  ];

  const trackView = (apartmentId: number) => {
    setApartmentStats(prev => prev.map(apt => 
      apt.id === apartmentId ? { ...apt, views: apt.views + 1 } : apt
    ));
  };

  const trackTelegramClick = (apartmentId: number) => {
    setApartmentStats(prev => prev.map(apt => 
      apt.id === apartmentId ? { ...apt, telegramClicks: apt.telegramClicks + 1 } : apt
    ));
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setHeroTextIndex((prev) => (prev + 1) % heroTexts.length);
    }, 4000);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setHeroImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(imageInterval);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-12">
            <div className="flex items-center gap-2 sm:gap-3">
              <img 
                src="https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/ce30d053-d4f9-4cf6-9987-524223dff568.jpg"
                alt="120 минут"
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <h1 
                className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent cursor-pointer" 
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                onClick={() => { setActiveTab('rent'); setMobileMenuOpen(false); }}
              >
                🚀 120 минут
              </h1>
              <Link to="/admin">
                <Button size="sm" variant="outline">АДМИН</Button>
              </Link>
            </div>
            <div className="hidden lg:flex gap-4">
              <button 
                onClick={() => setActiveTab('owners')}
                className={`${styles.navButton} ${activeTab === 'owners' ? styles.active : ''}`}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Собственникам
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`${styles.navButton} ${activeTab === 'about' ? styles.active : ''}`}
              >
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                О платформе
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              size="sm" 
              className="rounded-full font-medium shadow-sm text-xs sm:text-sm h-9 sm:h-10 px-3 sm:px-4"
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
            >
              <Icon name="LayoutDashboard" size={14} className="sm:mr-1" />
              <span className="hidden sm:inline">Личный кабинет</span>
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="lg:hidden h-9 w-9 p-0"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Icon name={mobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-14 left-0 right-0 glass border-b border-gray-200 shadow-lg">
            <div className="max-w-[1200px] mx-auto px-4 py-4 flex flex-col gap-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-base font-medium h-12"
                onClick={() => { setActiveTab('owners'); setMobileMenuOpen(false); }}
              >
                <Icon name="Building" size={18} className="mr-3" />
                Собственникам
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-base font-medium h-12"
                onClick={() => { setActiveTab('about'); setMobileMenuOpen(false); }}
              >
                <Icon name="Info" size={18} className="mr-3" />
                О платформе
              </Button>
            </div>
          </div>
        )}
      </nav>

      <main className="pt-14">
        {activeTab === 'rent' && (
          <RentTab
            apartmentStats={apartmentStats}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            trackView={trackView}
            trackTelegramClick={trackTelegramClick}
            scrollY={scrollY}
            heroTextIndex={heroTextIndex}
            heroTexts={heroTexts}
            heroImageIndex={heroImageIndex}
            heroImages={heroImages}
          />
        )}

        {activeTab === 'owners' && <OwnersTab />}

        {activeTab === 'about' && <AboutTab />}

        {activeTab === 'dashboard' && <DashboardTab />}
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