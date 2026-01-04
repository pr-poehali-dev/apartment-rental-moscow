import { useState, useEffect, useRef } from 'react';
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

interface OwnerStats {
  apartmentId: number;
  views: number;
  telegramClicks: number;
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

export default function Index() {
  const [activeTab, setActiveTab] = useState<'rent' | 'owners' | 'about' | 'dashboard'>('rent');
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollY, setScrollY] = useState(0);
  const [apartmentStats, setApartmentStats] = useState<Apartment[]>(apartments);
  const heroRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-2">
              <Icon name="Clock" size={20} className="text-primary" />
              <h1 className="text-2xl logo-text">Москва на час</h1>
            </div>
            <div className="hidden md:flex gap-2">
              <button 
                onClick={() => setActiveTab('rent')}
                className={`text-sm px-4 py-2 rounded-full transition-all ${activeTab === 'rent' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                Аренда
              </button>
              <button 
                onClick={() => setActiveTab('owners')}
                className={`text-sm px-4 py-2 rounded-full transition-all ${activeTab === 'owners' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                Собственникам
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`text-sm px-4 py-2 rounded-full transition-all ${activeTab === 'about' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                О платформе
              </button>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`text-sm px-4 py-2 rounded-full transition-all ${activeTab === 'dashboard' ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}
              >
                Личный кабинет
              </button>
            </div>
          </div>
          <Button size="sm" className="rounded-full">Войти</Button>
        </div>
      </nav>

      <main className="pt-14">
        {activeTab === 'rent' && (
          <div className="animate-fade-in">
            <section ref={heroRef} className="relative h-[calc(100vh-3.5rem)] flex items-center justify-center overflow-hidden bg-black">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
              <img 
                src="https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg"
                alt="Hero"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
                style={{ transform: `translateY(${scrollY * 0.5}px)` }}
              />
              <div className="relative z-10 text-center text-white px-6">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight uppercase animate-fade-up-big">
                  Почасовая аренда<br/>квартир в Москве
                </h2>
                <p className="text-xl md:text-2xl font-light mb-8 text-white/90 animate-fade-up" style={{ animationDelay: '0.3s', animationFillMode: 'backwards' }}>
                  Без посредников
                </p>
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 rounded-full px-8 h-12 animate-fade-up" style={{ animationDelay: '0.6s', animationFillMode: 'backwards' }}>
                  Смотреть квартиры
                </Button>
              </div>
            </section>

            <section className="max-w-[1200px] mx-auto px-6 py-20">
              <div className="mb-12">
                <Input
                  type="search"
                  placeholder="Найти квартиру по адресу или метро"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-2xl mx-auto h-12 rounded-full border-gray-300 px-6"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apartmentStats.map((apt) => {
                  const yandexMapsUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`Москва, ${apt.address}`)}`;
                  return (
                    <Card 
                      key={apt.id} 
                      className="overflow-hidden border-0 shadow-sm hover-lift cursor-pointer group rounded-2xl"
                      onClick={() => trackView(apt.id)}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                        <img 
                          src={apt.image} 
                          alt={apt.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-semibold tracking-tight">{apt.title}</h3>
                          <Badge variant="secondary" className="rounded-full font-semibold">
                            {apt.price}₽/ч
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Icon name="MapPin" size={16} />
                            <span>{apt.metro}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="Home" size={16} />
                            <span>{apt.area} м² • {apt.rooms} комн.</span>
                          </div>
                          <a 
                            href={yandexMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Icon name="Navigation" size={16} />
                            <span className="text-xs">{apt.address}</span>
                          </a>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            className="flex-1 rounded-full h-10"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              trackTelegramClick(apt.id);
                              window.open(`https://t.me/${apt.telegram.replace('@', '')}`, '_blank');
                            }}
                          >
                            <Icon name="MessageCircle" size={16} />
                            Telegram
                          </Button>
                          <Button 
                            className="flex-1 rounded-full h-10"
                            variant="outline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Забронировать
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </section>

