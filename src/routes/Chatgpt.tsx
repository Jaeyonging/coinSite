import axios from 'axios';
import React, { useState } from 'react'

export const Chatgpt = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    try {
      const res = await axios.post(
        'https://api.openai.com/v1/completions',
        {
          model: 'gpt-3.5-turbo',
          prompt: input,
          max_tokens: 7,
          temperature: 0,

        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer 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'
          }
        }
      );
      setResponse(res.data.choices[0].text.trim());
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div>ChatGPT Response: {response}</div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
