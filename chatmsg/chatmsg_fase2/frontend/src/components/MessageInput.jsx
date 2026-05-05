import { useState } from 'react';

function MessageInput({ disabled, onSend }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;

    onSend(cleanText);
    setText('');
  }

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Escribe un mensaje..."
        maxLength={1000}
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !text.trim()}>
        Enviar
      </button>
    </form>
  );
}

export default MessageInput;
