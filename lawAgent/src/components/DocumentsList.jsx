import Pagination from "../components/Pagination";
import { DOCUMENT_CATEGORIES } from "../utils/Constants";
import { Link } from "react-router-dom";
import { parseDocumentDetails } from "../utils/documentParser";

const DocumentList = ({ documents = [], total, page, size, onPageChange }) => {
  const formatDate = (dateString) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(dateString).toLocaleDateString("ru-RU", options);
  };
  console.log(documents);
  return (
    <div className="space-y-6">
      {documents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Документы не найдены</div>
      ) : (
        <>
          <div className="grid gap-6">
            {documents.map((document, index) => (
              <div key={document.documentId} className="p-6 bg-white rounded-lg shadow-md border border-gray-100">
                <h2 className="text-xl font-semibold mb-4">{document.title}</h2>

                <div className="ml-4 space-y-4">
                  <h3 className="font-medium text-lg text-gray-700">Версии документа:</h3>
                  {document.versions
                  .sort((a, b) => b.number - a.number)
                  .map((version) => {
                    const { number, date } = parseDocumentDetails(version.details);
                    return(
                    <div key={version.id} className="p-4 bg-gray-50 rounded-md border-l-4 border-blue-200">
                      <Link
                        to={`/documents/versions/${version.id}`}
                        className="flex items-baseline justify-between mb-2"
                      >
                        <div className="flex items-baseline justify-between mb-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Версия №{number}</span>
                            <span className="mx-2">•</span>
                            <span className="text-sm text-gray-500">{date}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{version.details}</p>
                        {index < document.versions.length - 1 && (
                          <div className="my-3 border-t border-dashed border-gray-200" />
                        )}

                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(version.sourceUrl, "_blank");
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Источник
                        </button>
                      </Link>
                    </div>
)})}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            current={page}
            total={total}
            pageSize={size}
            onChange={onPageChange}
            className="flex justify-center gap-2 mt-8"
            itemClassName="px-4 py-2 rounded-md hover:bg-gray-100 border"
            activeClassName="bg-blue-600 text-white border-blue-600"
          />
        </>
      )}
    </div>
  );
};

export default DocumentList;
