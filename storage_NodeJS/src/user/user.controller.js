'use strict'

import { checkPassword, encrypt } from '../utils/validator.js'
import User from './user.model.js'
import { generateJwt } from '../utils/jwt.js'

//REGISTER
export const register = async (req, res) => {
    try {
        let data = req.body
        data.password = await encrypt(data.password)
        let user = new User(data)
        await user.save()
        return res.send({ msg: 'Registered successfully' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error registerin user', err })
    }
}

//LOGIN 
export const login = async (req, res) => {
    try {
        let { email, password } = req.body
        let user = await User.findOne({ $or: [{ email }] })
        //Si no coincide con ningun criterio dara los siguientes mensajes
        if (!user) {
            //Verifica que criterio se mando a buscar y depende de eso dara el mensaje asignado a cada uno
            if (email) {
                return res.status(404).send({ msg: 'El correo que ingresó no está conectado a una cuenta.' })
            } 
        }

        if (user && await checkPassword(password, user.password)) {
            let loggedUser = {
                uid: user._id,
                email: user.mail,
                names: user.names
            }
            let token = await generateJwt(loggedUser)
            return res.send({
                msg: `Welcome ${user.name}`,
                loggedUser,
                token
            })
        }
        return res.status(404).send({ msg: 'Credenciales invalidas' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al iniciar sesión', err })
    }
}