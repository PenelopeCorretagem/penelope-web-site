import { FaTimes, FaComments } from 'react-icons/fa'
import { ButtonView } from '@shared/components/ui/Button/ButtonView'
import { TextView } from '@shared/components/ui/Text/TextView'
import { useChatbotViewModel } from './useChatbotViewModel'

export function ChatbotView() {
  const {
    isOpen,
    isTyping,
    messages,
    step,
    responses,
    handleOpen,
    handleClose,
    handleOptionClick,
  } = useChatbotViewModel()

  return (
    <>
      {!isOpen && (
        <ButtonView
          onClick={handleOpen}
          width="fit"
          shape="circle"
          variant="primary"
          className="fixed bottom-6 right-6 z-[999999] shadow-lg w-16 h-16 flex items-center justify-center hover:scale-105 transition cursor-pointer"

        >
          <FaComments className="text-white text-3xl" />
        </ButtonView>
      )}

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 md:w-96 bg-white shadow-xl rounded-2xl z-[999999] overflow-hidden flex flex-col h-[500px] animate-slideUp">

          {/* HEADER */}
          <div className="bg-distac-primary text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaComments className="text-3xl" />
              <div>
                <TextView className="font-bold text-white pb-2">PENÉLOPE</TextView>
                <TextView className="text-sm opacity-90 -mt-1 text-white">
                  Assistente virtual
                </TextView>
              </div>
            </div>

            <ButtonView
              onClick={handleClose}
              width="fit"
              shape="rounded"
              className="!p-2"
            >
              <FaTimes className="text-xl cursor-pointer" />
            </ButtonView>
          </div>

          {/* MENSAGENS */}
          <div className="p-4 flex-1 overflow-y-auto flex flex-col gap-4">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <TextView
                  className={`p-3 max-w-[80%] rounded-xl ${
                    m.sender === 'user'
                      ? 'bg-distac-primary text-white rounded-tr-none'
                      : 'bg-distac-primary/20 text-distac-secondary rounded-tl-none'
                  }`}
                >
                  {m.text}
                </TextView>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <TextView className="p-3 bg-distac-primary/20 text-distac-secondary rounded-xl rounded-tl-none max-w-[80%] italic opacity-80">
                  ...
                </TextView>
              </div>
            )}

            {!isTyping && responses[step]?.options && (
              <div className="flex flex-col gap-2 text-left">
                {responses[step].options.map((opt, index) => (
                  <ButtonView
                    key={index}
                    color="secondary"
                    width="fit"
                    shape="rounded"
                    onClick={() => handleOptionClick(opt)}
                    className="!px-3 !py-2 !text-sm !justify-start text-left"
                  >
                    {opt}
                  </ButtonView>
                ))}
              </div>
            )}
          </div>

          <div className="bg-distac-primary text-white p-4"></div>
        </div>
      )}
    </>
  )
}
