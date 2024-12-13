
from flask import Flask, request, jsonify, render_template
from transformers import pipeline

app = Flask(__name__)
pipe = pipeline("translation", model="Helsinki-NLP/opus-mt-en-fi")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    text = request.form.get('text')
    if not text:
        return jsonify({"error": "Text field is empty. Please enter your text."}), 400
    
    try:
        translated_text = pipe(text, max_length=512)[0]['translation_text']
        return jsonify({"translated_text": translated_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
