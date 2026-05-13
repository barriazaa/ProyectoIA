// ==========================================
// js/chat.js - Conexión con Ollama Local
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const btnSend = document.querySelector('.chat-input-group button');
    const inputChat = document.querySelector('.chat-input-group input');
    const chatArea = document.querySelector('.chat-area');

    function appendMessage(sender, text, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'msg-ia';
        
        if (sender === 'Usuario') {
            msgDiv.style.background = '#f1f2f6';
            msgDiv.style.borderLeft = '3px solid #747d8c';
            msgDiv.innerHTML = `<strong>👤 Tú:</strong> ${text}`;
        } else {
            msgDiv.style.background = isError ? '#ffeaa7' : '#ffffff';
            msgDiv.style.borderLeft = isError ? '3px solid #e17055' : '3px solid #002b5c';
            msgDiv.innerHTML = `<strong>🤖 Tutor UMG:</strong><br>${text}`;
        }
        
        chatArea.appendChild(msgDiv);
        chatArea.scrollTop = chatArea.scrollHeight; 
    }

    async function sendMessageToOllama(prompt) {
        appendMessage('Usuario', prompt);
        inputChat.value = ''; 
        
        const loadingId = 'loading-' + Date.now();
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'msg-ia';
        loadingDiv.id = loadingId;
        loadingDiv.innerHTML = `<em>Pensando la respuesta... ⏳</em>`;
        chatArea.appendChild(loadingDiv);
        chatArea.scrollTop = chatArea.scrollHeight;

        try {
            const systemPrompt = `Eres un tutor de Machine Learning de la UMG. Tu objetivo es dar respuestas EXTREMADAMENTE CORTAS y al grano.

CONTEXTO ACTUAL DEL EJERCICIO:
- Pendiente (m): ${m}
- Intercepto (b): ${b}
- Tasa (alpha): ${alpha}

REGLAS ESTRICTAS DE RESPUESTA:
1. Responde en máximo 2 o 3 oraciones cortas. (Menos de 40 palabras).
2. NUNCA des introducciones largas ni conclusiones. Ve directo a la respuesta.
3. Si el usuario pregunta cómo se calcula algo, da una definición de 1 línea y muestra la operación matemática exacta.
4. Usa este formato de ejemplo si te preguntan por el Error: "El error es la diferencia entre nuestra predicción y el valor real. Se calcula así: Error = Y_sombrerito - Y_real."

Pregunta del estudiante: ${prompt}`;

            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'qwen2.5-coder:1.5b',
                    prompt: systemPrompt,
                    stream: false
                })
            });

            if (!response.ok) throw new Error("Error en conexión");
            const data = await response.json();
            
            document.getElementById(loadingId).remove();
            appendMessage('IA', data.response);

        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage('IA', 'Asegúrate de tener Ollama corriendo en tu computadora.', true);
        }
    }

    btnSend.addEventListener('click', () => {
        const text = inputChat.value.trim();
        if (text) sendMessageToOllama(text);
    });

    inputChat.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const text = inputChat.value.trim();
            if (text) sendMessageToOllama(text);
        }
    });
});