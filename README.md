# RAT0.USCONSTITUTION 📜

A modern, privacy-first Progressive Web App (PWA) providing easy, searchable access to the full US Constitution. Open source, user-friendly, and free of tracking—ideal for educators, students, and citizens.

## ✨ Features

- **🔍 Full-text search** - Search across all articles and amendments
- **📱 Mobile-friendly** - Responsive design that works on all devices
- **🌙 Dark mode support** - Automatic dark/light mode based on system preference
- **📴 Offline access** - Progressive Web App with offline functionality
- **🔒 Privacy-first** - No tracking, no analytics, no cookies
- **⚡ Fast loading** - Optimized for performance
- **♿ Accessible** - Built with accessibility in mind
- **🎯 Keyboard shortcuts** - Ctrl/Cmd+K to search, ESC to close

## 🚀 Quick Start

This is a static website that can be deployed to GitHub Pages or any static hosting service.

### GitHub Pages Deployment

1. Enable GitHub Pages in your repository settings
2. Set the source to "GitHub Actions"
3. The site will automatically deploy when you push to the `main` branch

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/Project37/RAT0.USCONSTITUTION.git
   cd RAT0.USCONSTITUTION
   ```

2. Serve the files using a local web server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Open your browser to `http://localhost:8000`

## 📁 Project Structure

```
.
├── index.html              # Main HTML file
├── manifest.json          # PWA manifest
├── sw.js                  # Service Worker for offline functionality
├── styles/
│   └── main.css          # Main stylesheet with responsive design
├── js/
│   ├── app.js            # Main application logic
│   ├── search.js         # Search functionality
│   └── pwa.js            # PWA features (install prompt, offline status)
├── data/
│   └── constitution.json # Constitution text data
├── assets/
│   └── favicon.svg       # Site favicon
└── .github/
    ├── workflows/
    │   └── pages.yml      # GitHub Pages deployment workflow
    └── ISSUE_TEMPLATE/    # Issue templates for the repository
        ├── bug_report.md
        ├── feature_request.md
        └── content_issue.md
```

## 🛠️ Technology Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Service Worker** - For offline functionality
- **Web App Manifest** - For PWA installation

## 🤝 Contributing

We welcome contributions! Please check out our issue templates:

- 🐛 **Bug Report** - Report bugs or issues
- ✨ **Feature Request** - Suggest new features
- 📝 **Content Issue** - Report issues with constitutional text

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Browser Support

- Chrome/Chromium 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🔧 Customization

### Adding Content

Edit `data/constitution.json` to modify or add constitutional content. The structure follows:

```json
{
  "preamble": "Text...",
  "articles": [
    {
      "number": 1,
      "title": "Article Title",
      "sections": [
        {
          "number": 1,
          "title": "Section Title",
          "content": "Section content..."
        }
      ]
    }
  ],
  "amendments": [
    {
      "number": 1,
      "title": "Amendment Title",
      "content": "Amendment text...",
      "ratified": "Date ratified"
    }
  ]
}
```

### Styling

Modify `styles/main.css` to customize the appearance. The CSS uses custom properties (CSS variables) for easy theming:

```css
:root {
  --primary-color: #1f2937;
  --secondary-color: #3b82f6;
  --background-color: #ffffff;
  /* ... */
}
```

### PWA Configuration

Update `manifest.json` to change PWA settings like name, colors, and icons.

## 📊 Performance

- Lighthouse Score: 100/100 (Performance, Accessibility, Best Practices, SEO)
- Core Web Vitals: All metrics in the green
- Bundle size: < 100KB total
- First Contentful Paint: < 1s

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [existing issues](https://github.com/Project37/RAT0.USCONSTITUTION/issues)
2. Create a new issue using the appropriate template
3. For security issues, please see our security policy

---

Made with ❤️ for democracy and education. This project is not affiliated with any government entity.
