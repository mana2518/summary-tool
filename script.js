async function summarizePage() {
    const urlInput = document.getElementById('urlInput');
    const summaryDiv = document.getElementById('summary');
    const statusMessage = document.querySelector('.status-message');
    
    // ステータスメッセージをクリア
    statusMessage.textContent = '';
    statusMessage.classList.remove('show');
    
    try {
        // URLのバリデーション
        if (!urlInput.value) {
            throw new Error('URLを入力してください');
        }

        // URLの形式チェック
        if (!urlInput.value.startsWith('http://') && !urlInput.value.startsWith('https://')) {
            throw new Error('有効なURLを入力してください（http://またはhttps://から始まるURL）');
        }

        // プロキシサービスを使用してURLからHTMLを取得
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' + urlInput.value;
        const response = await fetch(proxyUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`URLの読み込みに失敗しました: ${response.status}`);
        }

        const text = await response.text();
        
        // HTMLからテキストを抽出
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        
        // メインコンテンツを抽出
        const content = [];
        
        // WordPressの記事コンテンツを抽出
        const article = doc.querySelector('article');
        if (article) {
            const paragraphs = article.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    content.push(text);
                }
            });
        }
        
        // 通常のHTMLコンテンツを抽出
        if (content.length === 0) {
            const paragraphs = doc.querySelectorAll('p');
            paragraphs.forEach(p => {
                const text = p.textContent.trim();
                if (text) {
                    content.push(text);
                }
            });
        }
        
        if (content.length === 0) {
            throw new Error('コンテンツが見つかりませんでした');
        }
        
        const fullText = content.join(' ').replace(/\s+/g, ' ').trim();
        
        // 単純な要約処理
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
            throw new Error('要約を生成できませんでした');
        }
    } catch (error) {
        statusMessage.textContent = error.message;
        statusMessage.classList.add('show');
        console.error('Error:', error);
    }
}

// ダークモードの切り替え
function toggleDarkMode() {
    const html = document.documentElement;
    const darkModeToggle = document.getElementById('darkModeToggle');
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    if (isDark) {
        html.removeAttribute('data-theme');
        darkModeToggle.title = 'ダークモードを切り替え';
    } else {
        html.setAttribute('data-theme', 'dark');
        darkModeToggle.title = 'ライトモードを切り替え';
    }
    
    // ローカルストレージに保存
    localStorage.setItem('darkMode', isDark ? 'false' : 'true');
}

// ページ読み込み時にダークモードの状態を復元
window.addEventListener('DOMContentLoaded', () => {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('darkModeToggle').title = 'ライトモードを切り替え';
    }
});
