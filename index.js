import * as fs from 'node:fs';
import https from 'node:https';
import Axios from 'axios';

const options = {
  hostname: 'memegen-link-examples-upleveled.netlify.app',
  port: 443,
  path: '/',
  method: 'GET',
};
let html = '';
const req = https.request(options, (res) => {
  console.log(`statusCode: ${res.statusCode}`);
  res
    .on('data', (d) => {
      html += d;
    })
    .on('end', () => {
      const body1 = html.replace(/\s/g, '');
      const sources = body1
        .match(/<img[^>]*src="[^"]*"[^>]*>/gm)
        .map((x) => x.replace(/.*src="([^"]*)".*/, '$1'));

      console.log(sources[0]);
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
        downloadImage(sources[i], `memes/0${i}.jpg`).catch('');
      }
      try {
        if (!fs.existsSync('memes')) {
          fs.mkdirSync('memes');
        }
      } catch (err) {
        console.error(err);
      }
    });
});
req.on('error', (error) => {
  console.error(error);
});
req.end();
