// components/Pagination.tsx

interface PaginationProps {
  total: number;
  offset: number;
  limit: number;
  onPageChange: (newOffset: number) => void;
}

export default function Pagination({ total, offset, limit, onPageChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  if (totalPages <= 1) return null;

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const goTo = (page: number) => onPageChange((page - 1) * limit);

  return (
    <div className="flex items-center justify-center gap-1">

      {/* Prev */}
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 h-9 rounded-full text-sm font-medium
                   text-on-surface hover:bg-surface-variant
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Prev
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, i) =>
        page === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-sm text-on-surface-variant"
          >
            ···
          </span>
        ) : (
          <button
            key={page}
            onClick={() => goTo(page)}
            className={`w-9 h-9 rounded-full text-sm font-medium transition-colors duration-150
              ${page === currentPage
                ? "bg-primary text-on-primary"
                : "text-on-surface hover:bg-surface-variant"
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 h-9 rounded-full text-sm font-medium
                   text-on-surface hover:bg-surface-variant
                   disabled:opacity-40 disabled:cursor-not-allowed
                   transition-colors duration-150"
      >
        Next
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
          viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

    </div>
  );
}