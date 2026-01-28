import React from "react";

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
  return (
    <div className="pagination">
      <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
        Anterior
      </button>

      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i + 1}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => setCurrentPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}

      <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
        Próximo
      </button>
    </div>
  );
};

export default Pagination;