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

  const limparCarrinho = () => {
    setCarrinho([]);
  };

  // Função para gerar o QR Code do PIX
  const gerarPix = async () => {
    try {
      setCarregandoPix(true);
      const valorTotalCalculado = carrinho.reduce((acc, item) => acc + Number(item.preco), 0);

      const res = await fetch('https://zsnxkasagwmjftoqbkvj.supabase.co/functions/v1/gerar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          valor: valorTotalCalculado,
          email: 'cliente@email.com',
          descricao: 'Pedido Sorveteria Delícia Gelada',
        }),
      });

      const data = await res.json();

      if (data.qr_code) {
        setDadosPix({
          qrCodeImage: `data:image/png;base64,${data.qr_code_base64}`,
          copiaECola: data.qr_code,
        });
      } else {
        alert('Erro ao gerar o PIX. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro na requisição do PIX:', err);
      alert('Erro de conexão ao gerar o PIX.');
    } finally {
      setCarregandoPix(false);
    }
  };

  // Processa o pagamento conforme o método selecionado
  const handleFinalizarPedido = async (metodo) => {
    if (metodo === 'pix') {
      gerarPix();
    } else if (metodo === 'cartao') {
      try {
        setCarregandoPix(true);
        const res = await fetch('https://zsnxkasagwmjftoqbkvj.supabase.co/functions/v1/gerar-cartao', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itens: carrinho, email: 'cliente@email.com' }),
        });
        const data = await res.json();
        if (data.init_point) {
          window.location.href = data.init_point; // Redireciona para o checkout do cartão
        } else {
          alert('Erro ao iniciar pagamento com cartão.');
        }
      } catch (err) {
        console.error('Erro no cartão:', err);
        alert('Erro ao conectar com a gateway de cartão.');
      } finally {
        setCarregandoPix(false);
      }
    } else if (metodo === 'dinheiro') {
      alert('Pedido realizado! O pagamento será feito em dinheiro na entrega.');
      limparCarrinho();
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
                limparCarrinho();
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