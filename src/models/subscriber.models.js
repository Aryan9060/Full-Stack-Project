import { model, Schema } from "mongoose"


const subscriberSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    chennal:{
        type:Schema.Types.ObjectId,
        ref:'Channel'
    },
})

export const Subscriber = model('Subscriber',subscriberSchema)