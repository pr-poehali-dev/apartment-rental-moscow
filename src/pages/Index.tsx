import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Apartment {
  id: number;
  title: string;
  image: string;
  price: number;
  metro: string;
  metroColor: string;
  address: string;
  description: string;
  telegram: string;
  views: number;
  clicks: number;
  requests: number;
}

const mockApartments: Apartment[] = [
  {
    id: 1,
    title: 'Студия с панорамным видом',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/a96a537d-b086-4154-a627-37ce0d73cd4f.jpg',
    price: 3500,
    metro: 'Парк Культуры',
    metroColor: 'bg-red-600',
    address: 'ул. Остоженка, 12',
    description: 'Уютная студия 32 м² с дизайнерским ремонтом и видом на Москву-реку',
    telegram: 't.me/apartment_owner1',
    views: 247,
    clicks: 89,
    requests: 12
  },
  {
    id: 2,
    title: 'Двушка в сталинке',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/e5ab91c8-b024-4279-a610-7927a666ae1a.jpg',
    price: 5200,
    metro: 'Маяковская',
    metroColor: 'bg-green-600',
    address: 'ул. Тверская, 25',
    description: 'Просторная квартира 65 м² с высокими потолками и лепниной',
    telegram: 't.me/apartment_owner2',
    views: 412,
    clicks: 156,
    requests: 28
  },
  {
    id: 3,
    title: 'Лофт на Красном Октябре',
    image: 'https://cdn.poehali.dev/projects/432e7c51-cea3-442e-b82d-2ac77f4ff46d/files/2644c7d5-13e5-4838-b53a-5b82cda63881.jpg',
    price: 7800,
    metro: 'Кропоткинская',
    metroColor: 'bg-red-600',
    address: 'Болотная наб., 3с2',
    description: 'Стильный лофт 85 м² в арт-кластере с террасой',
    telegram: 't.me/apartment_owner3',
    views: 623,
    clicks: 234,
    requests: 45
  }
];

