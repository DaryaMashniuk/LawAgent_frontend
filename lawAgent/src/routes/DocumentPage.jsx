import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getDocument } from "../service/UserService";

const DocumentPage = () => {

  const { documentId } = useParams();
  const [document, setDocument] = useState(null);
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Загрузка основного документа
        const docResponse = await getDocument(documentId);
        setDocument(docResponse.data);
        
        // Загрузка версий документа
        const versionsResponse = await axios.get(
          `/lawAgent/documents/${documentId}/versions`
        );
        setVersions(versionsResponse.data);
      } catch (error) {
        console.error("Ошибка загрузки документа:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [documentId]);

  if (loading) return <div className="text-center py-8">Загрузка...</div>;
  if (!document) return <div className="text-center py-8">Документ не найден</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{document.title}</h1>
      
      <div className="prose max-w-none mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg text-gray-700">{document.description}</p>
          <div className="mt-4 text-sm text-gray-500">
            <p>Категория: {document.category}</p>
            <p>Дата создания: {formatDocumentDate(document.createdAt)}</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">История версий</h2>
      <div className="space-y-4">
        {versions.sort((a, b) => b.number - a.number).map(version => (
          <div 
            key={version.id}
            className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">
                <a 
                  href={`/lawAgent/documents/versions/${version.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Версия №{version.number}
                </a>
              </h3>
              <span className="text-sm text-gray-500">
                {formatDocumentDate(version.createdAt)}
              </span>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-gray-600">{version.details}</p>
              <a
                href={version.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm"
              >
                Открыть оригинал
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentPage;