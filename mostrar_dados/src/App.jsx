import { useState } from 'react'


function App() {
  const [itens] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [showList, setShowList] = useState(false);

  return (
    <>
      <h1>Lista de Itens</h1>
      <button onClick={() => setShowList(!showList)}>Mostrar</button>
      {showList && (
        <ul>
          {itens.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </>
  )
}

export default App