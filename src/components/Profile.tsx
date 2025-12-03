import { useState } from 'react';
import { User, Field } from '../App';
import { 
  User as UserIcon, 
  MapPin, 
  Phone, 
  Mail, 
  Edit2, 
  Plus,
  Trash2,
  Save,
  X,
  Wheat,
  Sprout,
  Map,
  Droplet
} from 'lucide-react';
import Navigation from './Navigation';

interface ProfileProps {
  user: User;
  fields: Field[];
  onUpdateUser: (user: User) => void;
  onUpdateFields: (fields: Field[]) => void;
  onLogout: () => void;
}

export default function Profile({ user, fields, onUpdateUser, onUpdateFields, onLogout }: ProfileProps) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddField, setShowAddField] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  
  const [newField, setNewField] = useState({
    name: '',
    size: 0,
    cropType: 'cotton' as 'cotton' | 'wheat',
    distanceToCanal: 0
  });

  const handleSaveProfile = () => {
    onUpdateUser(editedUser);
    setIsEditingProfile(false);
  };

  const handleAddField = () => {
    if (!newField.name || newField.size <= 0 || newField.distanceToCanal <= 0) {
      alert('Iltimos barcha maydonlarni to\'ldiring');
      return;
    }

    const waterNeedPerHectare = newField.cropType === 'cotton' ? 1000 : 900;
    const field: Field = {
      id: Date.now().toString(),
      name: newField.name,
      size: newField.size,
      cropType: newField.cropType,
      distanceToCanal: newField.distanceToCanal,
      waterNeed: newField.size * waterNeedPerHectare
    };

    onUpdateFields([...fields, field]);
    setNewField({ name: '', size: 0, cropType: 'cotton', distanceToCanal: 0 });
    setShowAddField(false);
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Ushbu maydonni o\'chirmoqchimisiz?')) {
      onUpdateFields(fields.filter(f => f.id !== fieldId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} onLogout={onLogout} currentPage="profile" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-gray-900 mb-8">Profil sozlamalari</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-12 h-12 text-white" />
                </div>
                {!isEditingProfile ? (
                  <>
                    <h2 className="text-gray-900 mb-1">{user.fullName}</h2>
                    <p className="text-gray-600">{user.region}</p>
                  </>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedUser.fullName}
                      onChange={(e) => setEditedUser({ ...editedUser, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="To'liq ism"
                    />
                    <input
                      type="text"
                      value={editedUser.region}
                      onChange={(e) => setEditedUser({ ...editedUser, region: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Hudud"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-gray-400" />
                  {!isEditingProfile ? (
                    <span>{user.phone}</span>
                  ) : (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-gray-400" />
                  {!isEditingProfile ? (
                    <span>{user.email}</span>
                  ) : (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>

              {!isEditingProfile ? (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Tahrirlash
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Saqlash
                  </button>
                  <button
                    onClick={() => {
                      setEditedUser(user);
                      setIsEditingProfile(false);
                    }}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Bekor qilish
                  </button>
                </div>
              )}

              {/* 2FA Status */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-gray-900 mb-3">Xavfsizlik</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">2FA Tasdiqlash</span>
                  <span className={`px-3 py-1 rounded-full ${
                    user.verified2FA 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.verified2FA ? 'Faol' : 'Faol emas'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Fields Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Yer Maydonlari</h2>
                <button
                  onClick={() => setShowAddField(!showAddField)}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Maydon qo'shish
                </button>
              </div>

              {/* Add Field Form */}
              {showAddField && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-blue-900 mb-4">Yangi maydon qo'shish</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Maydon nomi</label>
                      <input
                        type="text"
                        value={newField.name}
                        onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Maydon 1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-2">Hajmi (gektar)</label>
                      <input
                        type="number"
                        value={newField.size || ''}
                        onChange={(e) => setNewField({ ...newField, size: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="15"
                        min="0"
                        step="0.1"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Ekin turi</label>
                      <select
                        value={newField.cropType}
                        onChange={(e) => setNewField({ ...newField, cropType: e.target.value as 'cotton' | 'wheat' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cotton">Paxta (1000 m³/ha)</option>
                        <option value="wheat">Bug'doy (900 m³/ha)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Kanalga masofa (km)</label>
                      <input
                        type="number"
                        value={newField.distanceToCanal || ''}
                        onChange={(e) => setNewField({ ...newField, distanceToCanal: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="2.5"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded-lg">
                    <p className="text-gray-700">
                      Umumiy suv ehtiyoji: <span className="font-semibold text-blue-600">
                        {(newField.size * (newField.cropType === 'cotton' ? 1000 : 900)).toLocaleString()} m³
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleAddField}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Qo'shish
                    </button>
                    <button
                      onClick={() => {
                        setShowAddField(false);
                        setNewField({ name: '', size: 0, cropType: 'cotton', distanceToCanal: 0 });
                      }}
                      className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </div>
              )}

              {/* Fields List */}
              <div className="space-y-4">
                {fields.map((field) => (
                  <div 
                    key={field.id}
                    className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          field.cropType === 'cotton' ? 'bg-green-100' : 'bg-yellow-100'
                        }`}>
                          {field.cropType === 'cotton' ? (
                            <Sprout className={`w-6 h-6 ${
                              field.cropType === 'cotton' ? 'text-green-600' : 'text-yellow-600'
                            }`} />
                          ) : (
                            <Wheat className="w-6 h-6 text-yellow-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-gray-900">{field.name}</h3>
                          <p className="text-gray-600">
                            {field.cropType === 'cotton' ? 'Paxta' : 'Bug\'doy'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteField(field.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Map className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Hajmi</p>
                          <p className="text-gray-900">{field.size} ha</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Masofa</p>
                          <p className="text-gray-900">{field.distanceToCanal} km</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Droplet className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">Suv ehtiyoji</p>
                          <p className="text-gray-900">{field.waterNeed.toLocaleString()} m³</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {fields.length === 0 && !showAddField && (
                  <div className="text-center py-12 text-gray-500">
                    <Map className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Maydonlar mavjud emas</p>
                    <p>Yangi maydon qo'shish uchun yuqoridagi tugmani bosing</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
