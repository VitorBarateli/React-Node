import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';


//Endereço do arquivo atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../database.sqlite');
const VIDEOS_JSON_PATH = path.join(__dirname, 'videos.json');

let db = null;

/**
 * Cria o banco de dados e a tabela de filmes, se não existirem
 * e insere os dados do arquivo videos.json, se estiver vazio
 */
function setupDb() {
  return new Promise((resolve, reject) => {
    if (db) {
      console.log('Banco de dados já inicializado');
      resolve(db);
      return;
    }
    
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Não foi possível conectar ao banco de dados', err);
        reject(err);
      } else {
        console.log('Conectado ao banco de dados SQLite');
        
        db.run(`CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT,
          poster TEXT,
          year INTEGER,
          rating REAL
        )`, (err) => {
          if (err) {
            console.error('Erro ao criar tabela:', err);
            reject(err);
          } else {
            db.get("SELECT COUNT(*) as count FROM movies", [], (err, row) => {
              if (err) {
                console.error('Erro ao contar filmes:', err);
                reject(err);
              } else if (row.count === 0) {
                try {
                  const videosData = fs.readFileSync(VIDEOS_JSON_PATH, 'utf8');
                  const videos = JSON.parse(videosData);
                  
                  console.log(`Carregando ${videos.length} filmes do arquivo videos.json...`);
                  
                  db.serialize(() => {
                    db.run('BEGIN TRANSACTION');
                    
                    const stmt = db.prepare(
                      "INSERT INTO movies (id, title, description, poster, year, rating) VALUES (?, ?, ?, ?, ?, ?)"
                    );
                    
                    videos.forEach(movie => {
                      stmt.run(
                        movie.id,
                        movie.title,
                        movie.description,
                        movie.poster,
                        movie.year,
                        movie.rating
                      );
                    });
                    
                    stmt.finalize();
                    db.run('COMMIT', err => {
                      if (err) {
                        console.error('Erro ao confirmar transação:', err);
                        reject(err);
                      } else {
                        console.log(`${videos.length} filmes inseridos com sucesso`);
                        resolve(db);
                      }
                    });
                  });
                } catch (fileError) {
                  console.error('Erro ao ler o arquivo videos.json:', fileError);
                  console.log('Utilizando dados de exemplo como alternativa...');
                  
                  const sampleMovies = [
                    { id: 1, title: 'The Shawshank Redemption', description: 'A man wrongly convicted...', poster: '', year: 1994, rating: 9.3 },
                    { id: 2, title: 'The Godfather', description: 'The aging patriarch...', poster: '', year: 1972, rating: 9.2 },
                    { id: 3, title: 'Pulp Fiction', description: 'The lives of two mob hitmen...', poster: '', year: 1994, rating: 8.9 }
                  ];
                  
                  const stmt = db.prepare(
                    "INSERT INTO movies (id, title, description, poster, year, rating) VALUES (?, ?, ?, ?, ?, ?)"
                  );
                  
                  sampleMovies.forEach(movie => {
                    stmt.run(
                      movie.id,
                      movie.title,
                      movie.description,
                      movie.poster,
                      movie.year,
                      movie.rating
                    );
                  });
                  
                  stmt.finalize();
                  console.log('Dados de exemplo inseridos');
                  resolve(db);
                }
              } else {
                // Tabela já possui dados
                console.log(`A tabela movies já contém ${row.count} registros. Pulando inserção.`);
                resolve(db);
              }
            });
          }
        });
      }
    });
  });
}

/**
 * Retorna a conexão com o banco de dados, inicializando-a se necessário
 */
function getDb() {
  if (!db) {
    console.log('Banco de dados não inicializado. Inicializando agora...');
    
    //Se o banco não existir crie um novo banco de dados
    if (!fs.existsSync(DB_PATH)) {
      console.log('Arquivo de banco de dados não encontrado, configurando banco de dados...');
      return setupDb();
    }
    
    //Conectando de forma síncrona para garantir a disponibilidade do banco
    db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
      }
      console.log('Conexão com banco de dados estabelecida');
    });
  }
  return db;
}

export {
  setupDb,
  getDb
};