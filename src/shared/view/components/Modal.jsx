export function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    // Fundo (Overlay)
    // 'fixed inset-0' faz ele cobrir a tela inteira.
    // 'bg-black/50' cria um fundo preto com 50% de opacidade.
    // 'flex items-center justify-center' centraliza o conteúdo.
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Fecha o modal ao clicar no fundo
    >
      {/* Caixa de Conteúdo do Modal */}
      <div
        className="bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
        style={{ width: '820px', height: '384px' }}
      >
        {children}
      </div>
    </div>
  );
}
