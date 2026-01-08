import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://functions.poehali.dev/49330ab6-db2f-4738-aaac-313eb821f419';

interface Promotion {
  id: number;
  title: string;
  description: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

interface PromotionsTabProps {
  promotions: Promotion[];
  onReload: () => void;
}

export default function PromotionsTab({ promotions, onReload }: PromotionsTabProps) {
  const { toast } = useToast();
  const [promoModalOpen, setPromoModalOpen] = useState(false);
  const [promoForm, setPromoForm] = useState({
    title: '',
    description: '',
    valid_until: '',
    is_active: true
  });

  const createPromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}?action=create_promotion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoForm)
      });
      
      if (res.ok) {
        toast({ title: 'Акция создана' });
        setPromoModalOpen(false);
        setPromoForm({ title: '', description: '', valid_until: '', is_active: true });
        onReload();
      } else {
        const data = await res.json();
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  const togglePromoActive = async (promoId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}?action=update_promotion&id=${promoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (res.ok) {
        toast({ title: 'Статус акции обновлён' });
        onReload();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Акции и скидки</h2>
        <Button onClick={() => setPromoModalOpen(true)}>
          <Icon name="Plus" className="mr-2" size={16} />
          Добавить акцию
        </Button>
      </div>

      <div className="grid gap-4">
        {promotions.map(promo => (
          <Card key={promo.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{promo.title}</h3>
                  <Badge variant={promo.is_active ? 'default' : 'secondary'}>
                    {promo.is_active ? 'Активна' : 'Неактивна'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{promo.description}</p>
                <div className="text-xs text-muted-foreground">
                  {promo.valid_until ? (
                    <span>Действует до: {new Date(promo.valid_until).toLocaleDateString('ru-RU')}</span>
                  ) : (
                    <span>Бессрочная акция</span>
                  )}
                </div>
              </div>
              <Button
                variant={promo.is_active ? 'outline' : 'default'}
                size="sm"
                onClick={() => togglePromoActive(promo.id, promo.is_active)}
              >
                {promo.is_active ? 'Деактивировать' : 'Активировать'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={promoModalOpen} onOpenChange={setPromoModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Новая акция</DialogTitle>
          </DialogHeader>
          <form onSubmit={createPromotion} className="space-y-4">
            <div>
              <Label>Название</Label>
              <Input
                required
                value={promoForm.title}
                onChange={e => setPromoForm({ ...promoForm, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea
                required
                value={promoForm.description}
                onChange={e => setPromoForm({ ...promoForm, description: e.target.value })}
              />
            </div>
            <div>
              <Label>Действует до (необязательно)</Label>
              <Input
                type="date"
                value={promoForm.valid_until}
                onChange={e => setPromoForm({ ...promoForm, valid_until: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="promo_is_active"
                checked={promoForm.is_active}
                onChange={e => setPromoForm({ ...promoForm, is_active: e.target.checked })}
              />
              <Label htmlFor="promo_is_active">Активировать сразу</Label>
            </div>
            <Button type="submit" className="w-full">Создать акцию</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
