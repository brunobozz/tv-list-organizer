import { createWriteStream, promises as fsPromises } from 'fs';
import { Readable } from 'stream';
import fetch from 'node-fetch';
import path from 'path';

const downloadFile = async (url, filePath) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Response is not ok.');
  }

  const writeStream = createWriteStream(filePath);

  // Reference https://stackoverflow.com/a/66629140/12817553
  const readable = Readable.from(await response.buffer());

  readable.pipe(writeStream);

  await new Promise((resolve, reject) => {
    readable.on('end', resolve);
    readable.on('error', reject);
  });
};

const m3uFilePath = 'listas/anosincriveis.m3u';

// Lê o arquivo m3u
const data = await fsPromises.readFile(m3uFilePath, 'utf8');

const items = data.split('#EXTINF').map((item) => item.trim());

// Remove o primeiro item vazio
items.shift();

// Cria a pasta "downloads" se não existir
const downloadsFolder = 'downloads';
await fsPromises.mkdir(downloadsFolder, { recursive: true });

for (const item of items) {
  const extInfLine = item.split('\n')[0];
  const httpLine = item.split('\n')[1];

  const tvgNameMatch = extInfLine.match(/tvg-name="([^"]+)"/);
  if (tvgNameMatch) {
    const tvgName = tvgNameMatch[1];

    const fileName = `${tvgName}.mp4`;
    const filePath = path.join(downloadsFolder, fileName);

    try {
      await downloadFile(httpLine, filePath);
      console.log(`Arquivo "${fileName}" baixado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao baixar o arquivo "${fileName}":`, error);
    }
  }
}

console.log('Todos os downloads foram concluídos.');
