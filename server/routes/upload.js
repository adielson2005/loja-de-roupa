const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { auth } = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// POST /api/upload - Upload de imagem única
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem enviada'
      });
    }

    const type = req.query.type || 'products';
    const originalPath = req.file.path;
    const ext = path.extname(req.file.filename);
    const baseName = path.basename(req.file.filename, ext);

    // Otimiza e redimensiona a imagem
    const optimizedFilename = `${baseName}-optimized.webp`;
    const optimizedPath = path.join(path.dirname(originalPath), optimizedFilename);

    await sharp(originalPath)
      .resize(800, 1000, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 85 })
      .toFile(optimizedPath);

    // Cria thumbnail
    const thumbFilename = `${baseName}-thumb.webp`;
    const thumbPath = path.join(path.dirname(originalPath), thumbFilename);

    await sharp(originalPath)
      .resize(300, 400, {
        fit: 'cover'
      })
      .webp({ quality: 80 })
      .toFile(thumbPath);

    // Remove original se não for webp
    if (ext.toLowerCase() !== '.webp') {
      fs.unlinkSync(originalPath);
    }

    const baseUrl = `/uploads/${type}`;

    res.json({
      success: true,
      message: 'Imagem enviada com sucesso',
      data: {
        url: `${baseUrl}/${optimizedFilename}`,
        original: `${baseUrl}/${optimizedFilename}`,
        thumbnail: `${baseUrl}/${thumbFilename}`,
        filename: optimizedFilename
      }
    });
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar imagem'
    });
  }
});

// POST /api/upload/multiple - Upload de múltiplas imagens
router.post('/multiple', auth, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Nenhuma imagem enviada'
      });
    }

    const type = req.query.type || 'products';
    const uploadedImages = [];

    for (const file of req.files) {
      const originalPath = file.path;
      const ext = path.extname(file.filename);
      const baseName = path.basename(file.filename, ext);

      // Otimiza
      const optimizedFilename = `${baseName}-optimized.webp`;
      const optimizedPath = path.join(path.dirname(originalPath), optimizedFilename);

      await sharp(originalPath)
        .resize(800, 1000, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 85 })
        .toFile(optimizedPath);

      // Thumbnail
      const thumbFilename = `${baseName}-thumb.webp`;
      const thumbPath = path.join(path.dirname(originalPath), thumbFilename);

      await sharp(originalPath)
        .resize(300, 400, {
          fit: 'cover'
        })
        .webp({ quality: 80 })
        .toFile(thumbPath);

      // Remove original se não for webp
      if (ext.toLowerCase() !== '.webp') {
        fs.unlinkSync(originalPath);
      }

      const baseUrl = `/uploads/${type}`;

      uploadedImages.push({
        original: `${baseUrl}/${optimizedFilename}`,
        thumbnail: `${baseUrl}/${thumbFilename}`,
        filename: optimizedFilename
      });
    }

    res.json({
      success: true,
      message: `${uploadedImages.length} imagens enviadas com sucesso`,
      data: uploadedImages
    });
  } catch (error) {
    console.error('Erro no upload múltiplo:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao processar imagens'
    });
  }
});

// DELETE /api/upload - Remove imagem
router.delete('/', auth, async (req, res) => {
  try {
    const { filename, type = 'products' } = req.body;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Nome do arquivo é obrigatório'
      });
    }

    const uploadDir = process.env.UPLOAD_PATH || './uploads';
    const baseName = path.basename(filename, path.extname(filename)).replace('-optimized', '').replace('-thumb', '');

    // Remove todas as versões
    const filesToDelete = [
      `${baseName}-optimized.webp`,
      `${baseName}-thumb.webp`,
      filename
    ];

    for (const file of filesToDelete) {
      const filePath = path.join(uploadDir, type, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    res.json({
      success: true,
      message: 'Imagem removida com sucesso'
    });
  } catch (error) {
    console.error('Erro ao remover imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro ao remover imagem'
    });
  }
});

module.exports = router;
