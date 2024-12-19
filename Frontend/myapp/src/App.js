
// import React, { useState } from 'react';
// import './App.css';
// import Header from './components/Header/Header';
// import ChatInput from './components/ChatInput/ChatInput';
// import MainContent from './components/MainContent/MainContent';

// function App() {
//     const [uploadedFile, setUploadedFile] = useState(null);

//     // Add this to handle uploaded file
//     const handleFileUpload = (file) => {
//         setUploadedFile(file);
//         console.log("File uploaded:", file);
//     };

//     return (
//         <div className='app-container'>
//             <Header setUploadedFile={handleFileUpload} />
//             <MainContent fileData={uploadedFile} /> {/* Pass the file data */}
//             <ChatInput />
//         </div>
//     );
// }

// export default App;

import React, { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import ChatInput from './components/ChatInput/ChatInput';
import MainContent from './components/MainContent/MainContent';

function App() {
    const [uploadedFile, setUploadedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle file upload
    const handleFileUpload = async (file) => {
        setIsLoading(true);
        setError(null);
        
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setUploadedFile(data);
            // Add system message after successful upload
            setMessages(prev => [...prev, {
                type: 'system',
                content: `PDF "${file.name}" uploaded successfully. You can now ask questions about it.`
            }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Handle sending questions
    const handleSendMessage = async (question) => {
        if (!uploadedFile) {
            setError('Please upload a PDF first');
            return;
        }

        // Add user question to messages
        setMessages(prev => [...prev, { type: 'user', content: question }]);
        setIsLoading(true);
        
        try {
            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    file_id: uploadedFile.id,
                    question: question
                }),
            });

            if (!response.ok) throw new Error('Failed to get answer');

            const data = await response.json();
            setMessages(prev => [...prev, { type: 'assistant', content: data.answer }]);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='app-container'>
            <Header 
                setUploadedFile={handleFileUpload} 
                isLoading={isLoading}
                error={error}
            />
            <MainContent 
                messages={messages} 
                isLoading={isLoading} 
            />
            <ChatInput 
                onSendMessage={handleSendMessage}
                disabled={!uploadedFile || isLoading}
            />
        </div>
    );
}

export default App;