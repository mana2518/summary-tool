async function summarizePage() {
    const urlInput = document.getElementById('urlInput');
    const summaryDiv = document.getElementById('summary');
    
    if (!urlInput.value) {
        alert('URLを入力してください');
        return;
    }

    try {
        // URLからHTMLを取得
        const response = await fetch(urlInput.value);
        const text = await response.text();
        
        // HTMLからテキストを抽出
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const content = doc.body.textContent || '';
        
        // Gemini APIを使用して要約を生成
        const apiKey = 'AIzaSyBqfgxql9e95axY6v3nIoDD7gk9qJoDvuQ';
        const model = 'gemini-pro';
        
        // 要約生成のプロンプト
        const prompt = `以下のテキストを日本語で要約してください。要約は小学生でも理解できるような簡潔な1文で、主観や感想は含めず、事実ベースで表現してください。

テキスト:
${content}

要約:`;
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        const summary = data.candidates[0]?.content?.parts[0]?.text || '要約の生成に失敗しました。';
        
        summaryDiv.textContent = summary;
    } catch (error) {
        summaryDiv.textContent = '要約の生成に失敗しました。有効なURLを入力してください。';
        console.error('Error:', error);
    }
}

async function generateSummary(text) {
    try {
        // Gemini APIを使用して要約を生成
        const apiKey = 'AIzaSyBqfgxql9e95axY6v3nIoDD7gk9qJoDvuQ';
        const model = 'gemini-pro';
        
        // 要約生成のプロンプト
        const prompt = `以下のテキストを日本語で要約してください。要約は小学生でも理解できるような簡潔な1文で、主観や感想は含めず、事実ベースで表現してください。

テキスト:
${text}

要約:`;
        
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });
        
        const data = await response.json();
        
        // 要約の抽出
        const summary = data.candidates[0]?.content?.parts[0]?.text || '要約の生成に失敗しました';
        
        return summary;
    } catch (error) {
        console.error('Gemini API Error:', error);
        return '要約の生成に失敗しました。';
    }
}
