// import React from 'react';
// import styles from './MainContent.module.css';

// function MainContent() {
//     return (
//     <div className={styles.mainContent}>
//         {/* Messages will go here */}
//     </div>
//     );
//     }
    
//     export default MainContent;

import React, { useRef, useEffect } from 'react';
import styles from './MainContent.module.css';

function MainContent({ messages, isLoading }) {
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className={styles.mainContent}>
            {messages.length === 0 && (
                <div className={styles.emptyState}>
                    Upload a PDF and ask questions about it!
                </div>
            )}
            {messages.map((message, index) => (
                <div 
                    key={index} 
                    className={`${styles.message} ${styles[message.type]}`}
                >
                    {message.type === 'user' && (
                        <div className={styles.avatar}>You</div>
                    )}
                    {message.type === 'assistant' && (
                        <div className={styles.avatar}>AI</div>
                    )}
                    <div className={styles.messageContent}>
                        {message.content}
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className={styles.loading}>
                    <div className={styles.loadingDots}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default MainContent;
