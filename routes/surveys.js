var express = require('express'),
    User = require('../models/User'),
    Survey = require('../models/Survey'),
    Question = require('../models/Question');
var router = express.Router();

/* GET surveys list. */
router.get('/', function(req, res, next) {
  Survey.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('surveys/index', {surveys: docs});
  });
});

router.get('/new', function(req, res, next) {
  res.render('surveys/new', {survey: {}});
});

router.post('/', function(req, res, next) {
  var survey = new Survey({
    makerid: req.user.id,
    title: req.body.title,
    content: req.body.content
  });

  survey.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys');
  });
});

router.get('/:id', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    res.render('surveys/show', {survey: survey});
  });
});

router.get('/:id/edit', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    res.render('surveys/new', {survey: survey});
  });
});


module.exports = router;
