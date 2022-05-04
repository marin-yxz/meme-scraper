import * as fs from 'node:fs';
import Axios from 'axios';
import fetch from 'node-fetch';

const response = await fetch(
  'https://memegen-link-examples-upleveled.netlify.app/',
);

const body = await response.text();

const body1 = body.replace(/\s/g, '');
const sources = body1
  .match(/<img[^>]*src="[^"]*"[^>]*>/gm)
  .map((x) => x.replace(/.*src="([^"]*)".*/, '$1'));
console.log(sources[2]);

const folderName = 'memes';

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }
} catch (err) {
  console.error(err);
}

async function downloadImage(url, filepath) {
  const response1 = await Axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  return new Promise((resolve, reject) => {
    response1.data
      .pipe(fs.createWriteStream(filepath))
      .on('error', reject)
      .once('close', () => resolve(filepath));
  });
}
for (let i = 1; i <= 10; i++) {
  downloadImage(sources[i], `${folderName}/0${i}.jpg`).catch('');
}
