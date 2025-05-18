import React, { useState, useEffect } from 'react';
import DocumentDiffViewer from '../components/DocumentDiffViewer';
import {useAuth} from '../context/AuthContext';
import HtmlDiffViewer from '../components/HtmlDiffViewer';
import { getComparison } from '../service/UserService';
import { useParams } from 'react-router-dom';
const DocumentComparisonPage = () => {
    const { documentId } = useParams();
    const [comparison, setComparison] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user,authToken } = useAuth();
    useEffect(() => {
        const fetchComparison = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getComparison(authToken,documentId);
                
                if (response.data) {
                    setComparison(response.data);
                } else {
                    throw new Error('Неверный формат данных от сервера');
                }
            } catch (err) {
                console.error('Error fetching comparison:', err);
                setError(err.message || 'Произошла ошибка при загрузке данных');
            } finally {
                setLoading(false);
            }
        };
        
        if (documentId) {
            fetchComparison();
        }
    }, [documentId]);
    
    if (loading) return <div className="loading">Загрузка сравнения...</div>;
    if (error) return <div className="error">Ошибка: {error}</div>;
    if (!documentId) return <div className="error">Не указан ID документа</div>;
    
    return (
        <div className="page-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h2>Сравнение версий документа</h2>
            <DocumentDiffViewer comparisonResult={comparison} />
        </div>
    );
};

export default DocumentComparisonPage;