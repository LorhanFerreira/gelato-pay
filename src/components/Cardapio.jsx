export function Cardapio({ produtos, onAdicionar }) {
  return (
    <div className="cardapio">
      <h2>🍧 Cardápio de Sorvetes</h2>
      <div className="lista-produtos">
        {produtos.map((produto) => (
          <div key={produto.id} className="card-produto">
            <h3>{produto.nome}</h3>
            <p className="preco">R$ {produto.preco.toFixed(2)}</p>
            <button onClick={() => onAdicionar(produto)}>+ Adicionar</button>
          </div>
        ))}
      </div>
    </div>
  );
}