import { model, Schema } from "mongoose"


const subscriptionSchema = new Schema({
    subscriber:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    channal:{
        type:Schema.Types.ObjectId,
        ref:'Channel'
    },
})

export const Subscription = model('Subscription',subscriptionSchema)