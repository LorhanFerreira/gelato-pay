import { useState } from 'react';
import { Cardapio } from './components/Cardapio';
import { Carrinho } from './components/Carrinho';
import { Pagamento } from './components/Pagamento';
import './App.css';

const PRODUTOS_SORVETERIA = [
  { id: 1, nome: 'Casquinha de Baunilha', preco: 6.00 },
  { id: 2, nome: 'Cascão de Chocolate', preco: 9.50 },
  { id: 3, nome: 'Copinho de Sorvete', preco: 12.00 },
  { id: 4, nome: 'Sundae de Morango', preco: 14.00 },
  { id: 5, nome: 'Açaí na Tigela 500ml', preco: 18.00 },
];

export default function App() {
  const [carrinho, setCarrinho] = useState([]);

  const handleAdicionarItem = (produto) => {
    setCarrinho([...carrinho, produto]);
  };


  const handleRemoverItem = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };


  const handleFinalizarPedido = () => {
    setCarrinho([]);
  };

  
  const valorTotal = carrinho.reduce((acc, item) => acc + item.preco, 0);

  return (
    <div className="container-principal">
      <header>
        <h1>🍦 Sorveteria Delícia Gelada</h1>
      </header>

      <div className="conteudo-caixa">
        <Cardapio produtos={PRODUTOS_SORVETERIA} onAdicionar={handleAdicionarItem} />
        
        <div className="painel-lateral">
          <Carrinho 
            itens={carrinho} 
            onRemover={handleRemoverItem} 
            total={valorTotal} 
          />
          <Pagamento 
            total={valorTotal} 
            onFinalizarPedido={handleFinalizarPedido} 
          />
        </div>
      </div>
    </div>
  );
}