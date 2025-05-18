
import { useState } from "react";
import DocumentFilters from "../components/DocumentFilters";
import DocumentList from "../components/DocumentsList";

const DocumentSearchPage = () => {
  const [documentsData, setDocumentsData] = useState({
    content: [],
    total: 0,
    page: 1,
    size: 10,
  });

  const handlePageChange = (page, size) => {
    setDocumentsData(prev => ({...prev, page, size}));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Поиск документов</h1>
      
      <DocumentFilters 
        onDocumentsLoaded={({content, totalElements}) => 
          setDocumentsData(prev => ({...prev, content, total: totalElements}))
        }
      />
      
      <DocumentList 
        documents={documentsData.content} 
        total={documentsData.total}
        page={documentsData.page}
        size={documentsData.size}
        onPageChange={handlePageChange}
      />
    </div>
  );
};


export default DocumentSearchPage;