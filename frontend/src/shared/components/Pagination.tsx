import { Button } from './Button';

type Props = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
};

export const Pagination = ({ page, totalPages, totalItems, pageSize, loading, onPageChange }: Props) => {
  const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <span className="pagination__info">
        {totalItems === 0 ? 'No results' : `${from}–${to} of ${totalItems}`}
      </span>
      <div className="pagination__controls">
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <span className="pagination__page">
          {page} / {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          type="button"
          disabled={page >= totalPages || loading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
