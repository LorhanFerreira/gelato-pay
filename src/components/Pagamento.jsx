import { useState } from 'react';

export function Pagamento({ total, onFinalizarPedido }) {
  const [metodo, setMetodo] = useState('pix');

  const handlePagar = () => {
    if (total === 0) {
      alert('O carrinho está vazio!');
      return;
    }
    alert(`Pedido pago com sucesso via ${metodo.toUpperCase()}! 🎉`);
    onFinalizarPedido(); 
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

      <button className="btn-pagar" onClick={handlePagar}>
        Finalizar Pagamento (R$ {total.toFixed(2)})
      </button>
    </div>
  );
}