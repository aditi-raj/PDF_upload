// import React from 'react';
// import styles from './ChatInput.module.css';

// function ChatInput() {
//     return (
//         <div className={styles.chatInput}>
//           <input type="text" placeholder="Send a meassage..." className={styles.input} />
//           <button className={styles.sendButton}>
//             <img src="send-svgrepo-com.svg" alt="Send" className={styles.sendIcon}/>
//           </button>
//         </div>
//         );
//     }
    
// export default ChatInput;

import React, { useState } from 'react';
import styles from './ChatInput.module.css';

function ChatInput({ onSendMessage, disabled }) {
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message);
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

    