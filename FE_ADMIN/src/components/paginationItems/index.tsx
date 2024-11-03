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
      <div
        key={1}
        className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black`}
        onClick={() => handlePageClick(1)}
      >
        <span className="text-white font-semibold text-sm">1</span>
      </div>,
    );
    if (start > 2) {
      paginationItems.push(
        <div key={-1} className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black`}>
          <span className="text-white font-semibold text-sm">...</span>
        </div>,
      );
    }
  }

  for (let i = start; i <= end; i++) {
    paginationItems.push(
      <div
        key={i}
        className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 ${
          i === page ? 'bg-blue' : 'bg-black'
        }`}
        onClick={() => handlePageClick(i)}
      >
        <span className="text-white font-semibold text-sm">{i}</span>
      </div>,
    );
  }

  if (end < totalPage) {
    if (end < totalPage - 1) {
      paginationItems.push(
        <div key={-2} className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black`}>
          <span className="text-white font-semibold text-sm">...</span>
        </div>,
      );
    }
    paginationItems.push(
      <div
        key={totalPage}
        className={`h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black`}
        onClick={() => handlePageClick(totalPage)}
      >
        <span className="text-white font-semibold text-sm">{totalPage}</span>
      </div>,
    );
  }

  return (
    <div className="flex items-center justify-end py-5">
      {page > 1 && (
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black"
          onClick={() => handlePageClick(page - 1)}
        >
          <i className="bx bx-chevrons-left font-bold text-xl text-white"></i>
        </div>
      )}
      {totalPage > 1 && paginationItems}
      {page < totalPage && (
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center cursor-pointer mx-2 bg-black"
          onClick={() => handlePageClick(page + 1)}
        >
          <i className="bx bx-chevrons-right font-bold text-xl text-white"></i>
        </div>
      )}
    </div>
  );
};

export default Pagination;
