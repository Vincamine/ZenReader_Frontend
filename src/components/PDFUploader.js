import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.entry'; // ✅ Worker import for pdfjs 2.16.105
import { processPDFText } from '../services/pdfService';    // ✅ Backend service function

// ✅ Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const PDFUploader = () => {
    // Component state
    const [htmlResponse, setHtmlResponse] = useState(''); // Stores returned HTML
    const [loading, setLoading] = useState(false);        // Loading state

    /**
     * Handles file upload event.
     * @param {Event} e - Change event from input[type=file]
     */
    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            const extractedText = await extractTextFromPDF(file); // ✅ Extract text from PDF
            const html = await processPDFText(extractedText);     // ✅ Send text to backend, get HTML
            setHtmlResponse(html);                                // ✅ Update UI with returned HTML
        } catch (error) {
            console.error('Error handling file:', error);
        }

        setLoading(false);
    };

    /**
     * Extracts text from the uploaded PDF file.
     * @param {File} file - PDF file to be processed.
     * @returns {Promise<string>} Extracted text from the PDF.
     */
    const extractTextFromPDF = async (file) => {
        const reader = new FileReader();

        return new Promise((resolve, reject) => {
            reader.onload = async () => {
                try {
                    const typedArray = new Uint8Array(reader.result);
                    const pdf = await pdfjsLib.getDocument({ data: typedArray }).promise;

                    let extractedText = '';
                    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                        const page = await pdf.getPage(pageNum);
                        const content = await page.getTextContent();
                        const pageText = content.items.map(item => item.str).join(' ');
                        extractedText += pageText + '\n';
                    }

                    resolve(extractedText);
                } catch (err) {
                    reject(err);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div style={styles.container}>
            <h2>Upload PDF</h2>

            {/* File Input */}
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFile}
                style={styles.fileInput}
            />

            {/* Loading Message */}
            {loading && <p>Processing PDF, please wait...</p>}

            {/* Render HTML from backend */}
            <div
                style={styles.htmlOutput}
                dangerouslySetInnerHTML={{ __html: htmlResponse }}
            />
        </div>
    );
};

export default PDFUploader;

// ✅ Inline Styles (or move to CSS if preferred)
const styles = {
    container: {
        marginTop: '30px',
        textAlign: 'center',
    },
    fileInput: {
        margin: '20px 0',
    },
    htmlOutput: {
        marginTop: '30px',
        padding: '20px',
        border: '1px solid #ddd',
        background: '#f9f9f9',
        minHeight: '200px',
        textAlign: 'left',
    },
};
