import { useState } from 'react';
import AdminLogin from '@/components/admin/AdminLogin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import type { User } from '@/types/admin';

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    return <AdminLogin onLogin={setUser} />;
  }

  return <AdminDashboard user={user} onLogout={() => setUser(null)} />;
}
