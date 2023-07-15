const fs = require('fs');

// Lê o arquivo "series.m3u" na pasta "lista"
fs.readFile('listas/filmes.m3u', 'utf8', (err, data) => {
  if (err) {
    console.error('Erro ao ler o arquivo:', err);
    return;
  }

  const items = data.split('#EXTINF');
  
  // Remove o primeiro item vazio
  items.shift();
  
  items.forEach(item => {
    const lines = item.trim().split('\n');
    const groupTitle = lines[0].match(/group-title="([^"]+)"/)[1];
    const fileName = `carLists/Movies ${groupTitle}.m3u`;
    const content = `#EXTINF${lines[0]}\n${lines[1]}\n`;
    
    // Adiciona o item ao arquivo correspondente
    fs.appendFile(fileName, content, 'utf8', err => {
      if (err) {
        console.error('Erro ao escrever o arquivo:', err);
      }
    });
  });
});
