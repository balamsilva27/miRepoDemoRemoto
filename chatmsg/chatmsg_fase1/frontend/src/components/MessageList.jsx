import { useEffect, useRef } from 'react';

function MessageList({ messages, currentUser }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="message-list" ref={listRef}>
      {messages.map((msg) => (
        <div key={msg.id || Date.now()} className={`message ${msg.type}`}>
          {msg.type === 'system' ? (
            <span className="system-text">{msg.text}</span>
          ) : (
            <>
              <span className="message-header">
                <strong>{msg.username}</strong>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </span>
              <p className="message-text">{msg.text}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default MessageList;