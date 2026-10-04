import { MaintenanceItem } from './types';

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function calculateMaintenanceStatus(
  currentOdometer: number,
  nextOdometer: number
): 'healthy' | 'upcoming' | 'overdue' {
  const diff = nextOdometer - currentOdometer;
  if (diff < 0) {
    return 'overdue'; // متأخرة
  } else if (diff <= 1500) {
    return 'upcoming'; // قريبة (أقل من 1500 كم)
  }
  return 'healthy'; // سليم
}

export function getStatusBadge(status: 'healthy' | 'upcoming' | 'overdue' | 'maintenance' | 'good') {
  switch (status) {
    case 'healthy':
    case 'good':
      return {
        label: 'سليم',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        dotColor: 'bg-emerald-500',
        iconColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-100 text-emerald-800'
      };
    case 'upcoming':
      return {
        label: 'صيانة قريبة',
        color: 'bg-amber-50 text-amber-700 border-amber-200',
        dotColor: 'bg-amber-500',
        iconColor: 'text-amber-600',
        badgeBg: 'bg-amber-100 text-amber-800'
      };
    case 'overdue':
      return {
        label: 'صيانة متأخرة',
        color: 'bg-rose-50 text-rose-700 border-rose-200',
        dotColor: 'bg-rose-500',
        iconColor: 'text-rose-600',
        badgeBg: 'bg-rose-100 text-rose-800'
      };
    case 'maintenance':
      return {
        label: 'تحت الصيانة',
        color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        dotColor: 'bg-indigo-500',
        iconColor: 'text-indigo-600',
        badgeBg: 'bg-indigo-100 text-indigo-800'
      };
    default:
      return {
        label: 'غير محدد',
        color: 'bg-slate-50 text-slate-700 border-slate-200',
        dotColor: 'bg-slate-400',
        iconColor: 'text-slate-500',
        badgeBg: 'bg-slate-100 text-slate-800'
      };
  }
}

export function getCarOverallStatus(carId: string, maintenanceItems: MaintenanceItem[], currentStatus: string) {
  if (currentStatus === 'maintenance') return 'maintenance';
  
  const items = maintenanceItems.filter(i => i.carId === carId);
  if (items.some(i => i.status === 'overdue')) return 'overdue';
  if (items.some(i => i.status === 'upcoming')) return 'upcoming';
  return 'good';
}
