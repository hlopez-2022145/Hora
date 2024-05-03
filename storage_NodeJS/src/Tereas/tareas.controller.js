'use strict'

import Tarea from './tareas.model.js'
import User from '../user/user.model.js'

//ADD 
export const addTarea = async (req, res) => {
    try {
        let data = req.body
        //Obtenemos en id del autor logueado
        let authorId = req.user.id
        //agregamos el id del autor a los datos que queremos
        data.author = authorId

        let user = await User.findOne({ _id: data.author })
        if (!user) {
            return res.status(404).send({ msg: ' Usuario no encontrado' })
        }

        let tarea = new Tarea(data)
        await tarea.save()
        return res.status(200).send({ msg: 'Tarea agregada exitosamente' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al querer agregar una tarea' })
    }
}

//UPDATE
export const update = async (req, res) => {
    try {
        let { id } = req.params
        let data = req.body
        //Obtenemos el id del usuario logueado
        let authorId = req.user.id
        //agregamos el id del author a los datos que queremos actualizar
        data.author = authorId
        //verifiamos si la tarea existe y si usuario logueado es el author de la tarea
        let tarea = await Tarea.findOne({ _id: id, author: authorId })
        //Si el usuario logueado es distinto no lo dejara actualiza la tarea
        if (!tarea) {
            return res.status(401).send({ msg: 'No tienes permiso para actualizar, no es tu tarea' })
        }
        let updateTarea = await Tarea.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        )

        if (!updateTarea) {
            return res.status(404).send({ msg: 'Tarea no encontrada y no actualzada.' })
        }
        return res.status(200).send({ msg: 'Tarea actualizada: ', updateTarea })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al querer actualizar Tarea' })
    }
}

//DELETE 
export const deleteTarea = async (req, res) => {
    try {
        let { id } = req.params
        //Obtenemos el id del usuario logueado 
        let authorId = req.user.id
        //Verificiamos si la tarea tarea existe y si el usuario logueado es el author
        let tareaExist = await Tarea.findOne({ _id: id, author: authorId })
        //Si la tarea es del author loguedo lo dejara eliminar
        if (!tareaExist) {
            return res.status(401).send({ msg: 'No tienes permiso de eliminar, no es tu tarea' })
        }

        let deleteTa = await Tarea.findByIdAndDelete({ _id: id })
        if (!deleteTa.deleteCount === 0) {
            return res.status(404).send({ msg: 'Tarea no encontrada no eliminada' })
        }
        return res.status(200).send({ msg: 'Tarea eliminada exitosamente' })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al querer eliminar una tarea' })
    }
}

//LISTA DE TAREAS INCOMPLETAS 
export const listaIncompletas = async (req, res) => {
    try {
        // Buscamos todas las tareas incompletas
        let tareaIncompleta = await Tarea.find({ state: 'incompleta' })
            .populate('author', ['name', 'surname', '-_id'])

        // Verificamos si hay tareas incompletas
        if (tareaIncompleta.length === 0) {
            return res.status(404).send({ message: 'No se encontraron tareas incompletas' })
        }
        return res.send({ msg: 'Las tareas incompletas son: ', tareaIncompleta })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al querer obtener las tareas incompletas' })
    }
}

//LISTAR LAS TAREAS COMPLETAS 
export const listaCompletas = async (req, res) => {
    try {
        //Buscamos las tareas completas
        let tareasCompletas = await Tarea.find({ state: 'completa' })
            .populate('author', ['name', 'surname', '-_id'])
        //Verificamos si hay tareas completas
        if (tareasCompletas.length === 0) {
            return res.status(404).send({ msg: 'No se encontraron tareas completas' })
        }
        return res.status(200).send({ msg: 'Las tareas completas son: ', tareasCompletas })
    } catch (err) {
        console.error(err)
        return res.status(500).send({ msg: 'Error al querer obtner las tareas completas' })
    }
}

