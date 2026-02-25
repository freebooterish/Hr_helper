<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/bfc2fd64-94b4-4377-a1e1-33c4c7ef7399

## Setup & Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app for development:
   ```bash
   npm run dev
   ```
4. Build the app for production:
   ```bash
   npm run build
   ```
5. Test the app for linting errors:
   ```bash
   npm run lint
   ```

## Deployment

A GitHub Actions workflow has been set up in `.github/workflows/deploy.yml` to automatically build and deploy this app to **GitHub Pages** on every push to the `main` or `master` branch.

To enable it:
1. Go to your repository settings on GitHub.
2. Navigate to **Pages** in the left sidebar.
3. Under **Build and deployment**, select **GitHub Actions** as the source.

## Repository Configuration

- **`.gitignore`**: Designed to be comprehensive, ensuring that node modules, build artifacts (`dist`, `out`), environment variables containing secrets (`.env.local`, etc.), IDE settings (`.vscode`, `.idea`), and operating system auto-generated files (like `.DS_Store`) are ignored and not tracked.
