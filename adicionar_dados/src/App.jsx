import { useState } from 'react'


function App() {
  const [itens, setItens] = useState(['Item 1', 'Item 2', 'Item 3']);
  const [showList, setShowList] = useState(false);

  function addItens() {
    setItens([...itens, `Item ${itens.length + 1}`]);
    setShowList(true);
  }

  return (
    <>
      <h1>Lista de Itens</h1>
      <button onClick={() => setShowList(!showList)}>Mostrar</button>
      <button onClick={() => addItens()}>Adicionar</button>
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