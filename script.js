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
        summaryDiv.textContent = '要約の生成に失敗しました。有効なURLを入力してください。';
        console.error('Error:', error);
    }
}
