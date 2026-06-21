const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/github',
  passport.authenticate('github', { scope: ['repo'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.json({ message: "Login Successful", user: req.user });
  }
);



router.get('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
});

module.exports = router;