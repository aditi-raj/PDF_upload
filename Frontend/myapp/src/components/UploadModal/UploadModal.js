import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './UploadModal.css';

function UploadModal({ isOpen, onClose, setUploadedFile }) {
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        
        if (file?.type !== 'application/pdf') {
            alert('Please upload a PDF file');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('http://localhost:8000/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');

            const data = await response.json();
            setUploadedFile(data);
            onClose();
        } catch (err) {
            alert(err.message);
        }
    }, [onClose, setUploadedFile]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        multiple: false
    });

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                <h2>Upload PDF</h2>
                <div {...getRootProps()} className={styles.dropzone}>
                    <input {...getInputProps()} />
                    <img src="/upload-icon.svg" alt="Upload" className={styles.uploadIcon} />
                    {isDragActive ? (
                        <p>Drop the PDF file here...</p>
                    ) : (
                        <>
                            <p>Drag & drop a PDF file here</p>
                            <p className={styles.orText}>OR</p>
                            <button className={styles.browseButton}>Browse Files</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default UploadModal;