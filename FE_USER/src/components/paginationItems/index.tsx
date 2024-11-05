import React from 'react';

const Pagination = ({ page, totalPage, handlePageClick }) => {
  const paginationItems: any = [];

  // Tính toán phạm vi trang bạn muốn hiển thị
  const range = 2;
  const start = Math.max(1, Math.min(page - range));
  const end = Math.min(totalPage, start + 2 * range);

  // Tạo nút trang
  if (start > 1) {
    paginationItems.push(
      <a key={1} className={`pagination--items`} onClick={() => handlePageClick(1)}>
        1
      </a>,
    );
    if (start > 2) {
      paginationItems.push(
        <a key={-1} className={`pagination--items`}>
          ...
        </a>,
      );
    }
  }

  for (let i = start; i <= end; i++) {
    paginationItems.push(
      <a key={i} className={`pagination--items ${i === page ? 'active-page' : ''}`} onClick={() => handlePageClick(i)}>
        {i}
      </a>,
    );
  }

  if (end < totalPage) {
    if (end < totalPage - 1) {
      paginationItems.push(
        <a key={-2} className={`pagination--items`}>
          ...
        </a>,
      );
    }
    paginationItems.push(
      <a key={totalPage} className={`pagination--items`} onClick={() => handlePageClick(totalPage)}>
        {totalPage}
      </a>,
    );
  }

  return (
    <div className="toolbar-pagi">
      <div className="ajax-pagi">
        <div className="d-flex align-items-center justify-content-center pagination">
          {page > 1 && (
            <a
              className="prev-page pagination--items"
              aria-label="pagination-prev"
              onClick={() => handlePageClick(page - 1)}
            />
          )}
          {totalPage > 1 && paginationItems}
          {page < totalPage && (
            <a
              className="next-page pagination--items"
              aria-label="pagination-next"
              onClick={() => handlePageClick(page + 1)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
