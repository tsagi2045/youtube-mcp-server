# YouTube MCP Server

A YouTube API integration using the Model Context Protocol.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Edit `.env` and add your YouTube API key
5. Start the server:
   ```bash
   npm start
   ```

## Environment Variables

- `YOUTUBE_API_KEY`: Your YouTube Data API v3 key (get it from Google Cloud Console)

## Development

1. To run in development mode with auto-reload:
   ```bash
   npm run dev
   ```
2. To build:
   ```bash
   npm run build
   ```

## Security Note

Always keep your API keys secure and never commit them to version control.