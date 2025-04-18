import { useState, useRef, useEffect } from 'react';
import Vapi from "@vapi-ai/web";
import '../styles/chat-widget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm AiManager. I can help you with general queries, or connect you with a live agent if needed. How can I assist you today?", 
      sender: 'ai',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveAgent, setIsLiveAgent] = useState(false);
  const [agentInfo, setAgentInfo] = useState(null);
  const messagesEndRef = useRef(null);
  const [vapi, setVapi] = useState(null);
  const [isVoiceCallLoading, setIsVoiceCallLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Vapi
    const vapiInstance = new Vapi("d85866c2-6f7e-4ce9-b188-716ccfde7017");
    setVapi(vapiInstance);

    // Set up event listeners
    vapiInstance.on("call-start", () => {
      setIsCallActive(true);
      setMessages(prev => [...prev, {
        text: "🎉 Voice call connected! You can now speak with the AI.",
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    vapiInstance.on("call-end", () => {
      setIsCallActive(false);
      setIsVoiceCallLoading(false);
      setMessages(prev => [...prev, {
        text: "Voice call ended. Thanks for using our service!",
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    vapiInstance.on("volume-level", (level) => {
      setVolume(level);
    });

    vapiInstance.on("message", (message) => {
      console.log("Received message:", message);
      if (message.type === 'transcript') {
        setMessages(prev => [...prev, {
          text: message.content,
          sender: 'user',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    });

    vapiInstance.on("error", (error) => {
      console.error("Vapi error:", error);
      setMessages(prev => [...prev, {
        text: "Error in voice call: " + error.message,
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    });

    return () => {
      // Cleanup
      if (vapiInstance) {
        vapiInstance.stop();
        setIsCallActive(false);
      }
    };
  }, []);

  const startVoiceCall = async () => {
    try {
      if (vapi) {
        setIsVoiceCallLoading(true);
        setMessages(prev => [...prev, {
          text: "Initializing voice call... Please wait",
          sender: 'system',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        
        await vapi.start("19b648da-b1f0-42a6-99f1-3599aa2886fd");
      }
    } catch (error) {
      console.error("Error starting voice call:", error);
      setMessages(prev => [...prev, {
        text: "Failed to start voice call. Please try again.",
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsVoiceCallLoading(false);
    }
  };

  const stopVoiceCall = () => {
    if (vapi) {
      vapi.stop();
    }
  };

  const generateGeminiResponse = async (userMessage) => {
    try {
      const response = await fetch('YOUR_BACKEND_API/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Gemini API Error:', error);
      return "I apologize, but I'm having trouble processing your request. Would you like to speak with a live agent?";
    }
  };

  const connectToLiveAgent = async () => {
    try {
      // Connect to your live agent service (e.g., WebSocket connection)
      const response = await fetch('YOUR_BACKEND_API/connect-agent', {
        method: 'POST',
      });
      
      const data = await response.json();
      setAgentInfo(data.agent);
      setIsLiveAgent(true);
      
      // Add system message about agent connection
      setMessages(prev => [...prev, {
        text: `You're now connected with ${data.agent.name}. How can I help you today?`,
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error('Live Agent Connection Error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, we couldn't connect you to a live agent at the moment. Please try again later.",
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Add user message
    const newMessages = [...messages, { 
      text: inputMessage, 
      sender: 'user',
      time: currentTime
    }];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      if (isLiveAgent) {
        // Send message to live agent through your backend
        await fetch('YOUR_BACKEND_API/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: inputMessage,
            agentId: agentInfo.id,
            // Add any other necessary information
          }),
        });
      } else {
        // Get response from Gemini API
        const aiResponse = await generateGeminiResponse(inputMessage);
        
        setMessages([...newMessages, { 
          text: aiResponse, 
          sender: 'ai',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages([...newMessages, { 
        text: "I apologize, but I'm having trouble processing your request. Please try again.", 
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const requestLiveAgent = () => {
    setMessages(prev => [...prev, {
      text: "Connecting you with a live agent...",
      sender: 'system',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    connectToLiveAgent();
  };

  const toggleMute = () => {
    if (vapi) {
      vapi.setMuted(!isMuted);
      setIsMuted(!isMuted);
      setMessages(prev => [...prev, {
        text: `Microphone ${!isMuted ? 'muted' : 'unmuted'}`,
        sender: 'system',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="chat-widget">
      <button 
        className="chat-toggle-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? (
          <span className="close-icon">×</span>
        ) : (
          <div className="bot-icon">
            <div className="bot-face">
              <div className="bot-eyes"></div>
              <div className="bot-mouth"></div>
            </div>
          </div>
        )}
      </button>

      {isOpen && (
        <div className="chat-container modern">
          <div className="chat-header glass">
            <div className="header-left">
              <div className={`ai-avatar ${isCallActive ? 'speaking' : ''}`}>
                <div className="ai-face">
                  <div className="ai-eyes">
                    <div className="eye"></div>
                    <div className="eye"></div>
                  </div>
                  <div className="ai-mouth"></div>
                </div>
                {isCallActive && (
                  <div className="audio-waves">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="wave" />
                    ))}
                  </div>
                )}
              </div>
              <div className="header-info">
                <h3 className="header-title">
                  {isLiveAgent ? agentInfo?.name || 'Live Agent' : 'AiManager'}
                </h3>
                <span className="status">
                  {isCallActive ? 'Voice call active' : 'Online'}
                </span>
              </div>
            </div>
            
            <div className="header-actions">
              {!isLiveAgent && (
                <button 
                  className="action-button live-agent"
                  onClick={requestLiveAgent}
                >
                  <span className="icon">👤</span>
                  <span className="label">Live Agent</span>
                </button>
              )}
              
              <div className="voice-controls">
                {isCallActive ? (
                  <>
                    <button 
                      className={`action-button ${isMuted ? 'muted' : ''}`}
                      onClick={toggleMute}
                    >
                      <span className="icon">{isMuted ? '🔇' : '🎤'}</span>
                    </button>
                    <button 
                      className="action-button end-call"
                      onClick={stopVoiceCall}
                    >
                      <span className="icon">📞</span>
                    </button>
                    <div className="volume-meter">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i} 
                          className="bar"
                          style={{ 
                            height: `${(i + 1) * 4}px`,
                            opacity: volume > i/5 ? 1 : 0.3
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <button 
                    className={`action-button voice ${isVoiceCallLoading ? 'loading' : ''}`}
                    onClick={startVoiceCall}
                    disabled={isVoiceCallLoading}
                  >
                    {isVoiceCallLoading ? (
                      <>
                        <div className="loading-dots">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="dot" />
                          ))}
                        </div>
                        <span className="label">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span className="icon">🎤</span>
                        <span className="label">Voice Call</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="chat-messages">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`message-wrapper ${message.sender}`}
              >
                {message.sender === 'ai' && (
                  <div className="message-avatar">AI</div>
                )}
                <div className="message-bubble">
                  <div className="message-text">{message.text}</div>
                  <div className="message-time">{message.time}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="typing-indicator">
                <div className="dots">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="dot" />
                  ))}
                </div>
                <span>{isLiveAgent ? `${agentInfo?.name} is typing` : 'AI is thinking'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input glass">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
              className="send-button"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget; 
