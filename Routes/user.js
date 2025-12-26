import expresss from 'express'
import { login, profile, register, users } from '../Controllers/user.js';
import { Authenticated } from '../Middlewares/Auth.js';

const router = expresss.Router();


// register user
//=> /api/user/register
router.post('/register',register)

// login user
router.post('/login',login)

// get all user
router.get('/all',users)

// get user profile
router.get('/profile',Authenticated,profile)


export default router