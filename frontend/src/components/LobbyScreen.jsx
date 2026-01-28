import { useGame } from '../context/GameContext';

const LobbyScreen = () => {
  const { players, player, startGame } = useGame();

  return (
    <div className="screen">
      <div className="card">
        <h1 className="text-3xl font-bold mb-medium center-text text-primary">
          Sala de Espera
        </h1>
        <div style={{ backgroundColor: 'var(--color-surface-light)', borderRadius: '0.5rem', padding: '1rem', marginBottom: '1.5rem' }}>
          <h2 className="text-xl mb-medium">Jogadores ({players.length})</h2>
          {players.length === 0 ? (
            <div className="text-center text-muted" style={{ padding: '1rem' }}>
              <p>Carregando jogadores...</p>
              <p className="text-small" style={{ marginTop: '0.5rem' }}>
                Aguarde a conexão com o servidor ou recarregue a página
              </p>
            </div>
          ) : (
            <ul className="player-list">
              {players.map((p) => (
                <li key={p.socketId} className="player-item">
                  <span className="flex">
                    {p.isLeader && (
                      <span className="leader-icon">👑</span>
                    )}
                    {p.name} {p.name === player.name && " (você)"}
                  </span>
                  {p.isLeader && <span className="text-small text-muted">Líder</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {player.isLeader ? (
          <button
            onClick={startGame}
            style={{ backgroundColor: 'var(--color-success)' }}
            disabled={players.length < 1}
          >
            Iniciar Quiz!
          </button>
        ) : (
          <div style={{ 
            backgroundColor: 'var(--color-surface-light)', 
            borderRadius: '0.5rem', 
            padding: '1rem', 
            textAlign: 'center'
          }}>
            <p>Aguardando o líder iniciar o jogo...</p>
            <p className="text-small text-muted" style={{ marginTop: '0.5rem' }}>
              O primeiro jogador a entrar é o líder da sala
            </p>
          </div>
        )}
      </div>
      
      <div className="text-small text-muted center-text" style={{ marginTop: '2rem' }}>
        <p>Compartilhe o link com seus amigos para jogarem juntos!</p>
      </div>
    </div>
  );
};

export default LobbyScreen;