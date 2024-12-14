"use strict";

function handleEnterAsButtonClick(event) {
    event.preventDefault();
    translateText();
}

async function translateText() {
    const text = document.getElementById('text').value;
    const errorElement = document.getElementById('error');
    const resultElement = document.getElementById('result');
    const outputElement = document.getElementById('output');
    outputElement.style.display = 'none';
    resultElement.textContent = '';

    errorElement.style.display = 'none';
    errorElement.textContent = '';

    if (text.trim() === '') {
        errorElement.textContent = 'Text field is empty. Please enter your text.';
        errorElement.style.display = 'block';
        return;
    }

    // Fetch translation
    try {
        const response = await fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `text=${encodeURIComponent(text)}`,
        });

        const data = await response.json();

        // Check for error response containing only dots (When input is not in Latin letters)
        if (data.translated_text && /^[.\s]+$/.test(data.translated_text.trim())) {
            errorElement.textContent = 'Invalid input. Please enter text using Latin letters.';
            errorElement.style.display = 'block';
            outputElement.style.display = 'none';
            return;
        }

        // Update the translated_text or show an error
        if (data.error) {
            errorElement.textContent = data.error;
            errorElement.style.display = 'block';
            outputElement.style.display = 'none';
        } else {
            resultElement.textContent = data.translated_text;
            outputElement.style.display = 'block';
        }
    } catch (error) {
        errorElement.textContent = 'An unexpected error occurred. Please try again.';
        errorElement.style.display = 'block';
        outputElement.style.display = 'none';
    }
}