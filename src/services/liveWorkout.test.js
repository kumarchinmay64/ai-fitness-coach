import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('LiveWorkoutPage source code integrity and undefined ref check', () => {
  const liveWorkoutPath = path.resolve(__dirname, '../pages/LiveWorkoutPage.jsx');
  const content = fs.readFileSync(liveWorkoutPath, 'utf-8');

  // Ensure animFrameRef is explicitly declared
  assert.match(content, /const\s+animFrameRef\s*=\s*useRef\(null\)/, 'animFrameRef must be declared with useRef(null)');

  // Ensure squatAnalyzerRef was removed and replaced with movementAnalyzerRef
  assert.doesNotMatch(content, /squatAnalyzerRef/, 'squatAnalyzerRef must not be referenced as it was undeclared');

  // Ensure ErrorBoundary is imported in App.jsx
  const appPath = path.resolve(__dirname, '../App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  assert.match(appContent, /import\s+ErrorBoundary\s+from/, 'ErrorBoundary must be imported in App.jsx');
  assert.match(appContent, /<ErrorBoundary>\s*<LiveWorkoutPage\s*\/>\s*<\/ErrorBoundary>/, 'LiveWorkoutPage must be wrapped in ErrorBoundary');

  // Ensure Retry buttons are rendered for camera and model errors
  assert.match(content, /Retry Camera/, 'Retry Camera button must be present in cameraError banner');
  assert.match(content, /Retry Model/, 'Retry Model button must be present in modelError banner');

  // Ensure targeted diagnostic logs are present
  assert.match(content, /\[LiveWorkout Diagnostics\] Component mounted/, 'Component mounted diagnostic log must be present');
  assert.match(content, /\[LiveWorkout Diagnostics\] Component unmounted/, 'Component unmounted diagnostic log must be present');
  assert.match(content, /\[LiveWorkout Diagnostics\] Camera request start/, 'Camera request start diagnostic log must be present');
  assert.match(content, /\[LiveWorkout Diagnostics\] MediaPipe Pose Landmarker initialization start/, 'MediaPipe initialization diagnostic log must be present');
});
