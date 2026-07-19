
import React, { useState, useEffect, useRef } from 'react';

interface QuickChatModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChatOption {
    text: string;
    answer: string;
    nextStage: string;
}

interface ChatStage {
    botMessage?: string;
    options: ChatOption[];
}

const chatFlow: Record<string, ChatStage> = {
    initial: {
        botMessage: "Welcome to Brokerless Realty! I'm here to help. What would you like to know?",
        options: [
            { text: "Is there a brokerage fee?", answer: "No, Brokerless Realty is a 100% broker-free platform. You save the entire commission by connecting directly with property owners.", nextStage: "followUp" },
            { text: "How are properties verified?", answer: "Every property on our platform undergoes a thorough verification process. We check legal documents, ownership details, and property condition to ensure all listings are genuine.", nextStage: "followUp" },
            { text: "How do I contact an owner?", answer: "On any property page, you can use the 'Request Information' form. The owner's contact details will then be shared with you directly.", nextStage: "followUp" },
        ]
    },
    followUp: {
        botMessage: "Is there anything else I can help with?",
        options: [
            { text: "Tell me about support services.", answer: "We provide end-to-end support, including legal documentation, home loans assistance, and property inspection services.", nextStage: "followUp" },
            { text: "How do I list my property?", answer: "You can click the 'List Property' button in the header to start the simple listing process. It's quick, easy, and free!", nextStage: "followUp" },
            { text: "Start over", answer: "Of course. What would you like to know?", nextStage: "initial" }
        ]
    }
};

type Message = {
    sender: 'bot' | 'user';
    text: string;
};

const QuickChatModal: React.FC<QuickChatModalProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [currentStage, setCurrentStage] = useState('initial');
    const [isTyping, setIsTyping] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const initialMessage = chatFlow.initial.botMessage || "Welcome!";
            setMessages([{ sender: 'bot', text: initialMessage }]);
            setCurrentStage('initial');
        } else {
            setMessages([]);
        }
    }, [isOpen]);
    
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleOptionClick = (option: ChatOption) => {
        setMessages(prev => [...prev, { sender: 'user', text: option.text }]);
        setIsTyping(true);

        setTimeout(() => {
            setIsTyping(false);
            const newBotMessages: Message[] = [{ sender: 'bot', text: option.answer }];
            const nextStageData = chatFlow[option.nextStage];
            if (nextStageData.botMessage) {
                newBotMessages.push({ sender: 'bot', text: nextStageData.botMessage });
            }
            setMessages(prev => [...prev, ...newBotMessages]);
            setCurrentStage(option.nextStage);
        }, 800);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-end items-end"
            onClick={onClose}
        >
            <div
                className={`bg-white rounded-t-xl lg:rounded-xl shadow-2xl w-full max-w-md m-0 lg:m-6 flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ height: '75vh', maxHeight: '600px' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{backgroundColor: 'var(--color-dark)'}} className="text-white p-4 flex justify-between items-center rounded-t-xl lg:rounded-t-xl flex-shrink-0">
                    <h3 className="font-bold text-lg">Quick Chat</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300" aria-label="Close chat">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div ref={chatContainerRef} className="p-4 flex-grow overflow-y-auto space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`rounded-2xl py-2 px-4 max-w-xs md:max-w-sm ${msg.sender === 'bot' ? 'bg-gray-200 text-gray-800 rounded-bl-none' : 'bg-[var(--color-primary)] text-white rounded-br-none'}`}>
                                <p className="text-sm">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                         <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-500 rounded-2xl py-2 px-4 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                    <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                    <div className="flex flex-col space-y-2">
                        {!isTyping && chatFlow[currentStage].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleOptionClick(option)}
                                className="w-full text-left p-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-teal-50 transition-colors duration-200 text-sm font-medium"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickChatModal;
