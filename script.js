async function summarizePage() {
    const urlInput = document.getElementById('urlInput');
    const summaryDiv = document.getElementById('summary');
    const statusMessage = document.querySelector('.status-message');
    
    if (!urlInput.value) {
        statusMessage.textContent = 'URLを入力してください';
        statusMessage.classList.add('show');
        return;
    }
    
    try {
        // ステータスメッセージをクリア
        statusMessage.textContent = '';
        statusMessage.classList.remove('show');
        
        // URLからHTMLを取得
        const response = await fetch(urlInput.value);
        if (!response.ok) {
            throw new Error(`URLの読み込みに失敗しました: ${response.status}`);
        }
        
        const text = await response.text();
        
        // HTMLからテキストを抽出
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const content = doc.body.textContent || '';
        
        // 単純な要約処理（Gemini APIの代わり）
        const sentences = content.split(/[。！？]/).filter(sentence => sentence.trim());
        const importantSentences = [];
        let currentLength = 0;
        
        for (const sentence of sentences) {
            if (currentLength + sentence.length <= 200) {
                importantSentences.push(sentence);
                currentLength += sentence.length;
            } else {
                break;
            }
        }
        
        const summary = importantSentences.join('。') + '。';
        summaryDiv.textContent = summary;
    } catch (error) {
        statusMessage.textContent = error.message || '要約の生成に失敗しました。';
        statusMessage.classList.add('show');
        console.error('Error:', error);
    }
}
