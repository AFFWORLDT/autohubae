import { format } from 'date-fns';
import { CheckCheck, Check, Clock } from 'lucide-react';

const MessageBubble = ({ message }) => {
  // Format timestamp for display
  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return format(date, 'h:mm a');
  };

  // Get status icon based on message status
  const getStatusIcon = () => {
    if (!message.status) return null;

    switch (message.status) {
      case 'read':
        return <CheckCheck size={16} className="read" />;
      case 'delivered':
        return <CheckCheck size={16} className="delivered" />;
      case 'sent':
        return <Check size={16} className="sent" />;
      case 'pending':
      default:
        return <Clock size={16} className="pending" />;
    }
  };

  // Process message content - handle different message types if needed
  const renderMessageContent = () => {
    if (!message.content) return null;

    if (message.type === 'text' || !message.type) {
      return <div className="message-content">{message.content}</div>;
    }

    // Handle other message types in the future (images, audio, etc.)
    return <div className="message-content">{message.content}</div>;
  };

  return (
    <div 
      className={`message-bubble ${message.direction === 'outgoing' ? 'outgoing' : 'incoming'}`}
    >
      {renderMessageContent()}
      
      <div className="message-meta">
        <span className="message-time">
          {formatMessageTime(message.timestamp)}
        </span>
        
        {message.direction === 'outgoing' && (
          <span className="message-status">
            {getStatusIcon()}
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble; 