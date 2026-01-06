import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import OwnerBriefModal from './OwnerBriefModal';

export default function OwnersTab() {
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);

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
              { title: '3 месяца бесплатного размещения', desc: 'Бесплатное поднятие в первые 3 месяца в топ 10 предложений каждую неделю' },
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
          <Button 
            className="w-full mt-8 h-12 rounded-full text-base"
            onClick={() => setIsBriefModalOpen(true)}
          >
            Начать сдавать
          </Button>
          
          <OwnerBriefModal 
            open={isBriefModalOpen} 
            onClose={() => setIsBriefModalOpen(false)} 
          />
          
          <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Если Вам понравилась статистика продажи Вашего объекта на короткие сроки, по истечении 3х месяцев, Вы можете воспользоваться платным размещением на платформе. <strong>1 предложение — 3000 рублей в месяц.</strong> В эту стоимость уже входит еженедельное поднятие предложения в Топ 30. При размещении нескольких объектов от 5 до 10, действует специальная цена <strong>10 000 рублей в месяц.</strong> За каждый последующий объект +1000 рублей в месяц.
            </p>
          </div>
        </Card>

        <div className="mt-16 text-center">
          <h3 className="text-4xl md:text-5xl font-bold mb-4">Я ПРОДАМ ВСЁ</h3>
          <p className="text-xl text-muted-foreground">
            Впечатляюще поднимем % загрузки Вашего объекта
          </p>
        </div>
      </section>
    </div>
  );
}