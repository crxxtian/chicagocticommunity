# Chicago Cyber Threat Intelligence Community (CCTIC)

## Overview

The Chicago Cyber Threat Intelligence Community (CCTIC) is a web platform dedicated to providing cybersecurity resources, news, and threat intelligence for the Chicago area. Built with a modern tech stack, this project aggregates real-time cybersecurity news, research papers, ransomware data, and community resources to empower users with actionable insights.

## Features

- **News Aggregation**: Fetches and displays cybersecurity news from multiple RSS feeds, with filtering and tagging capabilities.
- **Research Papers**: Integrates with arXiv to provide the latest cybersecurity research papers.
- **Ransomware Data**: Retrieves real-time ransomware victim and sector data via the Ransomware Live API.
- **Resource Hub**: Curates cybersecurity tools, incident response contacts, and educational materials, filterable by category and type.
- **Search Functionality**: Allows users to search across news and resources with normalized text matching.
- **Responsive UI**: Built with React, Tailwind CSS, and shadcn/ui components for a modern, accessible interface.
- **Dark Mode**: Supports light and dark themes using `next-themes`.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router
- **Data Fetching**: Tanstack Query, RSS Parser, arXiv API, Ransomware Live API
- **Build Tools**: Vite, ESLint, PostCSS
- **Deployment**: Configured for Vercel

## Project Structure

```
├── api/                    # Serverless API routes
│   ├── arxiv.ts           # Fetches cybersecurity papers from arXiv
│   ├── fetch-news.ts      # Aggregates news from RSS feeds
│   ├── ransomware.ts      # Retrieves ransomware data
├── public/                 # Static assets
│   ├── cctic.svg          # Project logo
│   ├── placeholder.svg
│   ├── robots.txt
├── src/
│   ├── components/        # Reusable React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── ContentCard.tsx
│   │   ├── Navbar.tsx
│   │   ├── ThemeProvider.tsx
│   ├── data/             # Static data and reports
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility functions
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   ├── News.tsx
│   │   ├── Resources.tsx
│   │   ├── Search.tsx
│   ├── App.tsx           # Main app component
│   ├── index.css         # Global styles
│   ├── main.tsx          # Entry point
├── .gitignore
├── components.json        # shadcn/ui configuration
├── eslint.config.js       # ESLint configuration
├── index.html            # HTML entry point
├── package.json          # Dependencies and scripts
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
├── vercel.json           # Vercel deployment configuration
├── vite.config.ts        # Vite configuration
```

## Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd vite_react_shadcn_ts
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:8080`.

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview the production build**:

   ```bash
   npm run preview
   ```

## Usage

- Navigate to the homepage (`/`) for an overview of the platform.
- Explore news at `/news`, research at `/research`, or resources at `/resources`.
- Use the search bar or visit `/search?query=<term>` to find specific content.
- Filter resources by category or type on the Resources page.
- Toggle between light and dark themes using the theme switcher in the navbar.

## API Endpoints

- `/api/arxiv`: Fetches recent cybersecurity papers from arXiv.
- `/api/fetch-news`: Aggregates and filters cybersecurity news from RSS feeds.
- `/api/ransomware`: Retrieves ransomware data (e.g., recent victims, sectors).

## Deployment

The project is configured for deployment on Vercel. To deploy:

1. Push the repository to a Git provider (e.g., GitHub).
2. Connect the repository to Vercel and configure the project settings.
3. Vercel will handle builds and deployments automatically based on `vercel.json`.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/<feature-name>`).
3. Commit your changes (`git commit -m "Add <feature>"`).
4. Push to the branch (`git push origin feature/<feature-name>`).
5. Open a pull request.

Please ensure your code follows the ESLint rules and TypeScript conventions.

## License

© 2025 Chicago Cyber Threat Intelligence Community. All rights reserved.

## Contact

For inquiries, reach out via the CCTIC website or open an issue on the repository.