const fs = require("fs");

// Lê o arquivo "series.m3u" na pasta "lista"
fs.readFile("listas/series.m3u", "utf8", (err, data) => {
  if (err) {
    console.error("Erro ao ler o arquivo:", err);
    return;
  }

  const items = data.split("#EXTINF");
  //salva as duas primeiras linhas da lista
  listaIni = items[0];

  // Remove o primeiro item vazio
  items.shift();

  const groups = [];
  let currentGroup = null;

  items.forEach((item) => {
    const lines = item.trim().split("\n");
    let extInfLine = lines[0];
    const httpLine = lines[1];

    const groupTitleMatch = extInfLine.match(/group-title="([^"]+)"/);
    if (groupTitleMatch) {
      const groupTitle = groupTitleMatch[1];
      const tvgNameMatch = extInfLine.match(/tvg-name="([^"]+)"/);
      if (tvgNameMatch) {
        const tvgName = tvgNameMatch[1];
        const string1 = tvgName.slice(-6);
        const string2 = tvgName.slice(0, -7);

        if (!currentGroup || currentGroup.fileName !== groupTitle) {
          currentGroup = {
            fileName: groupTitle,
            list: listaIni + "/n",
          };
          groups.push(currentGroup);
        }

        extInfLine = extInfLine.replace(tvgName, string1);
        extInfLine = extInfLine.replace(
          /group-title="([^"]+)"/,
          `group-title="${string2}"`
        );
        extInfLine = extInfLine.replace("," + string2 + " ", ",");

        currentGroup.list += `#EXTINF${extInfLine}\n${httpLine}\n`;
      }
    }
  });

  // Salva os arquivos .m3u na pasta "listasSeparadas/"
  groups.forEach((group) => {
    const fileName = `series/${group.fileName}.m3u`;

    fs.writeFile(fileName, group.list, "utf8", (err) => {
      if (err) {
        console.error(`Erro ao salvar o arquivo ${fileName}:`, err);
      }
    });
  });
});
