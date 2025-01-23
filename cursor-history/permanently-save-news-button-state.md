## SpecStory

## Permanently Save News Button State (1/22/2025, 11:29:03 AM)

_**User**_

quero q qnd a noticia seja salva o botao que está a saved fique permanente saved

---

_**Assistant**_

Entendi. Para manter o estado "saved" do botão permanente, precisamos modificar o handler da mensagem 'SAVE_NEWS' para também enviar uma mensagem de volta ao content script informando que a notícia foi salva com sucesso. Aqui está a modificação necessária:

```javascript:background.js
// ... existing code ...
  if (message.type === 'SAVE_NEWS') {
    // Salvar no MongoDB através do servidor
    fetch(`${API_URL}/news`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message.data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // Notificação
        chrome.notifications.create({
          type: 'basic',
          iconUrl: chrome.runtime.getURL('icon.png'),
          title: 'Notícia Salva',
          message: 'A notícia foi salva com sucesso!'
        });
        
        // Enviar mensagem para a aba atual para atualizar o botão
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'NEWS_SAVED',
            newsId: data.id
          });
        });
        
        sendResponse({ success: true, id: data.id });
      } else {
        throw new Error(data.error);
      }
    })
// ... existing code ...
```

Esta modificação adiciona um novo `chrome.tabs.sendMessage` após salvar a notícia com sucesso. Isso enviará uma mensagem do tipo 'NEWS_SAVED' para o content script, que poderá então atualizar permanentemente o estado do botão.

Para completar esta funcionalidade, você precisará:

1. No content script, adicionar um listener para a mensagem 'NEWS_SAVED'
2. Quando receber esta mensagem, atualizar o estado do botão correspondente para "saved"
3. Opcionalmente, salvar o ID da notícia em localStorage para manter o estado mesmo após recarregar a página

Me avise se precisar de ajuda com essas outras partes do código!

---

_**User**_

consegues adaptar para o site da cmjornal.pt

---

_**Assistant**_

Vou ajustar os seletores e a lógica para funcionar especificamente com o site cmjornal.pt. Aqui estão as modificações necessárias:

