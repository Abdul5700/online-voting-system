import express from 'express'; import { body,validationResult } from 'express-validator'; import multer from 'multer'; import path from 'path'; import { authenticate,allow } from './middleware/auth.js'; import * as auth from './controllers/authController.js'; import * as elections from './controllers/electionController.js'; import * as candidates from './controllers/candidateController.js'; import * as votes from './controllers/voteController.js';
const r=express.Router(), check=req=>{const x=validationResult(req);if(!x.isEmpty())throw Object.assign(new Error(x.array()[0].msg),{status:422})}; const validate=rules=>(req,res,next)=>{try{check(req);next()}catch(e){next(e)}};
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => cb(null, /image\/(jpeg|png|webp)/.test(file.mimetype))
});
r.post('/auth/register',[body('fullName').trim().isLength({min:2}),body('usn').trim().isLength({min:3}),body('email').isEmail().normalizeEmail(),body('password').isLength({min:8}).withMessage('Password must be at least 8 characters')],validate(),auth.register); r.post('/auth/login',[body('email').isEmail(),body('password').notEmpty()],validate(),auth.login);r.get('/auth/me',authenticate,auth.me);
r.get('/elections',elections.list);r.get('/elections/:id',elections.getOne);r.post('/elections',authenticate,allow('admin'),elections.create);r.put('/elections/:id',authenticate,allow('admin'),elections.update);r.delete('/elections/:id',authenticate,allow('admin'),elections.remove);
r.post('/candidates',authenticate,allow('admin'),upload.single('image'),candidates.create);r.put('/candidates/:id',authenticate,allow('admin'),upload.single('image'),candidates.update);r.delete('/candidates/:id',authenticate,allow('admin'),candidates.remove);
r.post('/votes',authenticate,allow('voter'),votes.castVote);r.get('/votes/history',authenticate,votes.history);r.get('/results/:id',authenticate,votes.results);export default r;
