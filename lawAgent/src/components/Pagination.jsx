import { memo } from "react";
const Pagination = memo(({
  current,
  total,
  pageSize,
  onChange,
  className,
  itemClassName = "px-3 py-1 rounded-md hover:bg-gray-100",
  activeClassName = "bg-blue-600 text-white"
}) => {
  const pageCount = Math.ceil(total / pageSize);

  // Добавляем диапазон отображаемых страниц
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(pageCount, current + 2);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Кнопки пагинации */}
      {getPageNumbers().map(page => (
        <button
          key={page}
          onClick={() => onChange(page, pageSize)}
          className={`${itemClassName} ${current === page ? activeClassName : ''}`}
        >
          {page}
        </button>
      ))}
    </div>
  );
});

export default Pagination;