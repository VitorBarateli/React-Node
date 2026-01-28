import http from 'http';
import { parse } from 'url';
import { getAllMovies, getMovieById } from './models/movie.js';

async function handleRequest(req, res) {
  const parsedUrl = parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  //Ajuste do CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    if (pathname === '/api/movies' && req.method === 'GET') {
      try {
        const movies = await getAllMovies();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
      } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.error || 'Erro ao buscar filmes' }));
      }
    } 
    else if (pathname.startsWith('/api/movies/') && req.method === 'GET') {
      const id = pathname.split('/')[3];
      try {
        const movie = await getMovieById(id);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movie));
      } catch (error) {
        const statusCode = error.status || 500;
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.error || 'Erro ao buscar filme' }));
      }
    }
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    }
  } catch (error) {
    console.error('Erro do servidor:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Erro interno do servidor' }));
  }
}

const PORT = 3000;
const server = http.createServer(handleRequest);
server.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});