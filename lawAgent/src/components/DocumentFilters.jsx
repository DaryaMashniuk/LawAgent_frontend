import { useEffect, useState } from "react";
import axios from "axios";
import { documentFiltersConfig, documentSortsConfig } from "../utils/DocumentFiltersConfig";
import { DOCUMENT_CATEGORIES } from "../utils/Constants";
import { useCallback } from "react";
import { debounce } from "../utils/Debounce";
import { buildDocumentFiltersState } from "../utils/DocumentFiltersConfig";
import { findDocuments } from "../service/UserService";
import { useAuth } from "../context/AuthContext";
const DocumentFilters = ({ onDocumentsLoaded }) => {
  const [filters, setFilters] = useState(() => buildDocumentFiltersState());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const {token} = useAuth();
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      
      // Формируем параметры без квадратных скобок
      const params = new URLSearchParams({
        page: filters.page - 1,
        size: filters.size,
        query: filters.query,
        ...(filters.categories.length > 0 && { 
          categories: filters.categories.join(',') 
        }),
        sort: documentSortsConfig
          .filter(({key}) => filters[key])
          .map(({sortKey}) => sortKey)
          .join(',')
      });
  
      const response = await findDocuments(token, params);
      onDocumentsLoaded(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({...prev, [key]: value, page: 1}));
  };

  const handleSortChange = (selectedKey) => {
    setFilters(prev => ({
      ...prev,
      ...documentSortsConfig.reduce((acc, {key}) => ({
        ...acc,
        [key]: key === selectedKey
      }), {})
    }));
  };
  const debouncedFetch = useCallback(
    debounce(() => {
      fetchDocuments();
    }, 300), // 10 секунд задержки
    [filters] // Зависимости
  );

  useEffect(() => {
    debouncedFetch();
    return () => debouncedFetch.cancel(); 
  }, [debouncedFetch]);

  return (
    <div className="space-y-4 mb-6">
      {/* Фильтры */}
      <div className="flex flex-wrap gap-4">
        {documentFiltersConfig.map(({key, label, placeholder, type, options, component}) => (
          <div key={key} className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            {component === 'input' && (
              <input
                type={type}
                placeholder={placeholder}
                value={filters[key]}
                onChange={(e) => handleFilterChange(key, e.target.value)}
                className="p-2 border rounded-md w-64"
              />
            )}
            {component === 'checkbox' && (
              <div className="flex flex-wrap gap-3">
                {options.map(({value, label}) => (
                  <label key={value} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={filters[key].includes(value)}
                      onChange={(e) => handleFilterChange(
                        key,
                        e.target.checked
                          ? [...filters[key], value]
                          : filters[key].filter(v => v !== value)
                      )}
                      className="h-4 w-4 text-blue-600"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Сортировки */}
      {/* <div className="flex gap-4 items-center">
        <span className="text-sm font-medium text-gray-700">Сортировка:</span>
        {documentSortsConfig.map(({key, label}) => (
          <button
            key={key}
            onClick={() => handleSortChange(key)}
            className={`px-4 py-2 rounded-md ${
              filters[key] 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div> */}

      {/* Состояние загрузки и ошибки */}
      {loading && <div className="text-blue-600">Загрузка...</div>}
      {error && <div className="text-red-600">Ошибка: {error}</div>}
    </div>
  );
};

export default DocumentFilters;