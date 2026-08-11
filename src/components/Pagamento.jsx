import { useState } from 'react';

export function Pagamento({ total, onFinalizarPedido, carregandoPix }) {
  const [metodo, setMetodo] = useState('pix');

  const handlePagar = () => {
    if (total === 0) {
      alert('O carrinho está vazio!');
      return;
    }
    // Repassa o método selecionado ('pix', 'cartao', ou 'dinheiro') para a função no App.jsx
    onFinalizarPedido(metodo); 
  };

  // Função auxiliar para dinamizar o texto do botão
  const getTextoBotao = () => {
    if (carregandoPix) return 'Processando...';
    if (metodo === 'pix') return `Gerar PIX (R$ ${total.toFixed(2)})`;
    if (metodo === 'cartao') return `Pagar com Cartão (R$ ${total.toFixed(2)})`;
    return `Confirmar Pedido em Dinheiro (R$ ${total.toFixed(2)})`;
  };

  return (
    <div className="pagamento">
      <h2>💳 Pagamento</h2>
      <div className="opcoes">
        <label>
          <input
            type="radio"
            name="metodo"
            value="pix"
            checked={metodo === 'pix'}
            onChange={(e) => setMetodo(e.target.value)}
          />
          PIX
        </label>
        <label>
          <input
            type="radio"
            name="metodo"
            value="cartao"
            checked={metodo === 'cartao'}
            onChange={(e) => setMetodo(e.target.value)}
          />
          Cartão de Crédito/Débito
        </label>
        <label>
          <input
            type="radio"
            name="metodo"
            value="dinheiro"
            checked={metodo === 'dinheiro'}
            onChange={(e) => setMetodo(e.target.value)}
          />
          Dinheiro
        </label>
      </div>

      <button 
        className="btn-pagar" 
        onClick={handlePagar}
        disabled={carregandoPix}
      >
        {getTextoBotao()}
      </button>
    </div>
  );
}