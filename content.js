// Criar o botão
const button = document.createElement('button');
button.textContent = 'Out of a job';
button.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9999;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

// Criar o sidebar
const sidebar = document.createElement('div');
sidebar.style.cssText = `
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #f8f9fa;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  padding: 20px;
  z-index: 9998;
  transition: transform 0.3s ease;
  transform: translateX(300px);
`;

// Criar o elemento para mostrar o horário
const timeDisplay = document.createElement('div');
timeDisplay.style.cssText = `
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
  text-align: center;
`;

// Função para atualizar o horário
function updateTime() {
  const now = new Date();
  timeDisplay.textContent = now.toLocaleTimeString();
}

// Atualizar o horário a cada segundo
updateTime();
setInterval(updateTime, 1000);

// Criar o título do sidebar
const sidebarTitle = document.createElement('h2');
sidebarTitle.textContent = 'Out of a job';
sidebarTitle.style.cssText = `
  margin: 0 0 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #4CAF50;
  color: #333;
  font-size: 20px;
  text-align: center;
`;

// Adicionar o título e o display de tempo ao sidebar
sidebar.appendChild(sidebarTitle);
sidebar.appendChild(timeDisplay);

// Criar área para informações do link
const linkInfoDisplay = document.createElement('div');
linkInfoDisplay.style.cssText = `
  margin-top: 20px;
  padding: 10px;
  background-color: #fff;
  border-radius: 5px;
  font-size: 14px;
`;

// Criar botão de Get Link Info
const getLinkButton = document.createElement('button');
getLinkButton.textContent = 'Get Link Info';
getLinkButton.style.cssText = `
  width: 100%;
  margin-top: 15px;
  padding: 8px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
`;

// Função para obter informações do link
getLinkButton.addEventListener('click', function() {
  // Enviar mensagem para o background script
  chrome.runtime.sendMessage({type: 'GET_LINK_INFO'}, function(response) {
    updateLinkInfo(response);
  });
});

// Listener para mensagens do background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_LINK_INFO') {
    const links = document.querySelectorAll('a');
    let linkInfo = null;

    if (links.length > 0) {
      const firstLink = links[0];
      linkInfo = {
        text: firstLink.textContent,
        url: firstLink.href,
        title: firstLink.title || 'N/A',
        target: firstLink.target || '_self',
        totalLinks: links.length
      };
    }

    sendResponse(linkInfo);
  }
});

// Função para atualizar a exibição das informações do link
function updateLinkInfo(linkInfo) {
  if (linkInfo) {
    linkInfoDisplay.innerHTML = `
      <strong>Link encontrado:</strong><br>
      Texto: ${linkInfo.text}<br>
      URL: ${linkInfo.url}<br>
      Title: ${linkInfo.title}<br>
      Target: ${linkInfo.target}<br>
      Número total de links: ${linkInfo.totalLinks}
    `;
  } else {
    linkInfoDisplay.innerHTML = 'Nenhum link encontrado na página.';
  }
}

// Adicionar os novos elementos ao sidebar
sidebar.appendChild(getLinkButton);
sidebar.appendChild(linkInfoDisplay);

// Modificar o botão existente para controlar o sidebar
button.addEventListener('click', function() {
  const isOpen = sidebar.style.transform === 'translateX(0px)';
  sidebar.style.transform = isOpen ? 'translateX(300px)' : 'translateX(0px)';
});

// Adicionar os elementos à página
document.body.appendChild(sidebar);
document.body.appendChild(button);

// Lista de domínios de notícias
const newsSites = [
  'cnn.com',
  'cmjornal.pt',
  'nytimes.com'
];

// Verificar se estamos em um site de notícias
const isNewsSite = newsSites.some(site => window.location.hostname.includes(site));

