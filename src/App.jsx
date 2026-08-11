// import { useState } from 'react';
// import { Cardapio } from './components/Cardapio';
// import { Carrinho } from './components/Carrinho';
// import { Pagamento } from './components/Pagamento';
// import './App.css';

// const PRODUTOS_SORVETERIA = [
//   { id: 1, nome: 'Casquinha de Baunilha', preco: 6.00 },
//   { id: 2, nome: 'Cascão de Chocolate', preco: 9.50 },
//   { id: 3, nome: 'Copinho de Sorvete', preco: 12.00 },
//   { id: 4, nome: 'Sundae de Morango', preco: 14.00 },
//   { id: 5, nome: 'Açaí na Tigela 500ml', preco: 18.00 },
// ];

// export default function App() {
//   const [carrinho, setCarrinho] = useState([]);

//   const handleAdicionarItem = (produto) => {
//     setCarrinho([...carrinho, produto]);
//   };


//   const handleRemoverItem = (indexParaRemover) => {
//     setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
//   };


//   const handleFinalizarPedido = () => {
//     setCarrinho([]);
//   };

  
//   const valorTotal = carrinho.reduce((acc, item) => acc + item.preco, 0);

//   return (
//     <div className="container-principal">
//       <header>
//         <h1>🍦 Sorveteria Delícia Gelada</h1>
//       </header>

//       <div className="conteudo-caixa">
//         <Cardapio produtos={PRODUTOS_SORVETERIA} onAdicionar={handleAdicionarItem} />
        
//         <div className="painel-lateral">
//           <Carrinho 
//             itens={carrinho} 
//             onRemover={handleRemoverItem} 
//             total={valorTotal} 
//           />
//           <Pagamento 
//             total={valorTotal} 
//             onFinalizarPedido={handleFinalizarPedido} 
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Cardapio } from './components/Cardapio';
import { Carrinho } from './components/Carrinho';
import { Pagamento } from './components/Pagamento';
import './App.css';

export default function App() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);

  // Estados para o Pagamento via PIX
  const [dadosPix, setDadosPix] = useState(null);
  const [carregandoPix, setCarregandoPix] = useState(false);

  // Busca os produtos direto da tabela 'produtos' no Supabase
  useEffect(() => {
    async function buscarProdutos() {
      try {
        setCarregandoProdutos(true);
        const { data, error } = await supabase
          .from('produtos')
          .select('*')
          .order('categoria', { ascending: true });

        if (error) {
          console.error('Erro ao buscar produtos:', error);
        } else {
          setProdutos(data || []);
        }
      } catch (err) {
        console.error('Erro de conexão:', err);
      } finally {
        setCarregandoProdutos(false);
      }
    }

    buscarProdutos();
  }, []);

  const handleAdicionarItem = (produto) => {
    setCarrinho([...carrinho, produto]);
  };

  const handleRemoverItem = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  // Função para processar o pagamento com a Edge Function do Supabase
  const handleFinalizarPedido = async (metodoPagamento) => {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (metodoPagamento === 'pix') {
      setCarregandoPix(true);

      try {
        const { data, error } = await supabase.functions.invoke('gerar-pix', {
          body: {
            valor: valorTotal,
            descricao: 'Pedido - Sorveteria Delícia Gelada'
          }
        });

        if (error || !data?.qr_code_base64) {
          throw new Error('Erro ao gerar o PIX');
        }

        setDadosPix({
          qrCodeImage: `data:image/jpeg;base64,${data.qr_code_base64}`,
          copiaECola: data.qr_code
        });
      } catch (err) {
        alert('Erro ao gerar cobrança PIX. Tente novamente.');
        console.error(err);
      } finally {
        setCarregandoPix(false);
      }
    } else {
      alert('Pedido finalizado com sucesso!');
      setCarrinho([]);
    }
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + Number(item.preco), 0);

  return (
    <div className="container-principal">
      <header>
        <h1>🍦 Sorveteria Delícia Gelada</h1>
      </header>

      <div className="conteudo-caixa">
        {carregandoProdutos ? (
          <div className="cardapio">
            <p>Carregando sorvetes do banco...</p>
          </div>
        ) : (
          <Cardapio produtos={produtos} onAdicionar={handleAdicionarItem} />
        )}

        <div className="painel-lateral">
          <Carrinho 
            itens={carrinho} 
            onRemover={handleRemoverItem} 
            total={valorTotal} 
          />
          <Pagamento 
            total={valorTotal} 
            onFinalizarPedido={handleFinalizarPedido}
            carregandoPix={carregandoPix} 
          />
        </div>
      </div>

      {/* Modal para exibir o QR Code do PIX */}
      {dadosPix && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center',
            maxWidth: '350px',
            width: '90%'
          }}>
            <h3>Escaneie o PIX para Pagar</h3>
            <img src={dadosPix.qrCodeImage} alt="QR Code PIX" style={{ width: 200, height: 200, margin: '16px 0' }} />
            <p style={{ fontSize: '12px', color: '#666' }}>Ou copie o código abaixo:</p>
            <input 
              type="text" 
              readOnly 
              value={dadosPix.copiaECola} 
              style={{ width: '100%', padding: '8px', marginBottom: '12px' }}
            />
            <button 
              onClick={() => {
                navigator.clipboard.writeText(dadosPix.copiaECola);
                alert('Código PIX copiado!');
              }}
              style={{ padding: '10px 16px', background: '#009ee3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '8px' }}
            >
              Copiar Código
            </button>
            <button 
              onClick={() => {
                setDadosPix(null);
                setCarrinho([]);
              }}
              style={{ padding: '10px 16px', background: '#ccc', color: '#333', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}