import { useState, useEffect } from 'react';
import { User, Field } from '../App';
import { 
  Droplet, 
  Play,
  Pause,
  Power,
  Activity,
  Gauge,
  Timer,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Waves
} from 'lucide-react';
import Navigation from './Navigation';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WaterDistributionProps {
  user: User;
  fields: Field[];
  onLogout: () => void;
}

interface SensorData {
  waterLevel: number;
  flowRate: number;
  canalVolume: number;
  currentField: string;
  sensorActive: boolean;
  electricityStatus: boolean;
  waterPressure: number;
}

interface QueueItem {
  position: number;
  farmerName: string;
  fieldName: string;
  waterNeed: number;
  status: 'irrigating' | 'preparing' | 'waiting';
  estimatedTime?: number;
}

export default function WaterDistribution({ user, fields, onLogout }: WaterDistributionProps) {
  const [controlMode, setControlMode] = useState<'auto' | 'manual'>('auto');
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData>({
    waterLevel: 75,
    flowRate: 120,
    canalVolume: 5000,
    currentField: 'Maydon 1',
    sensorActive: true,
    electricityStatus: true,
    waterPressure: 3.5
  });

  const [deliveredWater, setDeliveredWater] = useState(0);
  const [remainingWater, setRemainingWater] = useState(15000);
  const [chartData, setChartData] = useState([
    { time: '00:00', flow: 0 },
    { time: '00:05', flow: 0 },
    { time: '00:10', flow: 0 },
    { time: '00:15', flow: 0 },
    { time: '00:20', flow: 0 },
  ]);

  const [queue, setQueue] = useState<QueueItem[]>([
    { position: 1, farmerName: 'Alisher Karimov', fieldName: 'Maydon 1', waterNeed: 15000, status: 'irrigating', estimatedTime: 125 },
    { position: 2, farmerName: 'Bobur Rahimov', fieldName: 'Maydon 2', waterNeed: 12000, status: 'preparing', estimatedTime: 100 },
    { position: 3, farmerName: 'Dilshod Tursunov', fieldName: 'Maydon 3', waterNeed: 18000, status: 'waiting', estimatedTime: 150 },
    { position: 4, farmerName: 'Ergash Saidov', fieldName: 'Maydon 4', waterNeed: 9000, status: 'waiting', estimatedTime: 75 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    if (!isIrrigating) return;

    const interval = setInterval(() => {
      // Update sensor data
      setSensorData(prev => ({
        ...prev,
        waterLevel: Math.max(0, prev.waterLevel + (Math.random() - 0.5) * 5),
        flowRate: Math.max(0, prev.flowRate + (Math.random() - 0.5) * 10),
        waterPressure: Math.max(0, prev.waterPressure + (Math.random() - 0.5) * 0.2)
      }));

      // Update delivered water
      setDeliveredWater(prev => {
        const newDelivered = prev + 120; // 120 m³ per second
        return Math.min(15000, newDelivered);
      });

      // Update remaining water
      setRemainingWater(prev => Math.max(0, prev - 120));

      // Update chart
      setChartData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
          flow: sensorData.flowRate
        }];
        return newData;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isIrrigating, sensorData.flowRate]);

  const estimatedTime = remainingWater / sensorData.flowRate;

  const handleStart = () => {
    setIsIrrigating(true);
  };

  const handleStop = () => {
    setIsIrrigating(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="water-distribution" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Suv Taqsimoti Monitoring</h1>
            <p className="text-gray-600">Real-time suv taqsimoti kuzatuvi</p>
          </div>
          
          {/* Control Mode Toggle */}
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Boshqaruv rejimi:</span>
            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setControlMode('auto')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  controlMode === 'auto' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Avtomatik
              </button>
              <button
                onClick={() => setControlMode('manual')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  controlMode === 'manual' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Qo'lda
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Control Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Water Distribution Panel */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-gray-900 mb-6">Suv Taqsimoti Paneli</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-600">Kerakli suv</span>
                  </div>
                  <p className="text-blue-900">15,000 m³</p>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Vaqt</span>
                  </div>
                  <p className="text-green-900">{Math.round(estimatedTime)} min</p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-600" />
                    <span className="text-purple-600">Oqim tezligi</span>
                  </div>
                  <p className="text-purple-900">{sensorData.flowRate.toFixed(1)} L/s</p>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    <span className="text-orange-600">Berilgan</span>
                  </div>
                  <p className="text-orange-900">{deliveredWater.toLocaleString()} m³</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Sug'orish jarayoni</span>
                  <span className="text-gray-900">
                    {((deliveredWater / 15000) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${(deliveredWater / 15000) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-4">
                {!isIrrigating ? (
                  <button
                    onClick={handleStart}
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Suv berishni boshlash
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    To'xtatish
                  </button>
                )}
              </div>

              {isIrrigating && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                  <span className="text-green-800">Suv berish jarayoni davom etmoqda...</span>
                </div>
              )}
            </div>

            {/* Canal Sensor Status */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Kanal Datchik Holati</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-600">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Suv darajasi</span>
                    <Waves className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-gray-900">{sensorData.waterLevel.toFixed(1)}%</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Suv oqimi</span>
                    <Activity className="w-5 h-5 text-purple-500" />
                  </div>
                  <p className="text-gray-900">{sensorData.flowRate.toFixed(1)} L/s</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Kanal hajmi</span>
                    <Droplet className="w-5 h-5 text-blue-500" />
                  </div>
                  <p className="text-gray-900">{sensorData.canalVolume.toLocaleString()} m³</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Hozirgi maydon</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="text-gray-900">{sensorData.currentField}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Sensor</span>
                    <Power className={`w-5 h-5 ${sensorData.sensorActive ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <p className="text-gray-900">{sensorData.sensorActive ? 'Faol' : 'O\'chiq'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Elektr</span>
                    <Zap className={`w-5 h-5 ${sensorData.electricityStatus ? 'text-yellow-500' : 'text-gray-400'}`} />
                  </div>
                  <p className="text-gray-900">{sensorData.electricityStatus ? 'Yoqilgan' : 'O\'chiq'}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Suv bosimi</span>
                    <Gauge className="w-5 h-5 text-orange-500" />
                  </div>
                  <p className="text-gray-900">{sensorData.waterPressure.toFixed(2)} bar</p>
                </div>
              </div>
            </div>

            {/* Monitoring Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-gray-900 mb-6">Real-time Monitoring</h2>
              
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="flow" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Queue Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-gray-900 mb-6">AI Sug'orish Navbati</h2>

              <div className="space-y-3">
                {queue.map((item) => (
                  <div 
                    key={item.position}
                    className={`p-4 rounded-lg border-2 ${
                      item.status === 'irrigating' 
                        ? 'bg-green-50 border-green-300' 
                        : item.status === 'preparing'
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.status === 'irrigating' 
                            ? 'bg-green-500 text-white' 
                            : item.status === 'preparing'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {item.position}
                        </div>
                        <div>
                          <p className="text-gray-900">{item.farmerName}</p>
                          <p className="text-gray-600">{item.fieldName}</p>
                        </div>
                      </div>
                      
                      {item.status === 'irrigating' && (
                        <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                      )}
                    </div>

                    <div className="mt-2 space-y-1 text-gray-700">
                      <p className="flex items-center justify-between">
                        <span>Suv:</span>
                        <span>{item.waterNeed.toLocaleString()} m³</span>
                      </p>
                      {item.estimatedTime && (
                        <p className="flex items-center justify-between">
                          <span>Vaqt:</span>
                          <span>{item.estimatedTime} min</span>
                        </p>
                      )}
                    </div>

                    {item.status === 'irrigating' && (
                      <div className="mt-2 text-green-700">
                        ✓ Sug'orilmoqda
                      </div>
                    )}
                    {item.status === 'preparing' && (
                      <div className="mt-2 text-yellow-700">
                        ⚠ Tayyorlanish kerak
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Recommendations */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-blue-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  AI Tavsiyasi
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li>• Fermer 2 tayyorlansin</li>
                  <li>• Fermer 3 kutishda davom eting</li>
                  <li>• Optimal oqim tezligi: 120 L/s</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
