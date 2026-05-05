import { useEffect, useRef } from 'react';

function formatTime(createdAt) {
  return new Date(createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function MessageList({ messages }) {
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={listRef}>
      {messages.length === 0 && <p className="empty-state">Sin mensajes todavia.</p>}
      {messages.map((message) => (
        <article key={message.id} className={`message ${message.type === 'system' ? 'system' : 'normal'}`}>
          {message.type === 'system' ? (
            <p>{message.text}</p>
          ) : (
            <>
              <header>
                <strong>{message.username}</strong>
                <time>{formatTime(message.createdAt)}</time>
              </header>
              <p>{message.text}</p>
            </>
          )}
        </article>
      ))}
    </div>
  );
}

export default MessageList;
