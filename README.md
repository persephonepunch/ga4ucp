# GA4 UCP Code Reference - 11ty + UIKit Version

Complete implementation guide for Google Analytics 4 with Universal Commerce Protocol integration, built with **11ty (Eleventy)** static site generator and **UIKit** framework using **BEM naming conventions**.

## Features

✅ **Static Site Generation** - 11ty for fast, SEO-friendly HTML  
✅ **UIKit Framework** - Lightweight, modular components  
✅ **BEM Methodology** - Maintainable CSS with Block-Element-Modifier naming  
✅ **Vanilla JavaScript** - No framework dependencies, pure JS  
✅ **Syntax Highlighting** - Prism.js for beautiful code blocks  
✅ **Full-Text Search** - Search across titles, descriptions, tags, and code  
✅ **Category Filtering** - Filter by HTML, JavaScript, CSS, GTM, Integration  
✅ **Keyboard Shortcuts** - Ctrl+K or / to focus search  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## Tech Stack

- **Static Site Generator:** [11ty (Eleventy)](https://www.11ty.dev/) v2.0.1
- **CSS Framework:** [UIKit](https://getuikit.com/) v3.25.5
- **Syntax Highlighting:** [Prism.js](https://prismjs.com/) v1.30.0
- **CSS Methodology:** [BEM](https://getbem.com/)
- **Fonts:** IBM Plex Sans & IBM Plex Mono
- **Colors:** Red (#d32f2f), Black (#1a1a1a), Grey

## Project Structure

```
ga4-ucp-11ty/
├── src/
│   ├── _data/
│   │   ├── codeSections.json    # All code examples
│   │   └── categories.json      # Category definitions
│   ├── _includes/               # Reusable components
│   ├── _layouts/
│   │   └── base.njk             # Base layout template
│   ├── css/
│   │   └── main.css             # Custom BEM styles
│   ├── js/
│   │   └── main.js              # Search & interactions
│   ├── index.njk                # Home page
│   └── docs.njk                 # Documentation page
├── _site/                       # Generated output (git ignored)
├── .eleventy.js                 # 11ty configuration
├── package.json
├── netlify.toml                 # Netlify deployment config
└── README.md
```

## Local Development

### Prerequisites

- Node.js 22.13.0 or higher
- npm or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Clean output directory
npm run clean
```

The development server will start at `http://localhost:8080` with live reload.

## Deployment

### Option 1: Netlify Drop (Fastest)

1. Build the site: `npm run build`
2. Go to [netlify.com/drop](https://app.netlify.com/drop)
3. Drag the `_site` folder onto the page
4. Done! Your site is live

### Option 2: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=_site
```

### Option 3: Git-Based Continuous Deployment

1. Push to GitHub/GitLab/Bitbucket
2. Connect repository in Netlify
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `_site`
   - **Node version:** `22.13.0`

## Content Management

### Adding New Code Examples

Edit `src/_data/codeSections.json`:

```json
{
  "id": "unique-id",
  "title": "Example Title",
  "description": "Description of the code example",
  "category": "html|javascript|css|gtm|integration",
  "tags": ["tag1", "tag2"],
  "language": "html|javascript|css",
  "order": 1,
  "code": "// Your code here"
}
```

### Adding New Categories

Edit `src/_data/categories.json`:

```json
{
  "id": "category-id",
  "label": "Category Label",
  "icon": "uikit-icon-name"
}
```

## BEM Naming Convention

This project strictly follows BEM methodology:

```css
/* Block */
.code-section { }

/* Element */
.code-section__header { }
.code-section__title { }

/* Modifier */
.code-section--featured { }

/* State (using data attributes) */
.code-section[data-state="loading"] { }
```

## Key Features

### Search Functionality

- Full-text search across all content
- Real-time filtering
- Keyboard shortcuts (Ctrl+K or /)
- Clear button for quick reset

### Category Filtering

- Filter by HTML, JavaScript, CSS, GTM, Integration
- Combines with search for precise results
- Visual active state indicators

### Code Blocks

- Syntax highlighting via Prism.js
- Copy to clipboard functionality
- Language indicators
- Dark theme for better readability

### Responsive Design

- Mobile-first approach
- Collapsible sidebar on mobile
- Touch-friendly interactions
- Optimized for all screen sizes

## Performance

- **Build time:** < 1 second
- **Page size:** ~150 KB (gzipped)
- **Load time:** < 1 second on 3G
- **Lighthouse score:** 95+ expected

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Design Philosophy

- **No rounded corners** - Sharp, technical aesthetic
- **IBM Plex fonts** - Professional, readable typography
- **Red/Black/Grey palette** - High contrast, focused design
- **No glow effects** - Clean, flat design language
- **BEM methodology** - Maintainable, scalable CSS

## Related Resources

- [Universal Commerce Protocol](https://ucp.dev/)
- [UIKit Documentation](https://getuikit.com/)
- [11ty Documentation](https://www.11ty.dev/)
- [BEM Methodology](https://getbem.com/)
- [GA4 Developer Guide](https://developers.google.com/analytics/devguides/collection/ga4)

## License

MIT

## Support

For questions or issues, please refer to the documentation page at `/docs` or visit the related resource links above.
# ga4ucp