            <section className="bg-secondary py-20">
              <div className="max-w-[1200px] mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 tracking-tight">
                  Как это работает
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  {[
                    { icon: 'Search', title: 'Выбираете', desc: 'Смотрите квартиры с фото и описанием' },
                    { icon: 'MessageCircle', title: 'Связываетесь', desc: 'Пишете собственнику в Telegram' },
                    { icon: 'Key', title: 'Заселяетесь', desc: 'Договариваетесь и въезжаете' }
                  ].map((step, idx) => (
                    <div key={idx} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground flex items-center justify-center">
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
        )}

        {activeTab === 'owners' && (
          <div className="animate-fade-in">
            <section className="max-w-[800px] mx-auto px-6 py-32">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                Сдавайте квартиру<br/>на своих условиях
              </h2>
              <p className="text-xl text-muted-foreground mb-12 text-balance">
                Тысячи людей ищут жильё каждый день. Зарабатывайте на своей квартире с нами.
              </p>

              <Card className="p-8 md:p-12 border-0 shadow-sm rounded-2xl">
                <h3 className="text-2xl font-bold mb-8">Условия размещения</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Комиссия 10%', desc: 'От каждой успешной брони' },
                    { title: 'Минимум 5 фото', desc: 'Качественные снимки квартиры' },
                    { title: 'Верификация', desc: 'Подтверждение личности' },
                    { title: 'Telegram-канал', desc: 'Для связи с арендаторами' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center mt-1">
                        <Icon name="Check" size={16} className="text-background" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-8 h-12 rounded-full text-base">
                  Начать сдавать
                </Button>
              </Card>

              <div className="mt-16 grid grid-cols-3 gap-8 text-center">
                {[
                  { value: '1,282', label: 'Просмотров' },
                  { value: '479', label: 'Кликов' },
                  { value: '85', label: 'Заявок' }
                ].map((stat, idx) => (
                  <div key={idx}>
                    <div className="text-4xl font-bold mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="animate-fade-in">
            <section className="max-w-[800px] mx-auto px-6 py-32">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
                О платформе<br/>Москва на час
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-muted-foreground mb-8">
                  Современная платформа для аренды квартир в Москве на любой срок: от часа до месяца. Прямая связь с собственниками без посредников.
                </p>
                
                <h3 className="text-2xl font-bold mb-4 mt-12">Преимущества</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[
                    { icon: 'Shield', text: 'Проверенные собственники' },
                    { icon: 'Clock', text: 'Аренда от часа' },
                    { icon: 'MapPin', text: 'Центр Москвы' },
                    { icon: 'TrendingUp', text: 'Прозрачная аналитика' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon name={item.icon as any} size={20} className="text-primary" />
                      <span className="font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <h3 className="text-2xl font-bold mb-4">Как начать?</h3>
                <p className="text-muted-foreground mb-4">
                  Выберите квартиру из каталога, свяжитесь с собственником через Telegram и договоритесь об условиях. Никаких посредников — только вы и владелец.
                </p>
                <Button className="rounded-full h-12 px-8">
                  Смотреть квартиры
                </Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            <section className="max-w-[1200px] mx-auto px-6 py-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 tracking-tight">
                Личный кабинет собственника
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                <Card className="p-6 border-0 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="Eye" size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {apartmentStats.reduce((sum, apt) => sum + apt.views, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Всего просмотров</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="MessageCircle" size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {apartmentStats.reduce((sum, apt) => sum + apt.telegramClicks, 0)}
                      </div>
                      <div className="text-sm text-muted-foreground">Переходов в Telegram</div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-0 shadow-sm rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon name="TrendingUp" size={24} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold">
                        {apartmentStats.length > 0 
                          ? Math.round((apartmentStats.reduce((sum, apt) => sum + apt.telegramClicks, 0) / apartmentStats.reduce((sum, apt) => sum + apt.views, 0) || 0) * 100)
                          : 0}%
                      </div>
                      <div className="text-sm text-muted-foreground">Конверсия</div>
                    </div>
                  </div>
                </Card>
              </div>

              <h3 className="text-2xl font-bold mb-6">Статистика по квартирам</h3>
              <div className="grid grid-cols-1 gap-4">
                {apartmentStats.map((apt) => (
                  <Card key={apt.id} className="p-6 border-0 shadow-sm rounded-2xl hover-lift">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        <img 
                          src={apt.image} 
                          alt={apt.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold mb-1">{apt.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{apt.address}</p>
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            <Icon name="Eye" size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{apt.views} просмотров</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="MessageCircle" size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">{apt.telegramClicks} переходов в TG</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon name="TrendingUp" size={16} className="text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {apt.views > 0 ? Math.round((apt.telegramClicks / apt.views) * 100) : 0}% конверсия
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="rounded-full font-semibold text-base px-4 py-2">
                        {apt.price}₽/ч
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 py-8 mt-20">
        <div className="max-w-[1200px] mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Icon name="Clock" size={16} />
            <span>Москва на час © 2026 • Почасовая аренда квартир</span>
          </div>
        </div>
      </footer>
    </div>
  );
}