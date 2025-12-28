# Garhwali Seva

<div align="center">

![Garhwali Seva Logo](/public/logo.svg)

**Preserving and promoting the Garhwali language for future generations**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

</div>

---

## 🌄 About the Project

Garhwali Seva is a non-profit, community-driven platform dedicated to preserving the endangered Garhwali language spoken in the Uttarakhand region of India. Our mission is to make Garhwali language accessible to everyone through translation tools, educational resources, and community contributions.

### Our Mission

- **Preservation**: Document and preserve the Garhwali language for future generations
- **Accessibility**: Make Garhwali accessible to speakers of Hindi and English
- **Education**: Provide learning resources for language learners
- **Community**: Enable community-driven expansion of our translation dictionary

### Key Differentiators

- 🚀 **No Paid APIs**: Built entirely with dictionary-based translation - no proprietary services
- 🌱 **Open Source**: Completely transparent and community-driven
- 🎯 **Focus**: Specialized for Garhwali language, not a general-purpose translator
- 📱 **Modern Stack**: Built with Next.js 14, Tailwind CSS, and modern React patterns

---

## ✨ Features

### Translation Tools

| Feature | Description |
|---------|-------------|
| **Text Translator** | Translate Garhwali text to Hindi or English with phrase-level优先 matching |
| **Song Translator** | Translate Garhwali song lyrics while preserving line structure |
| **Speech Input** | Voice recognition for hands-free text input (browser-dependent) |

### Learning Resources

| Feature | Description |
|---------|-------------|
| **Phrasebook** | Common Garhwali phrases organized by category |
| **Learn Page** | Interactive learning section with pronunciation guides |
| **FAQ Section** | Answers to common questions about Garhwali language |

### Community Features

| Feature | Description |
|---------|-------------|
| **Contribution System** | Submit new words and phrases for review |
| **Translation Stats** | Track dictionary growth and translation accuracy |

---

## 🛠 Tech Stack

