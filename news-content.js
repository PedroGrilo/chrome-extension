// Array global para keywords
let keywords = [];

// Criar o popup de keywords fixo no lado esquerdo
function createKeywordsPanel() {
  const panel = document.createElement('div');
  panel.style.cssText = `
    position: fixed;
    left: -300px;
    top: 0;
    width: 250px;
    height: 100vh;
    background: white;
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    z-index: 10000;
    transition: left 0.3s ease;
    padding: 20px;
    font-family: Arial, sans-serif;
  `;

  // Botão toggle
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'Keywords Panel';
  toggleButton.style.cssText = `
    position: fixed;
    left: 20px;
    top: 60px;
    padding: 10px 20px;
    background: #9c27b0;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    z-index: 10001;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;

  // Conteúdo do painel
  panel.innerHTML = `
    <h3 style="margin: 0 0 15px 0; color: #333;">News Keywords</h3>
    <div style="margin-bottom: 20px;">
      <input type="text" id="keywordInput" placeholder="Enter keyword" style="
        width: 70%;
        padding: 8px;
        border: 2px solid #e0e0e0;
        border-radius: 4px;
        font-size: 13px;
        margin-right: 5px;
      ">
      <button id="addKeyword" style="
        background: #9c27b0;
        color: white;
        border: none;
        padding: 8px 12px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      ">Add</button>
    </div>
    <div id="keywordsList" style="
      margin-bottom: 15px;
      max-height: calc(100vh - 250px);
      overflow-y: auto;
    "></div>
    <div style="
      display: flex;
      gap: 10px;
    ">
      <button id="applyKeywords" style="
        flex: 1;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      ">Apply Highlights</button>
      <button id="removeHighlights" style="
        flex: 1;
        background: #ff5252;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      ">Remove All</button>
    </div>
  `;

  // Toggle do painel
  let isPanelOpen = false;
  toggleButton.addEventListener('click', () => {
    isPanelOpen = !isPanelOpen;
    panel.style.left = isPanelOpen ? '0' : '-300px';
    toggleButton.style.left = isPanelOpen ? '270px' : '20px';
    toggleButton.textContent = isPanelOpen ? 'Close Panel' : 'Keywords Panel';
  });

  // Funções do painel
  function updateKeywordsList() {
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = keywords.map(keyword => `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background: #f5f5f5;
        margin-bottom: 5px;
        border-radius: 4px;
      ">
        <span style="font-size: 13px;">${keyword}</span>
        <button data-keyword="${keyword}" style="
          background: none;
          border: none;
          color: #ff5252;
          cursor: pointer;
          font-size: 18px;
          padding: 0 5px;
        ">×</button>
      </div>
    `).join('');

    // Adicionar event listeners para remover keywords
    keywordsList.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const keywordToRemove = button.dataset.keyword;
        keywords = keywords.filter(k => k !== keywordToRemove);
        updateKeywordsList();
      });
    });
  }

  // Adicionar ao DOM
  document.body.appendChild(panel);
  document.body.appendChild(toggleButton);

  // Event listeners
  document.getElementById('addKeyword').addEventListener('click', () => {
    const input = document.getElementById('keywordInput');
    const keyword = input.value.trim();
    if (keyword && !keywords.includes(keyword)) {
      keywords.push(keyword);
      input.value = '';
      updateKeywordsList();
    }
  });

  document.getElementById('keywordInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      document.getElementById('addKeyword').click();
    }
  });

  document.getElementById('applyKeywords').addEventListener('click', () => {
    highlightKeywords();
  });

  // Função atualizada para remover highlights
  function removeAllHighlights() {
    // Remover todos os elementos com fundo amarelo claro
    const highlightedElements = document.querySelectorAll('[style*="background-color"]');
    highlightedElements.forEach(element => {
      // Remover todos os estilos adicionados
      element.style.removeProperty('background-color');
      element.style.removeProperty('padding');
      element.style.removeProperty('border-radius');
      element.style.removeProperty('border');
      element.style.removeProperty('box-shadow');
      element.style.removeProperty('transition');
    });

    // Remover todos os indicadores de keyword
    const indicators = document.querySelectorAll('.keyword-indicator');
    indicators.forEach(indicator => indicator.remove());
  }

  // Adicionar event listener para o botão de remover
  const removeButton = document.getElementById('removeHighlights');
  if (removeButton) {
    removeButton.addEventListener('click', () => {
      console.log('Remove button clicked'); // Debug
      removeAllHighlights();
    });
  }
}

// Função para destacar keywords de forma segura
function highlightKeywords() {
  if (keywords.length === 0) return;

  // Função para verificar se é seguro modificar o elemento
  function isSafeToModify(element) {
    return (
      !element.querySelector('img') && 
      !element.querySelector('video') && 
      !element.querySelector('script') && 
      !element.querySelector('style') && 
      !element.querySelector('source') && 
      !element.classList.contains('image') && 
      !element.classList.contains('video')
    );
  }

  // Função para verificar se o texto contém alguma keyword
  function containsKeyword(text) {
    return keywords.some(keyword => 
      text.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Selecionar elementos que podem conter notícias
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
    .destaque_titulo,
    [class*="article"],
    [class*="story"]
  `);

  newsElements.forEach(element => {
    if (isSafeToModify(element)) {
      try {
        const text = element.textContent;
        
        if (containsKeyword(text)) {
          // Destacar o elemento inteiro
          element.style.backgroundColor = '#fff7d6'; // Amarelo claro suave
          element.style.padding = '10px';
          element.style.borderRadius = '5px';
          element.style.border = '2px solid #ffd700'; // Borda dourada
          element.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
          element.style.transition = 'all 0.3s ease';
          
          // Adicionar um indicador de keyword encontrada
          const keywordIndicator = document.createElement('div');
          keywordIndicator.style.cssText = `
            background: #ffd700;
            color: #000;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            font-weight: bold;
            margin-bottom: 10px;
            display: inline-block;
          `;
          keywordIndicator.textContent = 'Keyword Found!';
          
          // Inserir o indicador no início do elemento
          if (!element.querySelector('.keyword-indicator')) {
            keywordIndicator.className = 'keyword-indicator';
            element.insertBefore(keywordIndicator, element.firstChild);
          }
        }
      } catch (error) {
        console.log('Error highlighting element:', error);
      }
    }
  });
}

