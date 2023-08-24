const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

module.exports = (req, res, next) => {
  const inputImagePath = req.file.path;
  const outputDir = path.join(__dirname, '..', 'images', 'resized');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputFilename = req.file.filename.replace(/\.[^/.]+$/, '.webp');
  const outputImagePath = path.join(outputDir, outputFilename);

  console.log(inputImagePath);
  console.log(outputImagePath);

  sharp(inputImagePath)
    .resize(206, 260)
    .toFile(outputImagePath, (err) => {
      if (err) {
        console.error('Erreur lors du redimensionnement de l\'image :', err);
      } else {
        fs.unlinkSync(inputImagePath);
      }
    });

  next();
};
