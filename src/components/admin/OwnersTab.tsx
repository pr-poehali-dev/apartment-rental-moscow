import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

const API_BASE = 'https://functions.poehali.dev/49330ab6-db2f-4738-aaac-313eb821f419';

interface Owner {
  id: number;
  username: string;
  full_name: string;
  phone: string;
  telegram: string;
  is_active: boolean;
  created_at: string;
  objects_count: number;
}

interface OwnersTabProps {
  owners: Owner[];
  onReload: () => void;
}

export default function OwnersTab({ owners, onReload }: OwnersTabProps) {
  const { toast } = useToast();
  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [ownerForm, setOwnerForm] = useState({
    username: '',
    password: '',
    full_name: '',
    phone: '',
    telegram: ''
  });

  const createOwner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}?action=create_owner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ownerForm)
      });
      
      if (res.ok) {
        toast({ title: 'Собственник создан' });
        setOwnerModalOpen(false);
        setOwnerForm({ username: '', password: '', full_name: '', phone: '', telegram: '' });
        onReload();
      } else {
        const data = await res.json();
        toast({ title: 'Ошибка', description: data.error, variant: 'destructive' });
      }
    } catch (err) {
      toast({ title: 'Ошибка сети', variant: 'destructive' });
    }
  };

  const toggleOwnerActive = async (ownerId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`${API_BASE}?action=update_owner&id=${ownerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus })
      });
      
      if (res.ok) {
        toast({ title: 'Статус обновлён' });
        onReload();
      }
    } catch (err) {
      toast({ title: 'Ошибка', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Собственники</h2>
        <Button onClick={() => setOwnerModalOpen(true)}>
          <Icon name="Plus" className="mr-2" size={16} />
          Добавить собственника
        </Button>
      </div>

      <div className="grid gap-4">
        {owners.map(owner => (
          <Card key={owner.id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{owner.full_name}</h3>
                  <Badge variant={owner.is_active ? 'default' : 'secondary'}>
                    {owner.is_active ? 'Активен' : 'Неактивен'}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon name="Mail" size={14} />
                    <span>{owner.username}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Phone" size={14} />
                    <span>{owner.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="MessageCircle" size={14} />
                    <span>{owner.telegram}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Building" size={14} />
                    <span>Объектов: {owner.objects_count}</span>
                  </div>
                </div>
              </div>
              <Button
                variant={owner.is_active ? 'outline' : 'default'}
                size="sm"
                onClick={() => toggleOwnerActive(owner.id, owner.is_active)}
              >
                {owner.is_active ? 'Деактивировать' : 'Активировать'}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={ownerModalOpen} onOpenChange={setOwnerModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Новый собственник</DialogTitle>
          </DialogHeader>
          <form onSubmit={createOwner} className="space-y-4">
            <div>
              <Label>Email (логин)</Label>
              <Input
                type="email"
                required
                value={ownerForm.username}
                onChange={e => setOwnerForm({ ...ownerForm, username: e.target.value })}
              />
            </div>
            <div>
              <Label>Пароль</Label>
              <Input
                type="password"
                required
                value={ownerForm.password}
                onChange={e => setOwnerForm({ ...ownerForm, password: e.target.value })}
              />
            </div>
            <div>
              <Label>ФИО</Label>
              <Input
                required
                value={ownerForm.full_name}
                onChange={e => setOwnerForm({ ...ownerForm, full_name: e.target.value })}
              />
            </div>
            <div>
              <Label>Телефон</Label>
              <Input
                type="tel"
                required
                value={ownerForm.phone}
                onChange={e => setOwnerForm({ ...ownerForm, phone: e.target.value })}
              />
            </div>
            <div>
              <Label>Telegram</Label>
              <Input
                required
                placeholder="@username"
                value={ownerForm.telegram}
                onChange={e => setOwnerForm({ ...ownerForm, telegram: e.target.value })}
              />
            </div>
            <Button type="submit" className="w-full">Создать</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
