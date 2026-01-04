import { Card } from '@/components/ui/card';
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

interface DashboardTabProps {
  apartmentStats: Apartment[];
  cleaningTasks: CleaningTask[];
}

export default function DashboardTab({ apartmentStats, cleaningTasks }: DashboardTabProps) {
  return (
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

        <h3 className="text-2xl font-bold mb-6 mt-12">График уборки и начисление ЗП</h3>
        
        <Card className="p-6 border-0 shadow-sm rounded-2xl mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">
                {cleaningTasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Выполнено</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600">
                {cleaningTasks.filter(t => t.status === 'in_progress').length}
              </div>
              <div className="text-sm text-muted-foreground">В процессе</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-2xl font-bold text-orange-600">
                {cleaningTasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Запланировано</div>
            </div>
            <div className="text-center p-4 bg-secondary/50 rounded-xl">
              <div className="text-2xl font-bold text-primary">
                {cleaningTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.price, 0).toLocaleString()}₽
              </div>
              <div className="text-sm text-muted-foreground">Начислено ЗП</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Дата</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Время</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Квартира</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Клинер</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Статус</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Длительность</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-muted-foreground">ЗП</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Примечания</th>
                </tr>
              </thead>
              <tbody>
                {cleaningTasks.map((task) => {
                  const apartment = apartmentStats.find(a => a.id === task.apartmentId);
                  return (
                    <tr key={task.id} className="border-b border-gray-100 hover:bg-secondary/30 transition-colors">
                      <td className="py-4 px-4 text-sm">
                        {new Date(task.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                      </td>
                      <td className="py-4 px-4 text-sm">{task.time}</td>
                      <td className="py-4 px-4 text-sm font-medium">{apartment?.title}</td>
                      <td className="py-4 px-4 text-sm">{task.cleaner}</td>
                      <td className="py-4 px-4">
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : task.status === 'in_progress' ? 'secondary' : 'outline'}
                          className="rounded-full text-xs"
                        >
                          {task.status === 'completed' ? 'Выполнено' : task.status === 'in_progress' ? 'В работе' : 'Ожидает'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {task.duration > 0 ? `${task.duration} мин` : '—'}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`text-sm font-semibold ${task.status === 'completed' ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {task.status === 'completed' ? `${task.price.toLocaleString()}₽` : `${task.price.toLocaleString()}₽`}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">
                        {task.notes || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300 font-semibold">
                  <td colSpan={6} className="py-4 px-4 text-right text-sm">
                    Итого начислено:
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="text-lg font-bold text-primary">
                      {cleaningTasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.price, 0).toLocaleString()}₽
                    </span>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm mb-1 text-blue-900">Расчёт зарплаты</h4>
                <p className="text-xs text-blue-800">
                  • Студия (1 комн.) — 1,500₽ за уборку<br/>
                  • Двушка (2 комн.) — 2,200₽ за уборку<br/>
                  • Трёшка (3 комн.) — 2,500₽ за уборку<br/>
                  • Генеральная уборка: +500₽ к базовой ставке<br/>
                  • Оплата производится после подтверждения выполнения
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
