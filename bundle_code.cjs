const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = path.resolve(__dirname);
const outputFile = path.join(projectDir, 'PROJECT_SOURCE_CODE.md');
const zipFile = path.join(projectDir, 'ai-fitness-coach-source.zip');

const keyFiles = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'index.html'
];

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcFiles = getAllFiles(path.join(projectDir, 'src')).filter(
  f => !f.endsWith('.png') && !f.endsWith('.svg') && !f.endsWith('.ico')
);

let content = '# AI Fitness Coach (PulseAI) - Full Source Code\n\n';
content += '> Complete source code export for ChatGPT / AI analysis.\n\n';
content += '## Project Overview\n';
content += '- **Stack**: React (Vite) + Tailwind CSS + Lucide Icons\n';
content += '- **Theme**: Hyper-Volt & Cybernetic Athletics (Dark Mode, Neon Accents, Smooth CSS Animations)\n';
content += '- **Live Features**: Real-time webcam HUD, honest telemetry slots, dynamic AI Chat assistant, nutrition/workout planners, and Admin portal.\n\n';
content += '## Table of Files Included\n';

const allTextFiles = [...keyFiles.map(f => path.join(projectDir, f)), ...srcFiles];

allTextFiles.forEach(f => {
  const rel = path.relative(projectDir, f).replace(/\\/g, '/');
  content += '- `' + rel + '`\n';
});
content += '\n---\n\n';

allTextFiles.forEach(f => {
  const rel = path.relative(projectDir, f).replace(/\\/g, '/');
  try {
    const text = fs.readFileSync(f, 'utf8');
    const ext = path.extname(f).replace('.', '');
    const lang = ext === 'jsx' || ext === 'js' ? 'javascript' : ext === 'css' ? 'css' : ext === 'json' ? 'json' : ext === 'html' ? 'html' : 'text';
    content += '## File: `' + rel + '`\n\n```' + lang + '\n' + text + '\n```\n\n---\n\n';
  } catch (err) {
    console.error('Skipping:', rel, err.message);
  }
});

fs.writeFileSync(outputFile, content, 'utf8');
console.log('Generated:', outputFile, '(' + (fs.statSync(outputFile).size / 1024).toFixed(1) + ' KB)');

// Create zip using powershell Compress-Archive
try {
  if (fs.existsSync(zipFile)) fs.unlinkSync(zipFile);
  const zipCmd = `powershell -Command "Compress-Archive -Path '${path.join(projectDir, 'src')}', '${path.join(projectDir, 'package.json')}', '${path.join(projectDir, 'vite.config.js')}', '${path.join(projectDir, 'tailwind.config.js')}', '${path.join(projectDir, 'index.html')}', '${outputFile}' -DestinationPath '${zipFile}' -Force"`;
  execSync(zipCmd, { stdio: 'inherit' });
  console.log('Generated Zip:', zipFile, '(' + (fs.statSync(zipFile).size / 1024).toFixed(1) + ' KB)');
} catch (e) {
  console.error('Zip creation error:', e.message);
}
