import { Schema, model } from 'mongoose'

export const tareaSchema = ({
    taskname: {
        type: String,
        required: [true, 'Es obligatorio el nombre de la tarea']
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    startDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria']
    },
    dateClose: {
        type: Date,
        required: [true, 'La fecha de cierre es obligatoria']
    },
    state: {
        type: String,
        enum: ['completa', 'incompleta'],
        default: 'incompleta'
    },
    author: {
        type: Schema.ObjectId,
        ref: 'user',
        required: true
    }
})

export default model('tarea', tareaSchema)