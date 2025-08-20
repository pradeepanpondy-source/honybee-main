# Automatic Git Commits & Pushes

This project includes an automatic git commit and push system that monitors file changes and commits them to your repository.

## Features

- **File Watching**: Automatically watches for changes in specified files/directories
- **Smart Debouncing**: Waits 5 seconds after changes before committing to batch related changes
- **Auto-commit**: Creates commits with descriptive messages including timestamps
- **Auto-push**: Automatically pushes commits to your remote repository
- **Configurable**: Easy to customize via configuration file

## Quick Start

### 1. Setup
```bash
# Install the automatic git system
node scripts/setup-git-auto.js

# Or manually install the dependency
npm install chokidar
```

### 2. Start Automatic Commits
```bash
# Start the file watcher
npm run git-auto:start

# Or run directly
node scripts/git-auto.js
```

### 3. Manual Commands
```bash
# Check git status
npm run git:status

# Manual push
npm run git:push
```

## Configuration

Edit `scripts/git-auto.config.js` to customize behavior:

```javascript
module.exports = {
  debounceMs: 5000,           // Wait time before committing
  commitMessage: 'Auto-commit', // Base commit message
  pushEnabled: true,          // Auto-push to remote
  watchPaths: ['src/', 'package.json'], // Files to watch
  ignorePaths: ['node_modules/**'],    // Files to ignore
  branch: 'main'             // Branch to push to
};
```

## How It Works

1. **File Monitoring**: Uses `chokidar` to watch for file changes
2. **Debouncing**: Waits 5 seconds after the last change to avoid excessive commits
3. **Git Operations**: Automatically runs `git add .`, `git commit`, and `git push`
4. **Error Handling**: Gracefully handles network issues and git conflicts

## Log Output

When running, you'll see output like:
```
[2024-01-15T10:30:45.123Z] Starting file watcher...
[2024-01-15T10:30:45.124Z] Watching paths: src/, package.json, ...
[2024-01-15T10:30:50.456Z] File changed: src/App.tsx
[2024-01-15T10:30:55.789Z] Changes detected, starting commit process...
[2024-01-15T10:30:56.012Z] Committed: Auto-commit: Changes detected - 1/15/2024, 10:30:55 AM
[2024-01-15T10:30:57.234Z] Successfully pushed to remote
```

## Stopping the Service

Press `Ctrl+C` to stop the file watcher gracefully.

## Troubleshooting

### Git Issues
- Ensure git is initialized: `git init`
- Add remote repository: `git remote add origin <your-repo-url>`
- Check git status: `npm run git:status`

### Permission Issues
- Make sure you have push permissions to the repository
- Check your git credentials are configured

### Network Issues
- The system will retry pushing on network failures
- Check your internet connection if pushes consistently fail

## Customization

### Adding More Watch Paths
Edit `scripts/git-auto.config.js` and add paths to the `watchPaths` array.

### Changing Commit Messages
Modify the `commitMessage` in the configuration file.

### Disabling Auto-push
Set `pushEnabled: false` in the configuration file.

## Development

The system consists of:
- `scripts/git-auto.js` - Main file watcher and git automation
- `scripts/git-auto.config.js` - Configuration file
- `scripts/setup-git-auto.js` - Setup script
- `package.json` - NPM scripts integration
