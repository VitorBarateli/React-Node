const API_URL = 'http://localhost:3000/api';

export const getMovies = async (limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/movies?limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar dados do servidor:', error);
    throw error;
  }
};

export const getMovieById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/movies/${id}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar filme: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Falha ao buscar filme:', error);
    throw error;
  }
};