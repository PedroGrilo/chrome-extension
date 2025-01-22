// Server URL
const API_URL = 'http://localhost:3000/api';

// Manage messages between components
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_LINK_INFO') {
    // Encaminhar a mensagem para o content script da aba ativa
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'FETCH_LINK_INFO'}, function(response) {
        sendResponse(response);
      });
    });
    return true; // Indica que a resposta será assíncrona
  }
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
          title: 'News Saved',
          message: 'The news article was successfully saved!'
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
    .catch(error => {
      console.error('Error saving to MongoDB:', error);
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }

  if (message.type === 'GET_ALL_NEWS') {
    // Buscar notícias do MongoDB através do servidor
    fetch(`${API_URL}/news`)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        sendResponse({ success: true, news: data.news });
      } else {
        throw new Error(data.error);
      }
    })
    .catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  }
}); 