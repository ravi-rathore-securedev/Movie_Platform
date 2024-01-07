import mongoose, {Schema} from 'mongoose'
import mongooseaggregatepaginate from 'mongoose-aggregate-paginate-v2'



const videoSchema = new Schema(
    {
        videoFiles:{
            type:String,
            required:true
        },
        thumbnails:{
            type:String,
            required:true
        },
        title:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        duration:{
            type:Number,
            required:true
        },
        views:{
            type:Number,
            default:0,
            required:true
        },
        isPublished:{
            type:Boolean,
            default:0
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }


},{timestamps:true})

// agrregation for watch history
videoSchema.plugin(mongooseaggregatepaginate)

export const Video = mongoose.model("Video",videoSchema)