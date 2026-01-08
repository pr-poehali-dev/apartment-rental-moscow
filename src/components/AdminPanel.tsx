import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OwnersTab from '@/components/admin/OwnersTab';
import ObjectsTab from '@/components/admin/ObjectsTab';
import PromotionsTab from '@/components/admin/PromotionsTab';

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

interface ObjectItem {
  id: number;
  owner_id: number;
  category: string;
  name: string;
  address: string;
  metro: string;
  area: number;
  rooms: number;
  price_per_hour: number;
  min_hours: number;
  lat: number;
  lon: number;
  image_url: string;
  telegram_contact: string;
  is_published: boolean;
  created_at: string;
  owner_name: string;
  views: number;
  clicks: number;
}

interface Promotion {
  id: number;
  title: string;
  description: string;
  valid_from: string;
  valid_until: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('owners');
  const [owners, setOwners] = useState<Owner[]>([]);
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    loadOwners();
    loadObjects();
    loadPromotions();
  }, []);

  const loadOwners = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_owners`);
      const data = await res.json();
      setOwners(data.owners || []);
    } catch (err) {
      console.error('Error loading owners:', err);
    }
  };

  const loadObjects = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_objects`);
      const data = await res.json();
      setObjects(data.objects || []);
    } catch (err) {
      console.error('Error loading objects:', err);
    }
  };

  const loadPromotions = async () => {
    try {
      const res = await fetch(`${API_BASE}?action=get_promotions`);
      const data = await res.json();
      setPromotions(data.promotions || []);
    } catch (err) {
      console.error('Error loading promotions:', err);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Панель администратора</h1>
          <p className="text-muted-foreground mt-1">Управление платформой 120 минут</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="owners">Собственники</TabsTrigger>
            <TabsTrigger value="objects">Объекты</TabsTrigger>
            <TabsTrigger value="promotions">Акции</TabsTrigger>
          </TabsList>

          <TabsContent value="owners" className="mt-6">
            <OwnersTab owners={owners} onReload={loadOwners} />
          </TabsContent>

          <TabsContent value="objects" className="mt-6">
            <ObjectsTab objects={objects} owners={owners} onReload={loadObjects} />
          </TabsContent>

          <TabsContent value="promotions" className="mt-6">
            <PromotionsTab promotions={promotions} onReload={loadPromotions} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
