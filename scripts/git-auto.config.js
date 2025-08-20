// Configuration file for git-auto
// You can customize these settings as needed

module.exports = {
  // Time to wait after changes before committing (in milliseconds)
  debounceMs: 5000,
  
  // Base commit message
  commitMessage: 'Auto-commit: Changes detected',
  
  // Whether to automatically push to remote
  pushEnabled: true,
  
  // Files and directories to watch for changes
  watchPaths: [
    'src/',
    'package.json',
    'package-lock.json',
    'index.html',
    'tailwind.config.js',
    'vite.config.ts',
    'public/'
  ],
  
  // Files and directories to ignore
  ignorePaths: [
    'node_modules/**',
    'dist/**',
    '.git/**',
    '*.log',
    '.env*',
    'coverage/**',
    'build/**'
  ],
  
  // Branch to push to
  branch: 'main',
  
  // Whether to include file details in commit message
  includeFileDetails: false,
  
  // Maximum commit message length
  maxMessageLength: 100
};
