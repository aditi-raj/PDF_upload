// import React, { useState } from 'react';
// import styles from './ChatInput.module.css';

// function ChatInput({ onSendMessage, disabled }) {
//     const [message, setMessage] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (message.trim() && !disabled) {
//             try {
//                 const response = await fetch('http://localhost:8000/ask', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         question: message.trim()
//                     }),
//                 });

//                 if (!response.ok) {
//                     throw new Error('Failed to get answer');
//                 }

//                 const data = await response.json();
//                 onSendMessage(message, data.answer);
//                 setMessage('');
//             } catch (error) {
//                 console.error('Error:', error);
//                 onSendMessage(message, "Sorry, I couldn't process your question. Please try again.");
//             }
//         }
//     };

//     return (
//         <form className={styles.chatInput} onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder={disabled ? "Upload a PDF to start asking questions..." : "Ask a question about the PDF..."}
//                 disabled={disabled}
//                 className={styles.input}
//             />
//             <button 
//                 type="submit" 
//                 disabled={disabled || !message.trim()}
//                 className={styles.sendButton}
//                 aria-label="Send message"
//             >
//                 <img 
//                     src="send-svgrepo-com.svg" 
//                     alt="Send" 
//                     className={styles.sendIcon}
//                 />
//             </button>
//         </form>
//     );
// }

// export default ChatInput;

import React, { useState, useCallback } from 'react';
import styles from './ChatInput.module.css';
import _ from 'lodash';

function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('');

    const debouncedSendMessage = useCallback(
        _.debounce(async (message) => {
            try {
                const response = await fetch('http://localhost:8000/ask', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        question: message.trim()
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to get answer');
                }

                const data = await response.json();
                onSendMessage(message, data.answer);
            } catch (error) {
                console.error('Error:', error);
                onSendMessage(message, "Sorry, I couldn't process your question. Please try again.");
            }
        }, 1000), // 1 second delay
        [onSendMessage]
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            debouncedSendMessage(message);
            setMessage('');
        }
    };

    return (
        <form className={styles.chatInput} onSubmit={handleSubmit}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={disabled ? "Upload a PDF to start asking questions..." : "Ask a question about the PDF..."}
                disabled={disabled}
                className={styles.input}
            />
            <button 
                type="submit" 
                disabled={disabled || !message.trim()}
                className={styles.sendButton}
                aria-label="Send message"
            >
                <img 
                    src="send-svgrepo-com.svg" 
                    alt="Send" 
                    className={styles.sendIcon}
                />
            </button>
        </form>
    );
}

export default ChatInput;