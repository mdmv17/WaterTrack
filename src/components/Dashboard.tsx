import { Link } from 'react-router-dom';
import { User, Field, WaterApplication } from '../App';
import { 
  Droplet, 
  User as UserIcon, 
  LogOut, 
  LayoutGrid, 
  Clock, 
  Waves,
  TrendingUp,
  Calendar,
  Settings
} from 'lucide-react';
import Navigation from './Navigation';

interface DashboardProps {
  user: User;
  fields: Field[];
  applications: WaterApplication[];
  onLogout: () => void;
}

export default function Dashboard({ user, fields, applications, onLogout }: DashboardProps) {
  // Calculate statistics
  const approvedApplications = applications.filter(app => app.status === 'approved');
  const pendingApplications = applications.filter(app => app.status === 'submitted' || app.status === 'reviewing');
  
  // Mock irrigation history
  const recentIrrigations = [
    { id: 1, fieldName: 'Maydon 1', date: '2025-11-25', amount: 15000, status: 'completed' },
    { id: 2, fieldName: 'Maydon 2', date: '2025-11-20', amount: 9000, status: 'completed' },
    { id: 3, fieldName: 'Maydon 3', date: '2025-11-15', amount: 12000, status: 'completed' },
  ];

  // Mock queue position
  const queuePosition = 3;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="dashboard" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">
            Xush kelibsiz, {user.fullName}!
          </h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('uz-UZ', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-gray-900 mb-1">{fields.length}</h3>
            <p className="text-gray-600">Mening maydonlarim</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">
              Navbatda {queuePosition}-o'rinda
            </h3>
            <p className="text-gray-600">Joriy navbat holati</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Waves className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">{pendingApplications.length}</h3>
            <p className="text-gray-600">Kutilayotgan zayavkalar</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <h3 className="text-gray-900 mb-1">{recentIrrigations.length}</h3>
            <p className="text-gray-600">So'nggi sug'orishlar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Irrigations */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-gray-900 mb-6">Oxirgi sug'orishlar tarixi</h2>
            
            <div className="space-y-4">
              {recentIrrigations.map((irrigation) => (
                <div 
                  key={irrigation.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Droplet className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-gray-900">{irrigation.fieldName}</h3>
                      <p className="text-gray-600">
                        {new Date(irrigation.date).toLocaleDateString('uz-UZ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">{irrigation.amount.toLocaleString()} m³</p>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800">
                      Yakunlangan
                    </span>
                  </div>
                </div>
              ))}

              {recentIrrigations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Sug'orish tarixi mavjud emas
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-gray-900 mb-6">Tezkor harakatlar</h2>
            
            <div className="space-y-3">
              <Link
                to="/water-order"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                <Droplet className="w-5 h-5 inline-block mr-2" />
                Suv buyurtma qilish
              </Link>

              <Link
                to="/water-distribution"
                className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                <Waves className="w-5 h-5 inline-block mr-2" />
                Monitoring
              </Link>

              <Link
                to="/profile"
                className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors text-center"
              >
                <Settings className="w-5 h-5 inline-block mr-2" />
                Profil sozlamalari
              </Link>
            </div>

            {/* Queue Status */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-blue-900 mb-2">Navbat holati</h3>
              <p className="text-blue-700">
                Siz hozir <span className="font-semibold">{queuePosition}-o'rinda</span> turibsiz
              </p>
              <div className="mt-3 bg-white rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(10 - queuePosition) * 10}%` }}
                ></div>
              </div>
            </div>

            {/* User Info */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  <UserIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900">{user.fullName}</h3>
                  <p className="text-gray-600">{user.region}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
