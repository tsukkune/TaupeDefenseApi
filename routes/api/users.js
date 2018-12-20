const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');
const Users = mongoose.model('Users');
const Scores = mongoose.model('Scores');

//POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res, next) => {

  const { body: { user } } = req;

  //const user = req.body.user;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  Users.find({email:user.email})
  .then((data) => {
    if(data[0] != null){
      return res.status(422).json({
        errors: {
          email: 'already exist',
        },
      });
    }else{
      const finalUser = new Users(user);    
      finalUser.setPassword(user.password);
      return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }))
      .then(() => {const firstScore = new Scores({
        score:0,
        Users:finalUser.toAuthJSON()._id,
      });
      firstScore.save();
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  })
  .catch(function (error) {
    console.log(error);
  });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const { body: { user } } = req;

  if (!user.email) {
    return res.status(422).json({
      errors: {
        email: 'is required',
      },
    });
  }

  if (!user.password) {
    return res.status(422).json({
      errors: {
        password: 'is required',
      },
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      return res.json({ user: user.toAuthJSON() });
    }

    return res.status(403).json({
      errors: {
        user: 'invalid',
      },
    });
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      return res.json({ user: user });
    });
});

router.get('/all', auth.optional, (req, res, next) => {
  return Users.find()
    .then((user) => {
      return res.json({ user: user });
    });
});

router.put('/score',auth.required, (req, res, next)=>{
  const { payload: { id } } = req;
  const { body: { score } } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }
      
      return Scores.findOneAndUpdate({Users:user._id},{score:score.value},{new: true})
      .then((score)=>res.json({score:score}));
    });
})

module.exports = router;