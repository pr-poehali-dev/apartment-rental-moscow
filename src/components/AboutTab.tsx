import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

export default function AboutTab() {
  return (
    <div className="animate-fade-in">
      <section className="max-w-[800px] mx-auto px-6 py-32">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-balance">
          О платформе<br/>Арена 1
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
  );
}