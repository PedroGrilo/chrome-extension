// Configuração do IndexedDB
const dbConfig = {
  name: 'NewsDB',
  version: 1,
  storeName: 'savedNews'
};

// Classe para gerenciar o banco de dados
class NewsDatabase {
  constructor() {
    this.db = null;
    this.init();
  }

  init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbConfig.name, dbConfig.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(dbConfig.storeName)) {
          db.createObjectStore(dbConfig.storeName, { 
            keyPath: 'id',
            autoIncrement: true 
          });
        }
      };
    });
  }

  async saveNews(newsData) {
    try {
      const store = this.db
        .transaction(dbConfig.storeName, 'readwrite')
        .objectStore(dbConfig.storeName);

      const request = store.add({
        ...newsData,
        savedAt: new Date().toISOString()
      });

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error saving news:', error);
      throw error;
    }
  }

  async getAllNews() {
    try {
      const store = this.db
        .transaction(dbConfig.storeName, 'readonly')
        .objectStore(dbConfig.storeName);

      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting news:', error);
      throw error;
    }
  }

  async deleteNews(id) {
    try {
      const store = this.db
        .transaction(dbConfig.storeName, 'readwrite')
        .objectStore(dbConfig.storeName);

      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
} 