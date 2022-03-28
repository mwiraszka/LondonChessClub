const express = require('express');
const multer = require('multer');

const Article = require('../models/article');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('[Server] Failed to store image. Invalid MIME type.');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  },
});

router.post('', multer({ storage: storage }).single('headerImage'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const article = new Article({
    title: req.body.title,
    subtitle: req.body.subtitle,
    headerImage: url + '/images/' + req.file.filename,
    authorUserId: req.body.authorUserId,
    dateCreated: req.body.dateCreated,
    dateEdited: req.body.dateEdited,
    body: req.body.body,
  });
  article.save().then((addedArticle) => {
    res.status(201).json({
      statusCode: 201,
      payload: {
        addedArticle: addedArticle,
      },
    });
  });
});

router.get('', (req, res, next) => {
  Article.find().then((articles) => {
    res.status(200).json({
      statusCode: 200,
      payload: {
        allArticles: articles,
      },
    });
  });
});

router.get('/:id', (req, res, next) => {
  Article.findById(req.params.id).then((article) => {
    if (article) {
      res.status(200).json({
        statusCode: 200,
        payload: {
          article: article,
        },
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        errorMessage: '[Server] Failed to find article',
      });
    }
  });
});

router.put(
  '/:id',
  multer({ storage: storage }).single('headerImage'),
  (req, res, next) => {
    let imagePath = req.body.headerImage;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }
    const article = new Article({
      _id: req.body._id,
      title: req.body.title,
      subtitle: req.body.subtitle,
      headerImage: imagePath,
      authorUserId: req.body.authorUserId,
      dateCreated: req.body.dateCreated,
      dateEdited: req.body.dateEdited,
      body: req.body.body,
    });
    Article.updateOne({ _id: req.params.id }, article).then((updateResult) => {
      if (updateResult.matchedCount === 1 && updateResult.modifiedCount === 1) {
        res.status(200).json({
          statusCode: 200,
          payload: {
            article: article,
          },
        });
      } else {
        res.status(500).json({
          statusCode: 500,
          errorMessage: `[Server] Failed to delete ${req.params.title} from database`,
        });
      }
    });
  }
);

router.delete('/:id', (req, res, next) => {
  Article.deleteOne({ _id: req.params.id }).then((deleteResult) => {
    if (deleteResult.deletedCount === 1) {
      res.status(200).json({
        statusCode: 200,
      });
    } else {
      res.status(500).json({
        statusCode: 500,
        errorMessage: `[Server] Failed to delete ${req.params.title} from database`,
      });
    }
  });
});

module.exports = router;
