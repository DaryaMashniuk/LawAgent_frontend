import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { parseDocumentDetails } from "../utils/documentParser";
import {
  getVersion,
  checkIsFavorite,
  addToFavorites,
  removeFromFavorites,
} from "../service/UserService";
import DOMPurify from "dompurify";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const DocumentVersionPage = () => {
  const { versionId } = useParams();
  const navigate = useNavigate();
  const { authToken, user } = useAuth();
  const [version, setVersion] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const contentRef = useRef(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const versionRes = await getVersion(versionId);
      if (!versionRes?.data?.version) {
        throw new Error("Document version not found");
      }

      const checkFavoriteRes = await checkIsFavorite(versionRes.data.version.id);
      setIsFavorite(checkFavoriteRes.data);

      setVersion(versionRes.data.version);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load document data");
    } finally {
      setLoading(false);
    }
  }, [versionId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const createMarkup = (html) => ({
    __html: DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["span", "p", "div", "br", "h1", "h2", "h3", "strong", "em", "ul", "ol", "li"],
    }),
  });

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites(versionId);
        toast.success("Removed from favorites");
      } else {
        await addToFavorites(versionId);
        toast.success("Added to favorites");
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("Failed to update favorites");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!version) return <div className="text-center py-8">Document not found</div>;

  const { number, date } = parseDocumentDetails(version.details);
console.log(version)
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Назад
        </button>

        <div className="flex gap-4">
          <Link
            to={`/profile/${user?.id}`}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Профиль
          </Link>
          <Link
            to={`/compare/${version.mainDocumentId}`}
            className="bg-blue-200 px-4 py-2 rounded hover:bg-blue-300"
          >
            Сравнить недавние версии
          </Link>
          <button
            onClick={toggleFavorite}
            className={`px-4 py-2 rounded ${isFavorite ? "bg-yellow-400" : "bg-gray-200 hover:bg-gray-300"}`}
          >
            {isFavorite ? "★ In favorites" : "☆ Add to favorites"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">
          Номер документа #{number}
          <span className="block text-sm font-normal mt-2">Date: {date}</span>
        </h1>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div
            ref={contentRef}
            className="prose max-w-none border rounded p-4"
            dangerouslySetInnerHTML={createMarkup(version.content)}
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentVersionPage;