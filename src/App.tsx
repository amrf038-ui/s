import React, { useState, useEffect } from 'react';
import { Car, MaintenanceItem, MaintenanceLog, TabType } from './types';
import { initialCars, initialMaintenanceItems, initialLogs } from './mockData';
import { calculateMaintenanceStatus, getCarOverallStatus } from './utils';

import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { CarsView } from './components/CarsView';
import { ScheduleView } from './components/ScheduleView';
import { AlertsView } from './components/AlertsView';
import { HistoryView } from './components/HistoryView';
import { SearchView } from './components/SearchView';
import { AddEditCarModal, RecordMaintenanceModal, UpdateOdometerModal } from './components/Modals';

export default function App() {
  // State initialization with LocalStorage persistence
  const [cars, setCars] = useState<Car[]>(() => {
    const saved = localStorage.getItem('fleet_cars');
    return saved ? JSON.parse(saved) : initialCars;
  });

  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>(() => {
    const saved = localStorage.getItem('fleet_maintenance_items');
    return saved ? JSON.parse(saved) : initialMaintenanceItems;
  });

  const [logs, setLogs] = useState<MaintenanceLog[]>(() => {
    const saved = localStorage.getItem('fleet_logs');
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');

  // Modals state
  const [isAddCarOpen, setIsAddCarOpen] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  
  const [isRecordMaintenanceOpen, setIsRecordMaintenanceOpen] = useState(false);
  const [preselectedCarId, setPreselectedCarId] = useState<string | null>(null);

  const [isUpdateOdometerOpen, setIsUpdateOdometerOpen] = useState(false);
  const [carToUpdateOdometer, setCarToUpdateOdometer] = useState<Car | null>(null);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('fleet_cars', JSON.stringify(cars));
  }, [cars]);

  useEffect(() => {
    localStorage.setItem('fleet_maintenance_items', JSON.stringify(maintenanceItems));
  }, [maintenanceItems]);

  useEffect(() => {
    localStorage.setItem('fleet_logs', JSON.stringify(logs));
  }, [logs]);

  // Recalculate statuses whenever cars or maintenance items change
  useEffect(() => {
    // Update maintenance items status based on car current odometer
    const updatedItems = maintenanceItems.map(item => {
      const car = cars.find(c => c.id === item.carId);
      if (!car) return item;
      const newStatus = calculateMaintenanceStatus(car.currentOdometer, item.nextOdometer);
      return { ...item, status: newStatus };
    });

    if (JSON.stringify(updatedItems) !== JSON.stringify(maintenanceItems)) {
      setMaintenanceItems(updatedItems);
    }

    // Update cars overall status
    const updatedCars = cars.map(car => {
      const overall = getCarOverallStatus(car.id, maintenanceItems, car.status);
      if (overall !== car.status) {
        return { ...car, status: overall as any };
      }
      return car;
    });

    if (JSON.stringify(updatedCars) !== JSON.stringify(cars)) {
      setCars(updatedCars);
    }
  }, [cars.map(c => c.currentOdometer).join(',')]);

  // Reset to default data
  const handleResetData = () => {
    if (window.confirm('هل أنت متأكد من إعادة ضبط البيانات إلى الحالة الافتراضية؟')) {
      setCars(initialCars);
      setMaintenanceItems(initialMaintenanceItems);
      setLogs(initialLogs);
      localStorage.clear();
    }
  };

  // Car actions
  const handleSaveCar = (carData: Omit<Car, 'id' | 'status'> & { id?: string }) => {
    if (carData.id) {
      // Edit
      setCars(prev => prev.map(c => c.id === carData.id ? { ...c, ...carData } as Car : c));
    } else {
      // Add new
      const newCar: Car = {
        id: `car-${Date.now()}`,
        ...carData,
        status: 'good'
      };
      setCars(prev => [newCar, ...prev]);

      // Add default maintenance items for the new car
      const defaultItems: MaintenanceItem[] = [
        {
          id: `m-${Date.now()}-1`,
          carId: newCar.id,
          name: 'تغيير الزيت',
          lastDate: new Date().toISOString().split('T')[0],
          lastOdometer: newCar.currentOdometer,
          intervalKm: 10000,
          intervalMonths: 6,
          nextOdometer: newCar.currentOdometer + 10000,
          nextDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
          status: 'healthy'
        },
        {
          id: `m-${Date.now()}-2`,
          carId: newCar.id,
          name: 'تيل الفرامل',
          lastDate: new Date().toISOString().split('T')[0],
          lastOdometer: newCar.currentOdometer,
          intervalKm: 30000,
          intervalMonths: 12,
          nextOdometer: newCar.currentOdometer + 30000,
          nextDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          status: 'healthy'
        }
      ];
      setMaintenanceItems(prev => [...prev, ...defaultItems]);
    }
    setCarToEdit(null);
  };

  const handleDeleteCar = (carId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذه السيارة وجميع بنود وسجلات الصيانة الخاصة بها؟')) {
      setCars(prev => prev.filter(c => c.id !== carId));
      setMaintenanceItems(prev => prev.filter(i => i.carId !== carId));
      setLogs(prev => prev.filter(l => l.carId !== carId));
    }
  };

  const handleUpdateOdometer = (carId: string, newOdometer: number) => {
    setCars(prev => prev.map(c => c.id === carId ? { ...c, currentOdometer: newOdometer } : c));
  };

  // Maintenance log action
  const handleSaveLog = (logData: Omit<MaintenanceLog, 'id'>, updatedOdometer: number, maintenanceItemId?: string) => {
    const newLog: MaintenanceLog = {
      id: `log-${Date.now()}`,
      ...logData
    };
    setLogs(prev => [newLog, ...prev]);

    // Update car odometer if needed
    setCars(prev => prev.map(c => c.id === logData.carId ? { ...c, currentOdometer: updatedOdometer } : c));

    // If matching maintenance item exists, update its last date, last odometer, and next odometer
    if (maintenanceItemId) {
      setMaintenanceItems(prev => prev.map(item => {
        if (item.id === maintenanceItemId) {
          const nextOd = updatedOdometer + item.intervalKm;
          return {
            ...item,
            lastDate: logData.date,
            lastOdometer: updatedOdometer,
            nextOdometer: nextOd,
            status: calculateMaintenanceStatus(updatedOdometer, nextOd)
          };
        }
        return item;
      }));
    } else {
      // Check if item exists by name for this car
      const existingItem = maintenanceItems.find(i => i.carId === logData.carId && i.name === logData.itemsDescription);
      if (existingItem) {
        const nextOd = updatedOdometer + existingItem.intervalKm;
        setMaintenanceItems(prev => prev.map(item => item.id === existingItem.id ? {
          ...item,
          lastDate: logData.date,
          lastOdometer: updatedOdometer,
          nextOdometer: nextOd,
          status: calculateMaintenanceStatus(updatedOdometer, nextOd)
        } : item));
      } else {
        // Create new maintenance schedule item
        const newItem: MaintenanceItem = {
          id: `m-${Date.now()}`,
          carId: logData.carId,
          name: logData.itemsDescription,
          lastDate: logData.date,
          lastOdometer: updatedOdometer,
          intervalKm: 10000,
          intervalMonths: 6,
          nextOdometer: updatedOdometer + 10000,
          nextDate: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
          status: 'healthy'
        };
        setMaintenanceItems(prev => [...prev, newItem]);
      }
    }
  };

  const handleDeleteLog = (logId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      setLogs(prev => prev.filter(l => l.id !== logId));
    }
  };

  // Maintenance item actions
  const handleDeleteMaintenanceItem = (itemId: string) => {
    if (window.confirm('هل أنت متأكد من حذف بند الصيانة هذا؟')) {
      setMaintenanceItems(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const upcomingCount = maintenanceItems.filter(i => i.status === 'upcoming').length;
  const overdueCount = maintenanceItems.filter(i => i.status === 'overdue').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddCar={() => { setCarToEdit(null); setIsAddCarOpen(true); }}
        onOpenRecordMaintenance={() => { setPreselectedCarId(null); setIsRecordMaintenanceOpen(true); }}
        onResetData={handleResetData}
        upcomingCount={upcomingCount}
        overdueCount={overdueCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            cars={cars}
            maintenanceItems={maintenanceItems}
            onNavigate={setCurrentTab}
            onSelectCar={(carId) => {
              setCurrentTab('cars');
            }}
            onOpenRecordMaintenance={() => setIsRecordMaintenanceOpen(true)}
          />
        )}

        {currentTab === 'cars' && (
          <CarsView
            cars={cars}
            maintenanceItems={maintenanceItems}
            onOpenAddCar={() => { setCarToEdit(null); setIsAddCarOpen(true); }}
            onEditCar={(car) => { setCarToEdit(car); setIsAddCarOpen(true); }}
            onDeleteCar={handleDeleteCar}
            onUpdateOdometer={(car) => { setCarToUpdateOdometer(car); setIsUpdateOdometerOpen(true); }}
            onSelectCarDetails={(carId) => setCurrentTab('schedule')}
            onOpenRecordMaintenanceForCar={(carId) => { setPreselectedCarId(carId); setIsRecordMaintenanceOpen(true); }}
          />
        )}

        {currentTab === 'schedule' && (
          <ScheduleView
            cars={cars}
            maintenanceItems={maintenanceItems}
            onOpenRecordMaintenance={() => setIsRecordMaintenanceOpen(true)}
            onOpenAddMaintenanceItem={() => {
              alert('يمكنك إضافة بند صيانة جديد عبر تسجيل صيانة أولية وسيتم إضافته تلقائياً للجدول.');
              setIsRecordMaintenanceOpen(true);
            }}
            onEditMaintenanceItem={(item) => {}}
            onDeleteMaintenanceItem={handleDeleteMaintenanceItem}
          />
        )}

        {currentTab === 'alerts' && (
          <AlertsView
            cars={cars}
            maintenanceItems={maintenanceItems}
            onOpenRecordMaintenance={() => setIsRecordMaintenanceOpen(true)}
            onSelectCar={(carId) => setCurrentTab('cars')}
          />
        )}

        {currentTab === 'history' && (
          <HistoryView
            logs={logs}
            cars={cars}
            onDeleteLog={handleDeleteLog}
          />
        )}

        {currentTab === 'search' && (
          <SearchView
            cars={cars}
            maintenanceItems={maintenanceItems}
            onSelectCar={(carId) => setCurrentTab('cars')}
            onOpenRecordMaintenance={() => setIsRecordMaintenanceOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} نظام إدارة وصيانة الأسطول. جميع الحقوق محفوظة.</p>
      </footer>

      {/* Modals */}
      <AddEditCarModal
        isOpen={isAddCarOpen}
        onClose={() => setIsAddCarOpen(false)}
        onSave={handleSaveCar}
        carToEdit={carToEdit}
      />

      <RecordMaintenanceModal
        isOpen={isRecordMaintenanceOpen}
        onClose={() => setIsRecordMaintenanceOpen(false)}
        cars={cars}
        maintenanceItems={maintenanceItems}
        onSaveLog={handleSaveLog}
        preselectedCarId={preselectedCarId}
      />

      <UpdateOdometerModal
        isOpen={isUpdateOdometerOpen}
        onClose={() => { setIsUpdateOdometerOpen(false); setCarToUpdateOdometer(null); }}
        car={carToUpdateOdometer}
        onSaveOdometer={handleUpdateOdometer}
      />

    </div>
  );
}
