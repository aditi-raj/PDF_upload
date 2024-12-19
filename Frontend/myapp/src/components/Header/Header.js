// import React from 'react';
// import styles from './Header.module.css';

// function Header() {
//     return (
//         <header className={styles.header}>
//         <div className={styles.logo}>
//             <img src="AI Planet Logo.png" alt="AI Planet Logo" className={styles.logoImg} />  
//         </div>
//         <button className={styles.uploadButton}>
//             <span className={styles.plusSign}>+</span> Upload PDF
//         </button>

//         </header>
//     );
//     }

// export default Header;

import React, { useState } from 'react';
import styles from './Header.module.css';

function Header({ setUploadedFile }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        setError(null); // Clear previous errors
        
        if (file) {
            if (file.type === 'application/pdf') {
                setSelectedFile(file);
                setUploadedFile(file);
            } else {
                setError('Please select a PDF file');
                setSelectedFile(null); // Clear selected file
                event.target.value = null; // Reset file input
            }
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <img src="AI Planet Logo.png" alt="AI Planet Logo" className={styles.logoImg} />  
            </div>
            <div className={styles.rightSection}>
                {error && <span className={styles.errorMessage}>{error}</span>}
                {selectedFile && !error && (
                    <span className={styles.fileName}>
                        {selectedFile.name}
                    </span>
                )}
                <label htmlFor="file-upload" className={styles.uploadButton}>
                    <span className={styles.plusSign}>+</span> Upload PDF
                    <input
                        id="file-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                    />
                </label>
            </div>
        </header>
    );
}

export default Header;