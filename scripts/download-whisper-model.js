const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_URL = 'https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small-q5_1.bin';
const OUTPUT_DIR = path.join(__dirname, '../android/app/src/main/assets');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'ggml-small-q5_1.bin');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log(`Downloading Whisper model from ${MODEL_URL}...`);
console.log(`Saving to ${OUTPUT_FILE}`);

const file = fs.createWriteStream(OUTPUT_FILE);

https.get(MODEL_URL, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download model: ${response.statusCode} ${response.statusMessage}`);
    return;
  }

  const totalSize = parseInt(response.headers['content-length'], 10);
  let downloadedSize = 0;

  response.pipe(file);

  response.on('data', (chunk) => {
    downloadedSize += chunk.length;
    const percentage = ((downloadedSize / totalSize) * 100).toFixed(2);
    process.stdout.write(`\rProgress: ${percentage}%`);
  });

  file.on('finish', () => {
    file.close(() => {
      console.log('\nDownload completed successfully!');
    });
  });
}).on('error', (err) => {
  fs.unlink(OUTPUT_FILE, () => {}); // Delete the file async. (But we don't check the result)
  console.error(`Error downloading model: ${err.message}`);
});
