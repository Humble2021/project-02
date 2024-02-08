const fs = require("fs");
const path = require("path");

const previousContent = new Map();

function readFilesInDirectory(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);

    const jsAndJsonFiles = files.filter((file) => {
      const ext = path.extname(file);
      return ext === ".js" || ext === ".json";
    });

    console.log(`Reading files in directory: ${directoryPath}`);
    console.log("===============================================");

    jsAndJsonFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      const data = fs.readFileSync(filePath, "utf8");

      console.log(`File Name: ${file}`);
      //console.log(`Content:\n${data}`);
      console.log("-----------------------------------------------");

      previousContent.set(filePath, data.split("\n"));
    });

    console.log("Files read successfully.");
    console.log("-----------------------------------------------");

    fs.watch(directoryPath, (eventType, filename) => {
      console.log(`Event type: ${eventType}`);
      if (filename) {
        console.log(`Filename: ${filename}`);
        const filePath = path.join(directoryPath, filename);
        const newData = fs.readFileSync(filePath, "utf8");
        const previousData = previousContent.get(filePath);

        console.log("Changes:");
        console.log("-----------------------------------------------");

        const newLines = newData.split("\n");
        const previousLines = previousData;

        newLines.forEach((line, index) => {
          if (previousLines[index] !== line) {
            console.log(`Line ${index + 1}:`);
            console.log(`- ${previousLines[index]}`);
            console.log(`+ ${line}`);
            console.log("-----------------------------------------------");
          }
        });

        previousContent.set(filePath, newLines);
      } else {
        console.log("Filename not provided.");
        console.log("-----------------------------------------------");
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

readFilesInDirectory(__dirname);