// Inicialização
function init() {
  createKeywordsPanel();
  addSaveButtons();
  setupObserver();
}

// Funções auxiliares globais
function hasProcessedParent(element, processedSet) {
  let parent = element.parentElement;
  while (parent) {
    if (processedSet.has(parent)) {
      return true;
    }
    parent = parent.parentElement;
  }
  return false;
}

function findNewsContainer(element) {
  let current = element;
  let maxDepth = 5;
  
  while (current && maxDepth > 0) {
    console.log('Checking element:', current.className, current.classList.contains('destaque_titulo'));
    // Specific selectors for CMJornal
    if (current.classList.contains('destaque_titulo') ||   // CMJornal main title
        current.classList.contains('article') ||           // CMJornal articles
        current.classList.contains('newsfeed-entry') ||    // CMJornal news feed
        current.classList.contains('news-item') ||         // CMJornal news items
        current.classList.contains('destaque') ||          // CMJornal highlights
        current.classList.contains('noticia')) {           // CMJornal news
      console.log('Found news container:', current.className);
      return current;
    }
    current = current.parentElement;
    maxDepth--;
  }
  return null;
}

function findNewsTitle(container) {
  console.log('Looking for title in container:', container.className);

  // First, try to find directly by destaque_titulo class
  const destaqueTitle = container.querySelector('.destaque_titulo');
  console.log('Found destaque_titulo?', !!destaqueTitle);
  
  if (destaqueTitle) {
    const link = destaqueTitle.querySelector('a');
    console.log('Found link in destaque_titulo?', !!link);
    if (link) {
      return link.textContent.trim();
    }
    return destaqueTitle.textContent.trim();
  }

  // If not found, try other selectors
  const possibleTitles = container.querySelectorAll([
    '.destaque_titulo',      // CMJornal main title
    '.destaque_titulo > a',  // Links inside title
    '.title',
    '.headline',
    '.titulo',              // title
    '.titulo-noticia',      // news title
    '.titulo-destaque'      // highlight title
  ].join(','));

  console.log('Number of possible titles found:', possibleTitles.length);
  
  for (let title of possibleTitles) {
    const text = title.textContent.trim();
    console.log('Checking title text:', text);
    if (text.length > 10 && text.length < 200) {
      return text;
    }
  }
  return null;
}