// Criar botão de Keywords (só aparece em sites de notícias)
if (isNewsSite) {
  const keywordsButton = document.createElement('button');
  keywordsButton.textContent = 'News Keywords';
  keywordsButton.style.cssText = `
    position: fixed;
    top: 70px;
    left: 20px;
    z-index: 9999;
    padding: 10px 20px;
    background-color: #9c27b0;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 14px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  `;

  // Criar o popup de keywords
  const keywordsPopup = document.createElement('div');
  keywordsPopup.style.cssText = `
    display: none;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: white;
    padding: 25px;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    z-index: 10000;
  `;

  // Conteúdo do popup
  keywordsPopup.innerHTML = `
    <div style="
      text-align: center;
      margin-bottom: 20px;
      color: #333;
      font-family: Arial, sans-serif;
    ">
      <h2 style="margin: 0 0 10px 0;">News Keywords</h2>
      <p style="margin: 0; color: #666;">Add keywords to highlight news items</p>
    </div>
    <div style="
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    ">
      <input type="text" id="keywordInput" placeholder="Enter keyword" style="
        flex: 1;
        padding: 8px 12px;
        border: 2px solid #e0e0e0;
        border-radius: 5px;
        font-size: 14px;
        outline: none;
      ">
      <button id="addKeyword" style="
        background: #9c27b0;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
      ">Add</button>
    </div>
    <div id="keywordsList" style="
      margin-bottom: 20px;
      max-height: 150px;
      overflow-y: auto;
    "></div>
    <div style="
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    ">
      <button id="cancelKeywords" style="
        background: #f5f5f5;
        color: #333;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">Cancel</button>
      <button id="applyKeywords" style="
        background: #9c27b0;
        color: white;
        border: none;
        padding: 8px 20px;
        border-radius: 5px;
        cursor: pointer;
      ">Apply</button>
    </div>
  `;

  // Adicionar overlay para background escuro
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;

  // Array para armazenar keywords
  let keywords = [];

  // Funções do popup
  function showPopup() {
    overlay.style.display = 'block';
    keywordsPopup.style.display = 'block';
  }

  function hidePopup() {
    overlay.style.display = 'none';
    keywordsPopup.style.display = 'none';
  }

  function updateKeywordsList() {
    const keywordsList = document.getElementById('keywordsList');
    keywordsList.innerHTML = keywords.map(keyword => `
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        background: #f5f5f5;
        margin-bottom: 5px;
        border-radius: 3px;
      ">
        <span>${keyword}</span>
        <button onclick="this.parentElement.remove(); keywords = keywords.filter(k => k !== '${keyword}')" style="
          background: none;
          border: none;
          color: #ff5252;
          cursor: pointer;
        ">×</button>
      </div>
    `).join('');
  }

  // Função para processar o conteúdo da página
  function processNewsContent() {
    // Substituir números por *
    document.body.innerHTML = document.body.innerHTML.replace(/\b\d+\b/g, '*');

    // Encontrar e destacar itens de notícias com as keywords
    const newsElements = document.querySelectorAll('article, .news-item, .article');
    newsElements.forEach(element => {
      const content = element.textContent.toLowerCase();
      const hasKeyword = keywords.some(keyword => 
        content.includes(keyword.toLowerCase())
      );

      if (hasKeyword) {
        element.style.border = '3px solid #9c27b0';
        element.style.padding = '10px';
        element.style.position = 'relative';

        // Adicionar botão de salvar
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: #4CAF50;
          color: white;
          border: none;
          padding: 5px 10px;
          border-radius: 3px;
          cursor: pointer;
        `;
        element.appendChild(saveButton);
      }
    });
  }

  // Event listeners
  keywordsButton.addEventListener('click', showPopup);
  document.getElementById('cancelKeywords').addEventListener('click', hidePopup);
  document.getElementById('addKeyword').addEventListener('click', () => {
    const input = document.getElementById('keywordInput');
    if (input.value.trim()) {
      keywords.push(input.value.trim());
      input.value = '';
      updateKeywordsList();
    }
  });
  document.getElementById('applyKeywords').addEventListener('click', () => {
    hidePopup();
    processNewsContent();
  });

  // Adicionar elementos ao DOM
  document.body.appendChild(keywordsButton);
  document.body.appendChild(overlay);
  document.body.appendChild(keywordsPopup);
} 