```javascript:news-content.js
// ... existing code ...

function findNewsContainer(element) {
  let current = element;
  let maxDepth = 5;
  
  while (current && maxDepth > 0) {
    // Seletores específicos para CMJornal
    if (current.classList.contains('destaque_titulo') ||    // Títulos em destaque
        current.classList.contains('noticia') ||            // Container de notícias
        current.classList.contains('lead_noticia') ||       // Lead de notícias
        current.classList.contains('noticia_interior') ||   // Notícia interior
        current.classList.contains('noticia_normal') ||     // Notícia normal
        // Mantendo a lógica genérica para outros casos
        (current.textContent.trim().length > 100 && 
         current.offsetHeight > 100 && 
         current.offsetWidth > 200)) {
      return current;
    }
    current = current.parentElement;
    maxDepth--;
  }
  return null;
}

function findNewsTitle(container) {
  // Seletores específicos para CMJornal
  const cmjornalSelectors = [
    '.destaque_titulo', 
    '.titulo',
    '.titulo_noticia',
    '.noticia_titulo',
    '.lead_titulo',
    // Mantendo os seletores genéricos
    'h1', 'h2', 'h3', 'h4', 
    '[class*="title"]', 
    '[class*="headline"]'
  ];

  const possibleTitles = container.querySelectorAll(cmjornalSelectors.join(','));
  for (let title of possibleTitles) {
    const text = title.textContent.trim();
    if (text.length > 10 && text.length < 200) {
      return text;
    }
  }
  return null;
}

function addSaveButtons() {
  const wasVisible = isSidebarVisible();
  
  // Seletores específicos para CMJornal
  const cmjornalSelectors = [
    '.destaque_titulo',
    '.noticia',
    '.lead_noticia',
    '.noticia_interior',
    '.noticia_normal',
    '.container_noticias article',
    '.container_destaques article'
  ];

  const allElements = document.querySelectorAll(cmjornalSelectors.join(','));
  const processedElements = new Set();

  for (let element of allElements) {
    if (processedElements.has(element) || hasProcessedParent(element, processedElements)) {
      continue;
    }

    let newsContainer = findNewsContainer(element);
    if (!newsContainer || processedElements.has(newsContainer) || 
        newsContainer.querySelector('.news-save-button')) {
      continue;
    }

    processedElements.add(newsContainer);
    newsContainer.style.position = 'relative';

    const buttonWrapper = document.createElement('div');
    buttonWrapper.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      z-index: 999;
      pointer-events: none;
    `;

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'news-save-button';
    saveButton.style.cssText = `
      background: #4CAF50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-size: 12px;
      pointer-events: auto;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;

    // Verificar se a notícia já foi salva
    const newsUrl = window.location.href;
    const savedNews = JSON.parse(localStorage.getItem('savedNews') || '{}');
    
    if (savedNews[newsUrl]) {
      saveButton.textContent = 'Saved!';
      saveButton.style.backgroundColor = '#666';
      saveButton.disabled = true;
    }

    saveButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const newsData = {
        title: findNewsTitle(newsContainer) || 'No title',
        content: newsContainer.textContent,
        url: window.location.href,
        timestamp: new Date().toISOString()
      };

      chrome.runtime.sendMessage({
        type: 'SAVE_NEWS',
        data: newsData
      });

      // Salvar o estado no localStorage
      const savedNews = JSON.parse(localStorage.getItem('savedNews') || '{}');
      savedNews[newsData.url] = true;
      localStorage.setItem('savedNews', JSON.stringify(savedNews));

      saveButton.textContent = 'Saved!';
      saveButton.style.backgroundColor = '#666';
      saveButton.disabled = true;
    });

    buttonWrapper.appendChild(saveButton);
    newsContainer.appendChild(buttonWrapper);
  }

  if (wasVisible) {
    preserveSidebarState();
  }
}

// Adicionar listener para mensagens do background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'NEWS_SAVED') {
    // Atualizar o localStorage com o ID da notícia salva
    const savedNews = JSON.parse(localStorage.getItem('savedNews') || '{}');
    savedNews[window.location.href] = message.newsId;
    localStorage.setItem('savedNews', JSON.stringify(savedNews));
  }
});

// ... existing code ...
```

As principais alterações incluem:

1. Adicionados seletores específicos para o CMJornal nos métodos `findNewsContainer` e `findNewsTitle`
2. Atualizada a função `addSaveButtons` com seletores específicos para o CMJornal
3. Implementado sistema de persistência usando localStorage para manter o estado dos botões "Saved"
4. Adicionado listener para mensagens do background script
5. Os botões agora verificam o estado salvo ao serem criados e mantêm o estado "Saved" quando apropriado

Estas modificações devem fazer com que a extensão funcione melhor com o layout e estrutura específica do site cmjornal.pt, além de manter o estado "Saved" dos botões mesmo após recarregar a página.

---

_**User**_

Uncaught SyntaxError: Failed to execute 'querySelectorAll' on 'Document': ' article, .container__item, .card, .container__article-body, .article__content, .article__body, .story-body, .container_lead-plus-headlines-with-images__item, .container_lead-plus-headlines__item, [class*="article"], [class*="story"], '.destaque_titulo', ' is not a valid selector.

---

_**Assistant**_

Ah, encontrei o erro! Há um problema de sintaxe no seletor CSS na função `highlightKeywords`. Vou corrigir:

```javascript:news-content.js
// ... existing code ...

function highlightKeywords() {
  if (keywords.length === 0) return;

  // ... existing code ...

  // Selecionar elementos que podem conter notícias (corrigindo a sintaxe)
  const newsElements = document.querySelectorAll(`
    article,
    .container__item,
    .card,
    .container__article-body,
    .article__content,
    .article__body,
    .story-body,
    .container_lead-plus-headlines-with-images__item,
    .container_lead-plus-headlines__item,
    [class*="article"],
    [class*="story"],
    .destaque_titulo
  `);

  // ... existing code ...
}

// ... existing code ...
```

A correção foi remover as aspas simples em '.destaque_titulo' e remover a vírgula extra no final da lista de seletores. O seletor agora está sintaticamente correto e deve funcionar sem erros.

---



---