function getTextNodes(node) {
  const textNodes = [];
  const walk = document.createTreeWalker(
    node,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  let n;
  while (n = walk.nextNode()) textNodes.push(n);
  return textNodes;
}

// Função para verificar se a sidebar está visível
function isSidebarVisible() {
  const sidebar = document.querySelector('div[style*="position: fixed"][style*="right: 0"]');
  return sidebar && sidebar.style.transform === 'translateX(0px)';
}

// Função para garantir que a sidebar mantenha seu estado
function preserveSidebarState() {
  const sidebar = document.querySelector('div[style*="position: fixed"][style*="right: 0"]');
  if (sidebar) {
    const wasVisible = isSidebarVisible();
    if (wasVisible) {
      sidebar.style.transform = 'translateX(0px)';
    }
  }
}

// Modify addSaveButtons function to preserve sidebar state
function addSaveButtons() {
  console.log('Starting addSaveButtons');
  const wasVisible = isSidebarVisible();
  
  // Specific selectors for CMJornal
  const newsSelectors = [
    '.destaque_titulo',    // main title
    'article',
    '.article',
    '.newsfeed-entry',
    '.news-item',
    '.destaque',          // highlight
    '.noticia'            // news
  ];

  console.log('Looking for elements with selectors:', newsSelectors.join(', '));
  const allElements = document.querySelectorAll(newsSelectors.join(','));
  console.log('Found elements:', allElements.length);

  const processedElements = new Set();

  for (let element of allElements) {
    console.log('Processing element:', element.className);
    
    if (processedElements.has(element) || hasProcessedParent(element, processedElements)) {
      console.log('Element already processed or has processed parent, skipping');
      continue;
    }

    let newsContainer = findNewsContainer(element);
    console.log('Found news container?', !!newsContainer);
    
    if (!newsContainer || processedElements.has(newsContainer) || 
        newsContainer.querySelector('.news-save-button')) {
      console.log('Container invalid, already processed, or already has button');
      continue;
    }

    console.log('Adding save button to container');
    processedElements.add(newsContainer);
    newsContainer.style.position = 'relative';

    // Create button wrapper
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

    // Prevent click propagation
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

      saveButton.textContent = 'Saved!';
      saveButton.style.backgroundColor = '#666';
      setTimeout(() => {
        saveButton.textContent = 'Save';
        saveButton.style.backgroundColor = '#4CAF50';
      }, 2000);
    });

    // Prevent clicks on links under the button
    saveButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    buttonWrapper.appendChild(saveButton);
    newsContainer.appendChild(buttonWrapper);
  }

  // Restore sidebar state if necessary
  if (wasVisible) {
    preserveSidebarState();
  }
}

// Modificar o observer para preservar o estado da sidebar
function setupObserver() {
  let timeoutId = null;
  const observer = new MutationObserver((mutations) => {
    const hasRelevantChanges = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 &&
        !node.classList.contains('news-save-button')
      );
    });

    if (hasRelevantChanges) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        const wasVisible = isSidebarVisible();
        addSaveButtons();
        if (wasVisible) {
          preserveSidebarState();
        }
      }, 500);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 