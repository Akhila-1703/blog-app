import { Schema, model } from "mongoose";

// Comment Schema
const userCommentSchema = new Schema(
{
    user:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },

    comment:{
        type:String,
        required:[true,"Comment is required"],
        trim:true,
        minlength:[2,"Comment should contain atleast 2 characters"],
        maxlength:[500,"Comment cannot exceed 500 characters"],
        validate:{
            validator:function(value){
                return value.trim().length > 0
            },
            message:"Comment cannot be empty"
        }
    }

},
{ timestamps:true }
)

// Article Schema
const articleSchema = new Schema({

    author:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:[true,"Author Id required"]
    },

    title:{
        type:String,
        required:[true,"Title is required"],
        trim:true,
        minlength:[3,"Title should contain atleast 3 characters"],
        maxlength:[120,"Title cannot exceed 120 characters"],
        validate:{
            validator:function(value){
                return value.trim().length > 0
            },
            message:"Title cannot be empty"
        }
    },

    category:{
        type:String,
        required:[true,"Category is required"],
        enum:{
            values:[
                "technology",
                "programming",
                "AI",
                "web development"
            ],
            message:"Invalid category selected"
        },
        trim:true
    },

    content:{
        type:String,
        required:[true,"Content is required"],
        trim:true,
        minlength:[20,"Content should contain atleast 20 characters"],
        maxlength:[10000,"Content cannot exceed 10000 characters"],
        validate:{
            validator:function(value){
                return value.trim().length > 0
            },
            message:"Content cannot be empty"
        }
    },

    comments:[userCommentSchema],

    isArticleActive:{
        type:Boolean,
        default:true
    },

},
{
    timestamps:true,
    strict:"throw",
    versionKey:false
})

// indexes
articleSchema.index({ author: 1 })

articleSchema.index({ category: 1 })

export const ArticleModel = model('article', articleSchema)


/*import { Schema, model } from "mongoose";

//Create user comment schema
const userCommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  comment: {
    type: String,
  },
});

//create article schema
const articleSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Author ID required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    comments: [userCommentSchema],
    isArticleActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);

//Create article model
export const ArticleModel = model("article", articleSchema);*/