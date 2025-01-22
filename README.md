# News Saver Chrome Extension 📰

A powerful Chrome extension that helps you save and manage news articles from various news websites. This project was developed in a professional work environment as an experimental approach to AI-assisted development. Currently supports:
- NYTimes
- CNN
- CMJornal

## 🤖 AI Disclaimer

This project was developed with approximately 95% AI assistance as part of a workplace experiment, exploring the potential of AI-powered development tools in a professional setting. The development stack included:
- **Claude (Anthropic)**: Main development, code generation, and problem-solving through Cursor IDE
- **Cursor IDE**: AI-powered development environment for intelligent code completion and suggestions
- **Human Input**: Project direction, requirements, and final validation (5%)

The development process was a collaborative effort between human guidance and AI capabilities, demonstrating the potential of AI-assisted development in a professional setting while maintaining human oversight for quality and functionality. This experiment showcases how AI tools can be effectively integrated into workplace development workflows.

## ✨ Features

- 🔍 **Keyword Highlighting**: Add keywords to highlight relevant news articles
- 💾 **Save Articles**: Save interesting articles to MongoDB for later reading
- 🎯 **Smart Detection**: Automatically detects news content on supported websites
- 🔄 **Real-time Updates**: Works with dynamically loaded content
- 📱 **Responsive Design**: Clean and modern UI that works on any screen size

## 🚀 Installation

### Extension Setup

1. Clone this repository:
```bash
git clone https://github.com/your-username/chrome-extension.git
cd chrome-extension
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked" and select the extension directory

### Server Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with your MongoDB connection string:
```bash
# .env file
MONGODB_URI=your_mongodb_connection_string

# Example for local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/newsDB

# Example for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/newsDB
```

4. Start the server:
```bash
npm start
```

Note: If no MONGODB_URI is provided in the .env file, the server will attempt to connect to a local MongoDB instance at mongodb://localhost:27017/newsDB

## 💡 Usage

1. **Save Articles**
   - Navigate to any supported news website
   - Look for the "Save" button on news articles
   - Click to save the article to your MongoDB database

2. **Keyword Highlighting**
   - Click the "Keywords Panel" button on the left side
   - Add keywords you're interested in
   - Click "Apply Highlights" to highlight articles containing your keywords
   - Use "Remove All" to clear highlights

3. **View Saved Articles**
   - All saved articles are stored in your MongoDB database
   - Access them through your server's API endpoints

## 🛠️ API Endpoints

- `POST /api/news`: Save a new article
- `GET /api/news`: Retrieve all saved articles
- `DELETE /api/news/:id`: Delete a specific article

## 🔧 Technical Details

### Extension Components
- `manifest.json`: Extension configuration
- `background.js`: Background service worker
- `news-content.js`: News detection and saving functionality
- `base-content.js`: Core UI components

### Server Components
- Express.js server
- MongoDB database
- CORS enabled for cross-origin requests

## 📝 Requirements

- Node.js >= 14.x
- MongoDB >= 4.x
- Chrome Browser >= 88

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by the need for better news management
- Built with ❤️ using Chrome Extensions API
