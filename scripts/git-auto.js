import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import chokidar from 'chokidar';

// Load configuration
let CONFIG;
try {
  const configModule = await import('./git-auto.config.js');
  CONFIG = configModule.default;
} catch (error) {
  console.log('Using default configuration');
  CONFIG = {
    debounceMs: 5000,
    commitMessage: 'Auto-commit: Changes detected',
    pushEnabled: true,
    watchPaths: ['src/', 'package.json', 'package-lock.json', 'index.html', 'tailwind.config.js', 'vite.config.ts'],
    ignorePaths: ['node_modules/**', 'dist/**', '.git/**', '*.log'],
    branch: 'main'
  };
}

class GitAuto {
  constructor() {
    this.pendingCommit = null;
    this.isProcessing = false;
  }

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  execGit(command) {
    try {
      return execSync(command, { 
        encoding: 'utf8', 
        cwd: process.cwd(),
        stdio: ['pipe', 'pipe', 'pipe']
      }).trim();
    } catch (error) {
      this.log(`Git command failed: ${command}`);
      this.log(`Error: ${error.message}`);
      return null;
    }
  }

  hasChanges() {
    const status = this.execGit('git status --porcelain');
    return status && status.length > 0;
  }

  getStatusSummary() {
    const status = this.execGit('git status --porcelain');
    if (!status) return 'No changes';
    
    const lines = status.split('\n');
    const summary = {
      added: 0,
      modified: 0,
      deleted: 0,
      untracked: 0
    };

    lines.forEach(line => {
      if (line.startsWith('A') || line.startsWith('M')) summary.added++;
      if (line.startsWith(' M') || line.startsWith('M')) summary.modified++;
      if (line.startsWith(' D') || line.startsWith('D')) summary.deleted++;
      if (line.startsWith('??')) summary.untracked++;
    });

    return `${summary.added} added, ${summary.modified} modified, ${summary.deleted} deleted, ${summary.untracked} untracked`;
  }

  commitAndPush() {
    if (this.isProcessing) return;
    
    this.isProcessing = true;
    
    try {
      if (!this.hasChanges()) {
        this.log('No changes to commit');
        this.isProcessing = false;
        return;
      }

      this.log('Changes detected, starting commit process...');
      
      // Add all changes
      this.execGit('git add .');
      
      // Create commit message with timestamp
      const timestamp = new Date().toLocaleString();
      const commitMsg = `${CONFIG.commitMessage} - ${timestamp}`;
      this.execGit(`git commit -m "${commitMsg}"`);
      
      this.log(`Committed: ${commitMsg}`);
      
      // Push if enabled
      if (CONFIG.pushEnabled) {
        this.log('Pushing to remote...');
        const pushResult = this.execGit('git push origin main');
        if (pushResult !== null) {
          this.log('Successfully pushed to remote');
        } else {
          this.log('Push failed - check your network connection');
        }
      }
      
      this.log(`Status: ${this.getStatusSummary()}`);
      
    } catch (error) {
      this.log(`Error during commit/push: ${error.message}`);
    } finally {
      this.isProcessing = false;
    }
  }

  scheduleCommit() {
    if (this.pendingCommit) {
      clearTimeout(this.pendingCommit);
    }
    
    this.pendingCommit = setTimeout(() => {
      this.commitAndPush();
    }, CONFIG.debounceMs);
  }

  startWatching() {
    this.log('Starting file watcher...');
    this.log(`Watching paths: ${CONFIG.watchPaths.join(', ')}`);
    
    const watcher = chokidar.watch(CONFIG.watchPaths, {
      ignored: CONFIG.ignorePaths,
      persistent: true,
      ignoreInitial: true
    });

    watcher.on('change', (filePath) => {
      this.log(`File changed: ${filePath}`);
      this.scheduleCommit();
    });

    watcher.on('add', (filePath) => {
      this.log(`File added: ${filePath}`);
      this.scheduleCommit();
    });

    watcher.on('unlink', (filePath) => {
      this.log(`File removed: ${filePath}`);
      this.scheduleCommit();
    });

    this.log('File watcher started successfully');
    
    // Initial status check
    if (this.hasChanges()) {
      this.log(`Initial changes detected: ${this.getStatusSummary()}`);
      this.scheduleCommit();
    }
  }

  stopWatching() {
    if (this.pendingCommit) {
      clearTimeout(this.pendingCommit);
    }
    this.log('File watcher stopped');
  }
}

// CLI interface
if (require.main === module) {
  const gitAuto = new GitAuto();
  
  process.on('SIGINT', () => {
    console.log('\nStopping git-auto...');
    gitAuto.stopWatching();
    process.exit(0);
  });

  gitAuto.startWatching();
}

module.exports = GitAuto;