### Core Technologies

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) validation
- **State Management**: React hooks
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) for dark/light mode
- **Notifications**: [sonner](https://sonner.emilkowal.ski/) toast messages

### Development Tools

- **Package Manager**: npm
- **Linting**: ESLint
- **Formatting**: Prettier (project convention)
- **Testing**: Jest + React Testing Library

### Design System

**Uttarakhand Theme Colors:**
- **Primary**: `#0D5C3E` (Deep Green - represents the forests)
- **Secondary**: `#8B4513` (Earthy Brown - represents the mountains)
- **Accent**: `#87CEEB` (Sky Blue - represents the clear mountain sky)

---

## 📖 How Dictionary-Based Translation Works

Garhwali Seva uses a **phrase-first, word-level fallback** approach to translation:

### Translation Strategy

```
Input Text → Tokenization → Phrase Lookup → Word Lookup → Output
```

1. **Tokenization**: Input text is split into tokens (words/phrases)
2. **Phrase Lookup**: Longer phrases are matched first (e.g., "Namaste" as a complete phrase)
3. **Word Lookup**: Individual words are matched as fallback
4. **Untranslated Handling**: Unknown words are marked with `[brackets]`

### Example Translation

```
Garhwali: "Namaste, ghar kaise hai?"
↓ Tokenize
["Namaste", "ghar", "kaise", "hai", "?"]
↓ Translate to Hindi
["नमस्ते", "घर", "कैसे", "है", "?"]
= "नमस्ते घर कैसे है ?"
```

### Current Dictionary Size

| Category | Count |
|----------|-------|
| Phrases | 15+ |
| Nouns | 60+ |
| Verbs | 30+ |
| Adjectives | 35+ |
| **Total** | **150+ words** |

### Accuracy Notes

- ✅ Phrase-level translations are highly accurate
- ⚠️ Word-level translations depend on dictionary coverage
- 🔄 Translation rate shown for each translation attempt
- 📈 Dictionary is actively growing through community contributions

---

## 📚 How to Add New Words to Dictionary

### Method 1: Manual JSON Editing

1. Open `lib/garhwali_dictionary.json`
2. Add a new entry following this format:

```json
{
  "garhwali_word": "YourWord",
  "hindi_meaning": "हिंदी अर्थ",
  "english_meaning": "English meaning",
  "usage_example": "Example sentence in Garhwali",
  "category": "noun"
}
```

3. Categories: `phrase`, `noun`, `verb`, `adjective`, `song_phrase`

### Method 2: Community Contribution System

1. Visit `/contribute` on the deployed site
2. Fill out the contribution form with:
   - Garhwali word/phrase
   - Hindi translation
   - English translation
   - Usage example (optional)
   - Your email (for follow-up)
3. Submit for review

### Method 3: Batch Import (for large additions)

```bash
# Create a JSON file with new entries
# Run the validation script
npm run validate-dictionary path/to/new-words.json
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (comes with Node.js)
- **Git**: For version control

### Setup Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/garhwali-seva.git
cd garhwali-seva
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env.local
```

4. **Run the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test:coverage
```

---

## ☁️ Deployment

### Vercel (Recommended - One-Click Deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F2Fgithub.com%2Fyourusername%2Fgarhwali-seva)

1. Click the deploy button above
2. Connect your GitHub account
3. Vercel will auto-detect Next.js settings
4. Click "Deploy" - no configuration needed!

**No environment variables required** - the app works out of the box.

#### Custom Domain Setup

1. Go to your Vercel project dashboard
2. Navigate to Settings → Domains
3. Add your custom domain
4. Configure DNS as instructed

### Render (Docker)

#### Prerequisites

- [Render](https://render.com/) account
- GitHub repository connected

#### Deployment Steps

1. Create a new **Web Service** on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm run start`
   - **Environment**: `Node`
   - **Instance Type**: Free (or paid for production)
4. Add environment variables (if any)
5. Deploy!

### Docker (Any Platform)

#### Build and Run

```bash
# Build the image
docker build -t garhwali-seva .

# Run the container
docker run -p 3000:3000 garhwali-seva
```

#### Using Docker Compose

```bash
# Development
docker-compose up app

# Production
docker-compose -f docker-compose.yml up app-prod
```

---

## 📁 Project Structure

```
garhwali-seva/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   └── contributions/ # Contribution submission endpoint
│   ├── about/             # About page
│   ├── contribute/        # Contribution form page
│   ├── faq/               # FAQ page
│   ├── learn/             # Learning resources
│   ├── songs/             # Song translator
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Base UI components
│   ├── TextTranslator.tsx
│   ├── SongTranslator.tsx
│   ├── ContributionForm.tsx
│   └── ...
├── data/                 # Static data
│   └── contributions.json
├── lib/                  # Core utilities
│   ├── garhwali_dictionary.json  # Translation dictionary
│   ├── translationEngine.ts      # Translation logic
│   ├── tokenizer.ts              # Text tokenization
│   ├── hooks/                    # Custom React hooks
│   └── utils/                    # Utility functions
├── public/               # Static assets
│   └── logo.svg
├── types/               # TypeScript type definitions
├── .env.example         # Environment template
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
├── next.config.js       # Next.js configuration
├── tailwind.config.ts   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
└── package.json
```

---

## 🛣️ Available Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with text translator |
| `/about` | About Garhwali language and culture |
| `/learn` | Learning resources and phrases |
| `/faq` | Frequently asked questions |
| `/songs` | Song lyrics translator |
| `/contribute` | Dictionary contribution form |
| `/api/health` | Health check endpoint |
| `/api/contributions/submit` | Submit new word contributions |

---

## ⚠️ Limitations

### Current Limitations

1. **Dictionary Coverage**: ~150 words - cannot translate all Garhwali text
2. **No Grammar Rules**: Word-by-word translation only, no conjugation support
3. **Context Blindness**: Cannot detect context-dependent meanings
4. **No Dialect Support**: Standard Garhwali only (regional variations not supported)
5. **Browser Dependency**: Speech recognition requires browser support

### Accuracy Expectations

- **High**: Common phrases and greetings
- **Medium**: Simple sentences with known vocabulary
- **Low**: Complex sentences with unknown words
- **None**: Dialect-specific or regional expressions

---

## 🗺️ Roadmap

### Q1 2025: Community Expansion
- [ ] Expand dictionary to 500+ words
- [ ] Implement community voting system
- [ ] Add user accounts for contributions
- [ ] Email notification system for submissions

### Q2 2025: Mobile Application
- [ ] React Native iOS app
- [ ] React Native Android app
- [ ] Offline dictionary support
- [ ] Push notifications for new words

### Q3 2025: Advanced Features
- [ ] Grammar rules engine
- [ ] Dialect detection and support
- [ ] Verb conjugation system
- [ ] Pronunciation guides (audio)

### Q4 2025: AI Integration
- [ ] ML-assisted phrase suggestions (free models)
- [ ] Context-aware translation improvements
- [ ] Community-trained language model
- [ ] Translation quality scoring

---

## 🤝 Contributing

We welcome contributions from the community! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

### Ways to Contribute

1. **Add Words**: Submit new Garhwali words and translations
2. **Fix Errors**: Report or fix translation inaccuracies
3. **Improve Code**: Submit bug fixes or feature implementations
4. **Documentation**: Improve or translate documentation
5. **Share**: Spread the word about Garhwali Seva

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

### Get in Touch

- **GitHub Issues**: Report bugs or request features
- **Email**: support@garhwaliseva.example.com
- **Website**: https://garhwaliseva.example.com

### Community

- **Discord**: [Join our server](#)
- **Twitter**: [@GarhwaliSeva](#)

---

<div align="center">

**Made with ❤️ for the Garhwali community**

*"Language is the road map of a culture. It tells you where its people come from and where they are going."*

— Rita Mae Brown

</div>
