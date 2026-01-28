import React from "react";

const Filter = ({ search, setSearch, sortOrder, setSortOrder }) => {
  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Buscar filme..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
        <option value="desc">Ordenar por nota (Maior primeiro)</option>
        <option value="asc">Ordenar por nota (Menor primeiro)</option>
      </select>
    </div>
  );
};

export default Filter;