import { getDb } from '../db/sqlite-connection.js';

function getAllMovies() {
  const db = getDb();
  
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM movies`, [], (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        reject({ error: 'Erro ao buscar filmes', details: err });
        return;
      }
      
      resolve(rows);
    });
  });
}

function getMovieById(id) {
  if (!id) {
    return Promise.reject({ error: 'ID do filme não fornecido', status: 400 });
  }
  
  const db = getDb();
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM movies WHERE id = ?`, [id], (err, row) => {
      if (err) {
        console.error('Database query error:', err);
        reject({ error: 'Erro ao buscar filme', details: err });
        return;
      }
      
      if (!row) {
        reject({ error: 'Filme não encontrado', status: 404 });
        return;
      }
      
      resolve(row);
    });
  });
}

export {
  getAllMovies,
  getMovieById
};