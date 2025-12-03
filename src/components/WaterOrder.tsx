import { useState } from 'react';
import { User, Field, WaterApplication } from '../App';
import { 
  Droplet, 
  Calendar,
  FileText,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import Navigation from './Navigation';

interface WaterOrderProps {
  user: User;
  fields: Field[];
  applications: WaterApplication[];
  onUpdateApplications: (applications: WaterApplication[]) => void;
  onLogout: () => void;
}

export default function WaterOrder({ 
  user, 
  fields, 
  applications, 
  onUpdateApplications, 
  onLogout 
}: WaterOrderProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedFieldId, setSelectedFieldId] = useState('');
  const [requestedTime, setRequestedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedFieldId || !requestedTime) {
      setError('Iltimos barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    const field = fields.find(f => f.id === selectedFieldId);
    if (!field) {
      setError('Maydon topilmadi');
      return;
    }

    const newApplication: WaterApplication = {
      id: Date.now().toString(),
      fieldId: field.id,
      fieldName: field.name,
      waterAmount: field.waterNeed,
      requestedTime: requestedTime,
      notes: notes,
      status: 'submitted',
      createdAt: new Date().toISOString()
    };

    onUpdateApplications([...applications, newApplication]);
    
    // Reset form
    setSelectedFieldId('');
    setRequestedTime('');
    setNotes('');
    setShowForm(false);
  };

  const getStatusBadge = (status: WaterApplication['status']) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800">
            <Send className="w-4 h-4" />
            Yuborildi
          </span>
        );
      case 'reviewing':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
            <Clock className="w-4 h-4" />
            Ko'rib chiqilmoqda
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4" />
            Tasdiqlandi
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800">
            <XCircle className="w-4 h-4" />
            Rad etildi
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="water-order" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Suv Zayavkalari</h1>
            <p className="text-gray-600">Suv buyurtma qilish va zayavkalarni kuzatish</p>
          </div>
          
          {fields.length > 0 && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Droplet className="w-5 h-5" />
              {showForm ? 'Formani yopish' : 'Yangi zayavka'}
            </button>
          )}
        </div>

        {/* No Fields Warning */}
        {fields.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-yellow-900 mb-2">Maydonlar mavjud emas</h3>
                <p className="text-yellow-800 mb-4">
                  Suv buyurtma qilish uchun avval profil sahifasida maydonlaringizni qo'shing.
                </p>
                <a
                  href="/profile"
                  className="inline-flex items-center gap-2 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  Profil sahifasiga o'tish
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Application Form */}
          {showForm && fields.length > 0 && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h2 className="text-gray-900 mb-6">Yangi suv buyurtmasi</h2>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-red-800">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Field Selection */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Maydon <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedFieldId}
                      onChange={(e) => setSelectedFieldId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Maydonni tanlang</option>
                      {fields.map((field) => (
                        <option key={field.id} value={field.id}>
                          {field.name} - {field.size} ha ({field.cropType === 'cotton' ? 'Paxta' : 'Bug\'doy'})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Water Amount Display */}
                  {selectedField && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="text-blue-900 mb-3">Maydon ma'lumotlari</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-blue-700">Hajmi</p>
                          <p className="text-blue-900">{selectedField.size} gektar</p>
                        </div>
                        <div>
                          <p className="text-blue-700">Ekin turi</p>
                          <p className="text-blue-900">
                            {selectedField.cropType === 'cotton' ? 'Paxta' : 'Bug\'doy'}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">Standart suv ehtiyoji</p>
                          <p className="text-blue-900">
                            {selectedField.waterNeed.toLocaleString()} m³
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-700">Kanalga masofa</p>
                          <p className="text-blue-900">{selectedField.distanceToCanal} km</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-white rounded-lg">
                        <p className="text-gray-600">
                          Berilishi lozim bo'lgan suv miqdori:
                        </p>
                        <p className="text-blue-900">
                          {selectedField.waterNeed.toLocaleString()} m³
                          <span className="text-gray-600">
                            {' '}({selectedField.cropType === 'cotton' ? '1000' : '900'} m³/ha standart)
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Requested Time */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Suv beriladigan vaqt <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={requestedTime}
                      onChange={(e) => setRequestedTime(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      min={new Date().toISOString().slice(0, 16)}
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-gray-700 mb-2">
                      Izoh (ixtiyoriy)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={4}
                      placeholder="Qo'shimcha ma'lumotlar..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Zayavka yuborish
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Applications List */}
          <div className={showForm && fields.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-gray-900 mb-6">Zayavkalar tarixi</h2>

              {applications.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Zayavkalar mavjud emas</p>
                  <p>Yangi zayavka yaratish uchun yuqoridagi tugmani bosing</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.slice().reverse().map((app) => (
                    <div 
                      key={app.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-gray-900">{app.fieldName}</h3>
                          <p className="text-gray-600">
                            {new Date(app.createdAt).toLocaleDateString('uz-UZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-gray-700">
                          <span className="flex items-center gap-2">
                            <Droplet className="w-4 h-4 text-blue-500" />
                            Suv miqdori:
                          </span>
                          <span className="font-medium">{app.waterAmount.toLocaleString()} m³</span>
                        </div>

                        <div className="flex items-center justify-between text-gray-700">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            So'ralgan vaqt:
                          </span>
                          <span className="font-medium">
                            {new Date(app.requestedTime).toLocaleString('uz-UZ', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {app.notes && (
                          <div className="mt-2 pt-2 border-t border-gray-200">
                            <p className="text-gray-600">Izoh:</p>
                            <p className="text-gray-700">{app.notes}</p>
                          </div>
                        )}
                      </div>

                      {app.status === 'approved' && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <p className="text-green-800">
                            ✓ Zayavka tasdiqlandi va navbatga qo'shildi
                          </p>
                        </div>
                      )}

                      {app.status === 'rejected' && (
                        <div className="mt-3 p-3 bg-red-50 rounded-lg">
                          <p className="text-red-800">
                            ✗ Zayavka rad etildi
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3>Jami zayavkalar</h3>
              <FileText className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-white/90">{applications.length}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3>Tasdiqlangan</h3>
              <CheckCircle className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-white/90">
              {applications.filter(a => a.status === 'approved').length}
            </p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3>Kutilmoqda</h3>
              <Clock className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-white/90">
              {applications.filter(a => a.status === 'submitted' || a.status === 'reviewing').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
