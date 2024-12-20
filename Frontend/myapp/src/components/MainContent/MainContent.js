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

    const formatAssistantMessage = (content) => {
        return content.split('\n').map((line, index) => {
            // Handle lines that start with an asterisk (bullet points)
            if (line.trim().startsWith('*')) {
                // Remove the asterisk and trim the space
                let bulletText = line.trim().substring(1).trim();
                
                // Handle any bold text within the bullet point
                const boldPattern = /\*\*(.*?)\*\*/g;
                const containsBold = bulletText.match(boldPattern);
                
                if (containsBold) {
                    // Replace the bold pattern and create elements
                    const elements = bulletText.split(boldPattern).map((part, i) => {
                        if (i % 2 === 1) {  // This is the bold part
                            return <strong key={`bold-${i}`}>{part}</strong>;
                        }
                        return part;
                    });
                    
                    return (
                        <div key={index} className={styles.bulletContainer}>
                            <span className={styles.bullet}>•</span>
                            <span className={styles.bulletText}>{elements}</span>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className={styles.bulletContainer}>
                            <span className={styles.bullet}>•</span>
                            <span className={styles.bulletText}>{bulletText}</span>
                        </div>
                    );
                }
            }
            // Handle regular text (might contain bold)
            else if (line.trim()) {
                const boldPattern = /\*\*(.*?)\*\*/g;
                const containsBold = line.match(boldPattern);
                
                if (containsBold) {
                    const elements = line.split(boldPattern).map((part, i) => {
                        if (i % 2 === 1) {  // This is the bold part
                            return <strong key={`bold-${i}`}>{part}</strong>;
                        }
                        return part;
                    });
                    
                    return (
                        <div key={index} className={styles.paragraph}>
                            {elements}
                        </div>
                    );
                }
                
                return (
                    <div key={index} className={styles.paragraph}>
                        {line}
                    </div>
                );
            }
            return null;
        }).filter(Boolean);
    };

    // Change to:
return (
    <div className={styles.mainContent}>
        {messages.map((message, index) => (
                <div 
                    key={index} 
                    className={`${styles.message} ${styles[message.type]}`}
                >
                    {message.type === 'user' && (
                        <div className={styles.avatar}>You</div>
                    )}
                    {message.type === 'assistant' && (
                        <div className={styles.assistantAvatar}>
                            <img src="avatar.png" alt="AI" className={styles.aiIcon} />
                        </div>
                    )}
            <div className={message.type === 'system' ? styles.systemMessage : styles.messageContent}>
                        {message.type === 'assistant' ? (
                            <div className={styles.formattedContent}>
                                {formatAssistantMessage(message.content)}
                            </div>
                        ) : (
                            message.content
                        )}
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
