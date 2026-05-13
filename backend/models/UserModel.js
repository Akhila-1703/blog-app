import { Schema, model } from "mongoose";

const UserSchema = new Schema({

  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
    minlength: [2, "First name should contain atleast 2 characters"],
    maxlength: [30, "First name cannot exceed 30 characters"],
    validate: {
      validator: function(value) {
        return value.trim().length > 0
      },
      message: "First name cannot be empty"
    }
  },

  lastName: {
    type: String,
    trim: true,
    maxlength: [30, "Last name cannot exceed 30 characters"],
    validate: {
      validator: function(value) {

        // allow empty last name
        if (!value) return true

        return value.trim().length > 0
      },
      message: "Last name cannot be empty"
    }
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: [true, "Email already existed"],
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Invalid email format"
    ]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should contain atleast 6 characters"],
    maxlength: [100, "Password is too long"],
    validate: {
      validator: function(value) {
        return value.trim().length > 0
      },
      message: "Password cannot be empty"
    }
  },

  profileImageUrl: {
    type: String,
    default: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  },

  role: {
    type: String,
    enum: {
      values: ["AUTHOR", "USER", "ADMIN"],
      message: "{VALUE} is an invalid role"
    },
    required: [true, "Role is required"]
  },

  isActive: {
    type: Boolean,
    default: true,
  },

},
{
  timestamps: true,
  strict: "throw",
  versionKey: false
})

// indexes
UserSchema.index({ email: 1 })

export const UserTypeModel = model("user", UserSchema);



/*import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already existed"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    profileImageUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ["AUTHOR", "USER", "ADMIN"],
      required: [true, "{Value} is an invalid role"],
    },
    isActive: {
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

//create model
export const UserTypeModel = model("user", userSchema);*/