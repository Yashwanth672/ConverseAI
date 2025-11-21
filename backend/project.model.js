import mongoose from 'mongoose';


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true,
        required: true,
        trim: true,
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    // Track which user added which collaborator
    userAddedBy: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
        }
    ],
    fileTree: {
        type: Object,
        default: {}
    },

})

// Create compound index: name + users for per-user uniqueness
projectSchema.index({ name: 1, users: 1 }, { unique: true });


const Project = mongoose.model('project', projectSchema)


export default Project;