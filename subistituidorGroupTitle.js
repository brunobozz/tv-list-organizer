const fs = require("fs");

// Lê os arquivos na pasta "listasSeparadas"
fs.readdir("listasSeparadas", (err, files) => {
  if (err) {
    console.error("Erro ao ler os arquivos:", err);
    return;
  }

  // Itera sobre cada arquivo na pasta
  files.forEach((file) => {
    const filePath = `listasSeparadas/${file}`;

    // Lê o arquivo
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(`Erro ao ler o arquivo ${file}:`, err);
        return;
      }

      const items = data.split("#EXTINF");

      // Remove o primeiro item vazio
      items.shift();

      let modifiedContent = "";
      items.forEach((item) => {
        const lines = item.trim().split("\n");
        const tvgName = lines[0].match(/tvg-name="([^"]+)"/)[1];
        const string1 = tvgName.slice(-6);
        const string2 = tvgName.slice(0, -6);

        // Modifica os valores de tvg-name e group-title
        str = lines[0].replace(/,(.*)$/, ","+string1);
        console.log(str);
        lines[0] = lines[0].replace(tvgName, string1);
        lines[0] = lines[0].replace(
          /group-title="([^"]+)"/,
          `group-title="${string2}"`
        );

        modifiedContent += `#EXTINF${lines[0]}\n${lines[1]}\n`;
      });

      const seriesFilePath = `series/${file}`;

      // Salva o arquivo modificado na pasta "series"
      fs.writeFile(seriesFilePath, modifiedContent, "utf8", (err) => {
        if (err) {
          console.error(`Erro ao salvar o arquivo ${seriesFilePath}:`, err);
        }
      });
    });
  });
});
