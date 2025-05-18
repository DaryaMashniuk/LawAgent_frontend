import React from 'react';

const DocumentDiffViewer = ({ comparisonResult }) => {
    if (!comparisonResult) {
        return <div className="text-center py-8 text-gray-500">Загрузка данных сравнения...</div>;
    }

    const { firstVersionHtml, secondVersionHtml, diffBlocks } = comparisonResult;

    const applyDiffToHtml = (html, blocks, isNewVersion) => {
        let processedHtml = html;

        const relevantBlocks = blocks.filter(block =>
            ((isNewVersion && block.operation === 'INSERT') ||
                (!isNewVersion && block.operation === 'DELETE')) &&
            block.text.length > 15
        );

        const sortedBlocks = [...relevantBlocks].sort((a, b) => b.text.length - a.text.length);


        sortedBlocks.forEach(block => {
            const textToHighlight = block.text.trim();

            if (!textToHighlight) return;

            const highlightStyle = isNewVersion
                ? 'bg-green-100 text-green-800 rounded px-1'
                : 'bg-red-100 text-red-800 rounded px-1 line-through';

            processedHtml = processedHtml.replace(
                textToHighlight,
                match => `<span class="${highlightStyle}">${match}</span>`
            );
        });

        return processedHtml;
    };

    const injectTableStyles = (html) => {
        return html
            .replace(/<table/g, '<table style="width:100%;border-collapse:collapse;margin:1rem 0;font-family:inherit"')
            .replace(/<img/g, '<img style="max-width:100%;height:auto"');
    };

    const significantChanges = diffBlocks.filter(b =>
        b.operation !== 'EQUAL' && b.text.length > 15
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Сравнение документов</h1>
                <p className="text-gray-600">
                    {new Date(comparisonResult.firstVersionDate).toLocaleString()} → {new Date(comparisonResult.secondVersionDate).toLocaleString()}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Старая версия */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="bg-gray-800 text-white px-6 py-4">
                        <h3 className="text-lg font-semibold">Предыдущая версия</h3>
                    </div>
                    <div
                        className="p-6 prose max-w-none flex-grow overflow-auto"
                        style={{ maxHeight: '70vh' }}
                        dangerouslySetInnerHTML={{
                            __html: injectTableStyles(applyDiffToHtml(firstVersionHtml, diffBlocks, false))
                        }}
                    />
                </div>

                {/* Новая версия */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
                    <div className="bg-blue-600 text-white px-6 py-4">
                        <h3 className="text-lg font-semibold">Новая версия</h3>
                    </div>
                    <div
                        className="p-6 prose max-w-none flex-grow overflow-auto"
                        style={{ maxHeight: '70vh' }}
                        dangerouslySetInnerHTML={{
                            __html: injectTableStyles(applyDiffToHtml(secondVersionHtml, diffBlocks, true))
                        }}
                    />
                </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Статистика изменений</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-gray-600">Значимых добавлений: </span>
                            <span className="font-medium text-green-600">
                                {significantChanges.filter(b => b.operation === 'INSERT').length}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-600">Значимых удалений: </span>
                            <span className="font-medium text-red-600">
                                {significantChanges.filter(b => b.operation === 'DELETE').length}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow col-span-2">
    <h3 className="text-xl font-semibold mb-4">Ключевые изменения</h3>
    <div className="space-y-4">
        {significantChanges
            .slice(10, 15)
            .map((block, i) => {
                const highlightStyle = block.operation === 'INSERT'
                    ? 'bg-green-100 text-green-800 rounded px-1'
                    : 'bg-red-100 text-red-800 rounded px-1 line-through';

                const highlightedHtml = `<span class="${highlightStyle}">${block.text.trim()}</span>`;
                const styledHtml = injectTableStyles(highlightedHtml);

                return (
                    <div key={i} className="border rounded p-4 bg-gray-50">
                        <div
                            className="prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: styledHtml }}
                        />
                    </div>
                );
            })}
    </div>
</div>
            </div>
        </div>
    );
};

export default DocumentDiffViewer;
