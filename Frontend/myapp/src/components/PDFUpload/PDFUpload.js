import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './PDFUpload.css';

function PDFUpload({ setUploadedFile, setLoading, setError }) {
    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file?.type !== 'application/pdf') {
            setError('Please upload a PDF file');
            return;
        }

        setLoading(true);
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
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [setUploadedFile, setLoading, setError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {'application/pdf': ['.pdf']},
        multiple: false
    });

    return (
        <div {...getRootProps()} className="pdf-upload-container">
            <input {...getInputProps()} />
            <div className="upload-content">
                <img src="/upload-icon.svg" alt="Upload" className="upload-icon" />
                {isDragActive ? (
                    <p>Drop the PDF file here...</p>
                ) : (
                    <div className="upload-text">
                        <p>Drag & drop a PDF file here, or click to select one</p>
                        <p className="upload-hint">Supported formats: PDF</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PDFUpload;