export function Carrinho({ itens, onRemover, total }) {
  return (
    <div className="carrinho">
      <h2>🛒 Comanda do Cliente</h2>
      {itens.length === 0 ? (
        <p className="vazio">Nenhum item adicionado ainda.</p>
      ) : (
        <>
          <ul>
            {itens.map((item, index) => (
              <li key={index}>
                <span>{item.nome}</span>
                <span>R$ {item.preco.toFixed(2)}</span>
                <button onClick={() => onRemover(index)}>❌</button>
              </li>
            ))}
          </ul>
          <div className="total">
            <h3>Total: R$ {total.toFixed(2)}</h3>
          </div>
        </>
      )}
    </div>
  );
}