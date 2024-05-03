import {Router} from 'express'
import { login, register } from './user.controller.js'

const api = Router()

api.post('/register', register)
api.post('/login', login)

export default api