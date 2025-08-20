const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up automatic git commits and pushes...\n');

// Check if git is initialized
try {
  execSync('git status', { stdio: 'pipe' });
  console.log('✅ Git repository found');
} catch (error) {
  console.log('❌ Git repository not initialized');
  console.log('Run: git init');
  process.exit(1);
}

// Check if remote is configured
try {
  const remotes = execSync('git remote -v', { encoding: 'utf8' });
  if (remotes.trim()) {
    console.log('✅ Remote repository configured');
  } else {
    console.log('⚠️  No remote repository found');
    console.log('Run: git remote add origin <your-repo-url>');
  }
} catch (error) {
  console.log('⚠️  Error checking remotes:', error.message);
}

// Install required dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install chokidar', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.log('❌ Failed to install dependencies');
  console.log('Run: npm install chokidar');
}

// Create .gitignore if it doesn't exist
const gitignorePath = path.join(process.cwd(), '.gitignore');
if (!fs.existsSync(gitignorePath)) {
  const gitignoreContent = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production
dist/
build/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Editor
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Coverage
coverage/
.nyc_output/

# Cache
.cache/
.parcel-cache/
.next/
.nuxt/
.vuepress/dist/
.serverless/
.fusebox/
.dynamodb/
.tern-port/

# Git auto
scripts/git-auto.log
`;
  
  fs.writeFileSync(gitignorePath, gitignoreContent);
  console.log('✅ Created .gitignore');
} else {
  console.log('✅ .gitignore already exists');
}

console.log('\n🎉 Setup complete!');
console.log('\nUsage:');
console.log('  npm run git-auto:start    # Start automatic commits');
console.log('  npm run git:push          # Manual push');
console.log('  npm run git:status        # Check git status');
console.log('\nThe system will now automatically:');
console.log('  • Watch for file changes');
console.log('  • Commit changes with timestamp');
console.log('  • Push to your remote repository');
