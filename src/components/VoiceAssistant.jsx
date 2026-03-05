import React, { useState, useRef, useEffect } from 'react';

export default function VoiceAssistant() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [status, setStatus] = useState('idle'); // idle, listening, processing, speaking
  
  const recognitionRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'es-MX';
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) handleSendMessage(transcript, true);
      };
      
      recognitionRef.current.onerror = (e) => setStatus('idle');
      recognitionRef.current.onend = () => { if (status === 'listening') setStatus('idle'); };
    }
  }, []);

  const handleSendMessage = async (text, isVoiceMode) => {
    if (!text || text.trim() === "") return;

    setStatus('processing');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    if (!isVoiceMode) setInputText(""); 

    console.log("🚀 Enviando:", { message: text, isVoice: isVoiceMode });

    try {
      const res = await fetch('/api/chat', { // <--- BARRA IMPORTANTE
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, isVoice: isVoiceMode }),
      });

      const data = await res.json();
      console.log("✅ Recibido:", data);

      setMessages(prev => [...prev, { role: 'go', content: data.reply }]);

      if (data.audio) {
        playAudio(data.audio);
      } else {
        setStatus('idle');
      }

    } catch (error) {
      console.error("❌ Error Fetch:", error);
      setMessages(prev => [...prev, { role: 'go', content: "Error de conexión." }]);
      setStatus('idle');
    }
  };

  const playAudio = (base64) => {
    setStatus('speaking');
    if (audioRef.current) audioRef.current.pause();
    audioRef.current = new Audio(base64);
    audioRef.current.onended = () => setStatus('idle');
    audioRef.current.play().catch(e => console.error(e));
  };

  const toggleMic = () => {
    if (status === 'listening') {
      recognitionRef.current.stop();
    } else {
      setStatus('listening');
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col h-[600px] max-w-md mx-auto bg-gray-900 text-white rounded-xl shadow-2xl border border-gray-700">
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && <p className="text-center text-gray-500 mt-10">Soy BotGo. ¿En qué te ayudo?</p>}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              {msg.content}
            </div>
          </div>
        ))}
        {status === 'processing' && <p className="text-xs text-gray-400 animate-pulse">Pensando...</p>}
      </div>

      <div className="p-4 bg-gray-800 flex gap-2">
        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText, false)}
          placeholder="Escribe aquí..."
          className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-full outline-none"
          disabled={status !== 'idle'}
        />
        
        {inputText.length > 0 ? (
          <button onClick={() => handleSendMessage(inputText, false)} className="p-3 bg-blue-600 rounded-full">➤</button>
        ) : (
          <button onClick={toggleMic} className={`p-3 rounded-full ${status === 'listening' ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`}>
            {status === 'listening' ? '⏹' : '🎙'}
          </button>
        )}
      </div>
    </div>
  );
}