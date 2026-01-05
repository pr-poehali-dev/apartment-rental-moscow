import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

export default function OwnersTab() {
  return (
    <div className="animate-fade-in">
      <section className="max-w-[800px] mx-auto px-6 py-32">
        <p className="text-xl text-muted-foreground mb-12 text-balance">
          Тысячи людей ищут объекты на короткие сроки. Начните зарабатывать с платформой, которая использует расширенное SEO продвижение в сети интернета.
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
  );
}