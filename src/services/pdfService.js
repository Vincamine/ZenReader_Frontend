const API_ENDPOINT = 'http://127.0.0.1:5000/api/execute';

/**
 * Send extracted text to the backend for processing.
 * @param {string} text - Extracted PDF text.
 * @returns {Promise<string>} - HTML response from backend.
 */
export const processPDFText = async (text) => {
    console.log('Sending this JSON to backend:', JSON.stringify({ text }));

    const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
    });

    console.log('Request sent. Waiting for response...');

    const result = await response.json();
    console.log('Received response from backend:', result);

    return result.HTML;
};
