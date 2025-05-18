import React from 'react';
import { diffWords } from 'diff';

const HtmlDiffViewer = ({ comparisonResult }) => {
    if (!comparisonResult) {
        return <div className="loading">Загрузка данных сравнения...</div>;
    }

    const { firstVersionHtml, secondVersionHtml, diffBlocks } = comparisonResult;

    // Функция для вставки подсветки изменений в HTML
    const applyDiffToHtml = (html, blocks, isNewVersion) => {
        let result = html;
        let offset = 0;
        
        blocks.forEach(block => {
            if ((isNewVersion && block.operation === 'INSERT') || 
                (!isNewVersion && block.operation === 'DELETE')) {
                
                const startTag = isNewVersion ? 
                    '<span style="background:#e6ffe6;">' : 
                    '<span style="background:#ffe6e6;text-decoration:line-through;">';
                
                const searchText = block.text;
                const pos = result.indexOf(searchText, offset);
                
                if (pos !== -1) {
                    result = result.substring(0, pos) + 
                             startTag + searchText + '</span>' + 
                             result.substring(pos + searchText.length);
                    offset = pos + startTag.length + searchText.length + 7;
                }
            }
        });
        
        return result;
    };

    return (
        <div className="diff-container" style={{ display: 'flex', gap: '20px' }}>
            {/* Старая версия */}
            <div className="diff-column" style={{ flex: 1 }}>
                <h3>Предыдущая версия</h3>
                <div 
                    className="diff-content" 
                    dangerouslySetInnerHTML={{ 
                        __html: applyDiffToHtml(
                            firstVersionHtml, 
                            diffBlocks, 
                            false
                        ) 
                    }}
                    style={{ 
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '4px'
                    }}
                />
            </div>

            {/* Новая версия */}
            <div className="diff-column" style={{ flex: 1 }}>
                <h3>Новая версия</h3>
                <div 
                    className="diff-content" 
                    dangerouslySetInnerHTML={{ 
                        __html: applyDiffToHtml(
                            secondVersionHtml, 
                            diffBlocks, 
                            true
                        ) 
                    }}
                    style={{ 
                        border: '1px solid #ddd',
                        padding: '15px',
                        borderRadius: '4px'
                    }}
                />
            </div>
        </div>
    );
};

export default HtmlDiffViewer;