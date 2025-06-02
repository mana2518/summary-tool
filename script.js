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
        
        // プロキシサーバーを通じてURLからHTMLを取得
        const proxyUrl = 'https://your-proxy-server.com/proxy?url=' + encodeURIComponent(urlInput.value);
        const response = await fetch(proxyUrl, {
            method: 'GET'
        });
        
        if (!response.ok) {
            throw new Error(`URLの読み込みに失敗しました: ${response.status}`);
        }
        
        const text = await response.text();
        
        // HTMLからテキストを抽出
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // WordPressの記事コンテンツを取得
        const content = [];
        const mainContent = doc.querySelector('article, .entry-content, .post-content');
        if (mainContent) {
            // WordPressの記事コンテンツを抽出
            const paragraphs = mainContent.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    content.push(text);
                }
            });
        } else {
            // 通常のHTMLコンテンツを抽出
            content.push(doc.body.textContent.trim());
        }
        
        const fullText = content.join(' ').replace(/\s+/g, ' ').trim();
        
        // 単純な要約処理（Gemini APIの代わり）
        const sentences = fullText.split(/[。！？]/).filter(sentence => sentence.trim());
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
        if (summary.trim()) {
            summaryDiv.textContent = summary;
        } else {
            throw new Error('コンテンツが見つかりませんでした');
        }
    } catch (error) {
        statusMessage.textContent = error.message || '要約の生成に失敗しました。';
        statusMessage.classList.add('show');
        console.error('Error:', error);
    }
}
