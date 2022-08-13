const {Router} = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const router = Router()

//register router
router.post('/register',
    [
        check('email', 'Некорректный email!').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res)=>{
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректный данные при регистрации'
            })
        }
        const {email, password} = req.body

        const candidate = await User.findOne({email})

        if(candidate){
            return res.status(400).json({message: 'This user already exist'})
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = new User({email, password: hashedPassword})

        await user.save()

        res.status(201).json({message: "User created"})

    }
    catch (e) {
        res.status(500).json({message:"Server error"})
    }
})

//login router
router.post('/login',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
    ],
    async (req, res)=>{
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Некорректный данные при входе в систему'
            })
        }

        const {email, password} = req.body

        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
        }

        const token = jwt.sign(
            { userId: user.id },
            'Kremlejija',
            { expiresIn: '1h' }
        )

        res.json({ token, userId: user.id })

    }
    catch (e) {
        res.status(500).json({message:"Server error"})
    }
})

module.exports = router