export default function Index() {
  const [selectedTab, setSelectedTab] = useState('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black gradient-text">ЧасАренда</h1>
            <nav className="flex gap-6">
              <button onClick={() => setSelectedTab('catalog')} className="text-sm font-semibold hover:text-primary transition-colors">Каталог</button>
              <button onClick={() => setSelectedTab('about')} className="text-sm font-semibold hover:text-primary transition-colors">О платформе</button>
              <button onClick={() => setSelectedTab('owners')} className="text-sm font-semibold hover:text-primary transition-colors">Собственникам</button>
              <button onClick={() => setSelectedTab('dashboard')} className="text-sm font-semibold hover:text-primary transition-colors">Личный кабинет</button>
            </nav>
          </div>
        </div>
      </header>

      {selectedTab === 'catalog' && (
        <div className="animate-fade-in">
          <section className="py-20 bg-gradient-to-r from-primary via-secondary to-accent text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto px-4 relative z-10">
              <h2 className="text-6xl font-black mb-6 animate-scale-in">Аренда квартир <br/>на любой срок</h2>
              <p className="text-xl mb-8 max-w-2xl">Найди идеальную квартиру в Москве. От часа до месяца — выбирай гибкие условия.</p>
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6 rounded-2xl hover-scale">
                Смотреть квартиры
              </Button>
            </div>
          </section>

          <section className="container mx-auto px-4 py-12">
            <div className="bg-white rounded-3xl shadow-2xl p-8 -mt-16 relative z-20 border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Input 
                  placeholder="Поиск по адресу или метро..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-lg py-6 rounded-xl border-2 border-purple-200 focus:border-primary"
                />
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger className="text-lg py-6 rounded-xl border-2 border-purple-200">
                    <SelectValue placeholder="Цена" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любая цена</SelectItem>
                    <SelectItem value="low">До 4000 ₽</SelectItem>
                    <SelectItem value="mid">4000-6000 ₽</SelectItem>
                    <SelectItem value="high">Более 6000 ₽</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="text-lg py-6 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                  <Icon name="Search" className="mr-2" />
                  Найти
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mockApartments.map((apt) => (
                  <Card key={apt.id} className="overflow-hidden hover-scale rounded-2xl border-2 border-purple-100 hover:border-primary transition-all">
                    <div className="relative h-64 overflow-hidden">
                      <img src={apt.image} alt={apt.title} className="w-full h-full object-cover" />
                      <Badge className="absolute top-4 right-4 bg-white text-primary font-bold text-lg py-2 px-4">
                        {apt.price} ₽/час
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-3">{apt.title}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-3 h-3 rounded-full ${apt.metroColor}`}></div>
                        <span className="font-semibold text-muted-foreground">{apt.metro}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{apt.address}</p>
                      <p className="text-sm mb-4">{apt.description}</p>
                      <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 rounded-xl hover:opacity-90">
                        <Icon name="Send" className="mr-2" />
                        Запросить бронирование
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'about' && (
        <div className="animate-fade-in">
          <section className="container mx-auto px-4 py-20">
            <h2 className="text-5xl font-black gradient-text mb-12 text-center">Как это работает</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: 'Search', title: 'Выбираете квартиру', desc: 'Смотрите фото, описание, метро и цену' },
                { icon: 'MessageCircle', title: 'Отправляете запрос', desc: 'Связываетесь с собственником в Telegram' },
                { icon: 'Key', title: 'Заселяетесь', desc: 'Договариваетесь об условиях и въезжаете' }
              ].map((step, idx) => (
                <Card key={idx} className="p-8 text-center hover-scale rounded-3xl border-2 border-purple-100 hover:border-primary transition-all bg-white">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-6 hover:rotate-0 transition-transform">
                    <Icon name={step.icon as any} size={36} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-5xl font-black gradient-text mb-8 text-center">Преимущества платформы</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {[
                  { icon: 'Shield', text: 'Проверенные собственники' },
                  { icon: 'Clock', text: 'Аренда от часа' },
                  { icon: 'MapPin', text: 'Удобное расположение' },
                  { icon: 'TrendingUp', text: 'Прозрачная аналитика' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-md hover-scale">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Icon name={item.icon as any} size={24} className="text-white" />
                    </div>
                    <span className="text-xl font-semibold">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'owners' && (
        <div className="animate-fade-in">
          <section className="container mx-auto px-4 py-20">
            <h2 className="text-5xl font-black gradient-text mb-12 text-center">Для собственников</h2>
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-12 shadow-2xl border-2 border-purple-100">
              <h3 className="text-3xl font-bold mb-6">Условия размещения</h3>
              <ul className="space-y-4 text-lg">
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Комиссия 10%</strong> от каждой успешной брони</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Фото квартиры</strong> минимум 5 качественных снимков</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Верификация</strong> паспортные данные собственника</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Telegram-канал</strong> для связи с клиентами</span>
                </li>
                <li className="flex items-start gap-3">
                  <Icon name="Check" className="text-primary mt-1 flex-shrink-0" />
                  <span><strong>Аналитика</strong> полная статистика по квартире</span>
                </li>
              </ul>
              <Button className="w-full mt-8 bg-gradient-to-r from-primary to-secondary text-white font-bold py-6 text-lg rounded-xl hover:opacity-90">
                Начать сдавать квартиру
              </Button>
            </div>
          </section>
        </div>
      )}

      {selectedTab === 'dashboard' && (
        <div className="animate-fade-in">
          <section className="container mx-auto px-4 py-20">
            <h2 className="text-5xl font-black gradient-text mb-12">Личный кабинет собственника</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { icon: 'Eye', label: 'Просмотры', value: '1,282', color: 'from-blue-500 to-cyan-500' },
                { icon: 'MousePointer', label: 'Клики', value: '479', color: 'from-purple-500 to-pink-500' },
                { icon: 'MessageSquare', label: 'Запросы', value: '85', color: 'from-orange-500 to-red-500' }
              ].map((stat, idx) => (
                <Card key={idx} className="p-6 hover-scale rounded-2xl border-2 border-purple-100 bg-white">
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon name={stat.icon as any} size={28} className="text-white" />
                  </div>
                  <p className="text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-4xl font-black">{stat.value}</p>
                </Card>
              ))}
            </div>

            <Card className="p-8 rounded-3xl border-2 border-purple-100 bg-white">
              <h3 className="text-3xl font-bold mb-6">Мои квартиры</h3>
              <div className="space-y-4">
                {mockApartments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-6 bg-purple-50 rounded-2xl hover-scale">
                    <div className="flex items-center gap-6">
                      <img src={apt.image} alt={apt.title} className="w-24 h-24 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-xl font-bold mb-1">{apt.title}</h4>
                        <p className="text-muted-foreground">{apt.metro}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{apt.views}</p>
                        <p className="text-sm text-muted-foreground">просмотров</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold">{apt.clicks}</p>
                        <p className="text-sm text-muted-foreground">кликов</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{apt.requests}</p>
                        <p className="text-sm text-muted-foreground">запросов</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </section>
        </div>
      )}

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-black mb-4 gradient-text">ЧасАренда</h3>
          <p className="text-gray-400">Аренда квартир в Москве — удобно, быстро, прозрачно</p>
        </div>
      </footer>
    </div>
  );
}
