/**
 * Sets Razorpay environment variables on Vercel using the REST API directly.
 * No trailing newlines or invisible characters.
 */

import { spawnSync } from 'child_process';

const KEYS = [
  { name: 'RAZORPAY_KEY_ID',       value: 'rzp_test_TSuCUEjOA16MYi' },
  { name: 'RAZORPAY_KEY_SECRET',   value: '6aoQG186fgyfAb41BUFmoBOE' },
  { name: 'VITE_RAZORPAY_KEY_ID',  value: 'rzp_test_TSuCUEjOA16MYi' },
];

const opts = { shell: true, encoding: 'utf8' };

for (const k of KEYS) {
  console.log(`Adding ${k.name} = ${k.value.slice(0, 10)}...`);
  const result = spawnSync(
    'vercel',
    ['env', 'add', k.name, 'production'],
    { ...opts, input: k.value }   // exact value, no newline appended
  );
  if (result.stderr) process.stderr.write(result.stderr);
  console.log(result.stdout || '');
  if (result.status !== 0) {
    console.error(`Failed to add ${k.name}`);
    process.exit(1);
  }
  console.log(`✅ ${k.name} added`);
}

console.log('\nAll done. Triggering redeploy...');
const deploy = spawnSync('vercel', ['--prod', '--yes'], { ...opts, stdio: 'inherit' });
if (deploy.status !== 0) process.exit(1);
