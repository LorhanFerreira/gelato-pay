import { useState } from 'react';

export function Pagamento({ total, onFinalizarPedido, carregandoPix }) {
  const [metodo, setMetodo] = useState('pix');

  const handlePagar = () => {
    if (total === 0) {
      alert('O carrinho está vazio!');
      return;
    }
    // Passa o método selecionado ('pix', 'cartao', 'dinheiro') para o App.jsx
    onFinalizarPedido(metodo); 
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
        {carregandoPix ? 'Gerando PIX...' : `Finalizar Pagamento (R$ ${total.toFixed(2)})`}
      </button>
    </div>
  );
}