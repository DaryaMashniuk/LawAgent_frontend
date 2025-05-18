import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { getFavorites, updateUserProfile, getUserProfile } from "../service/UserService";
import { parseDocumentDetails } from "../utils/documentParser";
import { DOCUMENT_CATEGORIES } from "../utils/Constants";

const ProfilePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    subscription: "",
    createdAt: "",
  });
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [profileResponse, favoritesResponse] = await Promise.all([
          getUserProfile(),
          getFavorites()
        ]);

        setUserData({
          username: profileResponse.data.username,
          email: profileResponse.data.email,
          subscription: profileResponse.data.subscription,
          createdAt: profileResponse.data.createdAt,
        });

        setFavorites(favoritesResponse.data || []);
      } catch (error) {
        toast.error("Ошибка загрузки данных профиля");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const response = await updateUserProfile({
        username: userData.username,
        email: userData.email,
        subscription: userData.subscription,
      });

      setUser(prev => ({
        ...prev,
        ...userData
      }));

      toast.success("Профиль успешно обновлен");
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Не удалось обновить профиль");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Не указана";
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Назад
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Мой профиль</h1>
        <div className="w-24"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-8">
          {/* Карточка профиля */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Личные данные</h2>
                  <p className="text-gray-500">Основная информация о вашем аккаунте</p>
                </div>
                {editing ? (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Сохранить
                    </button>
                    <button 
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Редактировать
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя пользователя</label>
                  {editing ? (
                    <input
                      type="text"
                      name="username"
                      value={userData.username}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{userData.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">{userData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Подписка</label>
                  {editing ? (
                    <select
                      name="subscription"
                      value={userData.subscription}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                      <option value="">Выберите категорию</option>
                      {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                        <option key={key} value={key} className="text-gray-800">
                          {value}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-800">
                      {DOCUMENT_CATEGORIES[userData.subscription] || "Не выбрана"}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Избранные документы */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">Избранные документы</h2>
                  <p className="text-gray-500">Сохраненные вами правовые акты</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {favorites.length}
                </span>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Нет избранных документов</h3>
                  <p className="mt-1 text-gray-500 mb-4">Сохраняйте важные документы для быстрого доступа</p>
                  <Link 
                    to="/search" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Найти документы
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((document) => {
                    const { number, date } = parseDocumentDetails(document.details);

                    return (
                      <div key={document.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900">
                              <Link
                                to={`/documents/${document.mainDocumentId || document.id}`}
                                className="hover:text-blue-600 hover:underline"
                              >
                                {document.title || "Без названия"}
                              </Link>
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Версия №{number} • {date}
                            </p>
                          </div>
                          {document.sourceUrl && (
                            <button
                              onClick={() => window.open(document.sourceUrl, "_blank")}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                              title="Открыть источник"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden h-fit">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Статистика</h2>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Избранных документов</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {favorites.length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(favorites.length * 10, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Последняя активность</span>
                  <span className="text-xs text-gray-500">{formatDate(userData.createdAt)}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-1 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Активен
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Категории документов</h3>
                <div className="space-y-2">
                  {Object.entries(DOCUMENT_CATEGORIES).map(([key, value]) => (
                    <div key={key} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        userData.subscription === key ? 'bg-blue-500' : 'bg-gray-300'
                      }`}></div>
                      <span className={`text-sm ${
                        userData.subscription === key ? 'text-blue-600 font-medium' : 'text-gray-600'
                      }`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;