var express = require('express'),
    User = require('../models/User'),
    Survey = require('../models/Survey'),
    Question = require('../models/Question'),
    Answer = require('../models/Answer');
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

// New Survey
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

// Show Survey
router.get('/:id', needAuth, function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Question.find({surveyid: survey.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('surveys/show', {survey: survey, questions: questions});
    });
  });
});

// Edit Survey
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

// Delete Survey
router.delete('/:id', needAuth, function(req, res, next) {
  Survey.findOneAndRemove(req.params.id, function(err) {
    if (err) {
      return next(err);
    }
    Question.find({surveyid: req.params.id}).remove(function(err, questions) {
      if (err) {
        return next(err);
      }
    });
    res.redirect('/surveys');
  });
});

// New Question
router.post('/:id/questions', function(req, res, next) {
  var question = new Question({
    surveyid: req.params.id,
    content: req.body.content,
    type: req.body.type,
    select1: req.body.select1,
    select2: req.body.select2,
    select3: req.body.select3,
    select4: req.body.select4,
    select5: req.body.select5
  });
  question.save(function(err){
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(req.params.id, {$inc: {numQuestions: 1}}, function(err, survey) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + req.params.id);
    });
  });
});

//  Edit Question
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
    question.select1 = req.body.select1;
    question.select2 = req.body.select2;
    question.select3 = req.body.select3;
    question.select4 = req.body.select4;
    question.select5 = req.body.select5;

    question.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + question.surveyid);
    });
  });
});

// Delete Question
router.delete('/question/:id', function(req, res, next) {
  Question.findOneAndRemove({_id: req.params.id}, function(err, question) {
    if (err) {
      return next(err);
    }
    Survey.findByIdAndUpdate(question._surveyid, {$inc: {numQuestions: -1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/surveys/' + question.surveyid);
    });
  });
});

// New Ansewer
router.get('/:id/answer', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    Question.find({surveyid: survey.id}, function(err, questions) {
      if (err) {
        return next(err);
      }
      res.render('surveys/answer', {survey:survey, questions: questions});
    });
  });
});

router.post('/:id/answer', function(req, res, next) {
  Question.findById(req.params.id, function(err, survey) {
    if (err) {
      return next(err);
    }
    var answer = new Answer({
      surveyid: req.params.id,
      questionid: req.params.id,
      answer: req.body.answer,
      select1: req.body.select1,
      select2: req.body.select2,
      select3: req.body.select3,
      select4: req.body.select4,
      select5: req.body.select5
    });
    answer.save(function(err){
      if (err) {
        return next(err);
      }
    });
    res.redirect('/surveys/' + req.params.id);
  });
});

router.get(':/id/result', function(req, res, next) {
  Survey.findById(req.params.id, function(err, survey) {
    if(err) {
      return next(err);
    }
    Question.findById({surveyid: survey.id}, function(err, questions) {
      if(err) {
        return next(err);
      }
      Answer.findById({surveyid: survey.id}, function(err, answers) {
        if(err) {
          return next(err);
        }
        res.render('surveys/result', {survey:survey, questions:questions, answers:answers});
      });
    });
  });
});

module.exports = router;
