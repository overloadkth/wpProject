var express = require('express'),
    User = require('../models/User'),
    Survey = require('../models/Survey'),
    Question = require('../models/Question');
var router = express.Router();

function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash('danger', '로그인이 필요합니다.');
    res.redirect('/signin');
  }
}

/* GET surveys list. */
router.get('/', needAuth, function(req, res, next) {
  Survey.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('surveys/index', {surveys: docs});
  });
});

/* Make New */
router.get('/new', needAuth, function(req, res, next) {
  res.render('surveys/new', {survey: {}});
});

router.post('/', needAuth, function(req, res, next) {
  var survey = new Survey({
    makerid: req.user.id,
    title: req.body.title,
    comment: req.body.comment
  });
  survey.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/surveys');
  });
});

/* Show */
router.get('/:id', needAuth, function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Question.find({survey_id: survey.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('surveys/show', {survey: survey, questions: questions});
    });
  });
});

/* Edit */
router.get('/:id/edit', needAuth, function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    res.render('surveys/new', {survey: survey});
  });
});

router.put('/:id', needAuth, function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    survey.title = req.body.title;
    survey.comment = req.body.comment;

    survey.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys');
    });
  });
});

/* Delete */
router.delete('/:id', needAuth, function(req, res, next) {
  Survey.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    Question.find({survey_id: req.params.id}).remove(function(err, questions) {
      if (err) {
        return next(err);
      }
    });
    res.redirect('/surveys');
  });
});

router.get('/question/:id/edit', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if (err) {
      return next(err);
    }
    res.render('surveys/edit', {question: question});
  });
});

router.put('/question/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, question) {
    if (err) {
      return next(err);
    }
    question.content = req.body.content;
    question.selection[0].selection1 = req.body.selection1;
    question.selection[0].selection2 = req.body.selection2;
    question.selection[0].selection3 = req.body.selection3;
    question.selection[0].selection4 = req.body.selection4;
    question.selection[0].selection5 = req.body.selection5;

    question.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + question.survey_id);
    });
  });
});

router.post('/:id/questions', function(req, res, next) {
  var question = new Question({
    surveyid: req.params.id,
    content: req.body.content,
    type: req.body.type
  });
  question.selection.push({
    selection1: req.body.selection1,
    selection2: req.body.selection2,
    selection3: req.body.selection3,
    selection4: req.body.selection4,
    selection5: req.body.selection5
  });

  question.save(function(err){
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(req.params.id, {$inc: {numQuestion: 1}}, function(err, survey) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + req.params.id);
    });
  });
});

router.delete('/question/:id', function(req, res, next) {
  Question.findOneAndRemove({_id: req.params.id}, function(err, question) {
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(question.survey_id, {$inc: {numQuestion: -1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + question.survey_id);
    });
  });
});

module.exports = router;
