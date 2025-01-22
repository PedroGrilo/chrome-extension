// Criar o botão principal
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

// Event listeners
getLinkButton.addEventListener('click', function() {
  chrome.runtime.sendMessage({type: 'GET_LINK_INFO'}, function(response) {
    updateLinkInfo(response);
  });
});

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

// Montar o sidebar
sidebar.appendChild(sidebarTitle);
sidebar.appendChild(timeDisplay);
sidebar.appendChild(getLinkButton);
sidebar.appendChild(linkInfoDisplay);

// Adicionar controle do sidebar ao botão
button.addEventListener('click', function() {
  const isOpen = sidebar.style.transform === 'translateX(0px)';
  sidebar.style.transform = isOpen ? 'translateX(300px)' : 'translateX(0px)';
});

// Adicionar elementos à página
document.body.appendChild(sidebar);
document.body.appendChild(button); 