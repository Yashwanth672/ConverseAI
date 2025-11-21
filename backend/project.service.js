import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';

export const createProject = async ({
    name, userId
}) => {
    if (!name) {
        throw new Error('Name is required')
    }
    if (!userId) {
        throw new Error('UserId is required')
    }

    let project;
    try {
        project = await projectModel.create({
            name,
            users: [ userId ],
            userAddedBy: [{ user: userId, addedBy: userId }]
        });
    } catch (error) {
        // Preserve Mongo duplicate-key error code so higher layers can respond with 409
        if (error && error.code === 11000) {
            const dupErr = new Error('Project name must be unique per user');
            dupErr.code = 11000;
            throw dupErr;
        }
        throw error;
    }

    return project;

}


export const getAllProjectByUserId = async ({ userId }) => {
    if (!userId) {
        throw new Error('UserId is required')
    }

    const allUserProjects = await projectModel.find({
        users: userId
    })

    return allUserProjects
}

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!users) {
        throw new Error("users are required")
    }

    if (!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid userId(s) in users array")
    }

    if (!userId) {
        throw new Error("userId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId")
    }


    const project = await projectModel.findOne({
        _id: projectId,
        users: userId
    })

    console.log(project)

    if (!project) {
        throw new Error("User not belong to this project")
    }

    // Ensure existing project and membership
    const projectDoc = await projectModel.findById(projectId)

    if (!projectDoc) {
        throw new Error('Project not found')
    }

    // Check current user belongs to project
    if (!projectDoc.users.map(u => u.toString()).includes(userId.toString())) {
        throw new Error('User not belong to this project')
    }

    // Add users to users array and track who added them
    const newUsers = users.filter(u => !projectDoc.users.map(x => x.toString()).includes(u.toString()))

    if (newUsers.length > 0) {
        projectDoc.users.push(...newUsers)
        // add userAddedBy entries for each newly added user
        newUsers.forEach(u => {
            projectDoc.userAddedBy.push({ user: u, addedBy: userId })
        })
        await projectDoc.save()
    }

    const updatedProject = await projectModel.findById(projectId).populate('users').populate('userAddedBy.user').populate('userAddedBy.addedBy')

    return updatedProject



}

export const getProjectById = async ({ projectId }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    let project = await projectModel.findOne({
        _id: projectId
    }).populate('users').populate('userAddedBy.user').populate('userAddedBy.addedBy')

    // Backfill userAddedBy entries for legacy projects that don't have mapping
    if (project) {
        const mappedUserIds = (project.userAddedBy || []).map(e => e.user && (e.user._id ? e.user._id.toString() : e.user.toString()))
        const missingUsers = project.users.filter(u => !mappedUserIds.includes(u._id.toString()))

        if (missingUsers.length > 0) {
            // assume the first user in project.users is the owner/adder for legacy entries
            const ownerId = project.users[0] && (project.users[0]._id ? project.users[0]._id : project.users[0])
            missingUsers.forEach(mu => {
                project.userAddedBy.push({ user: mu._id ? mu._id : mu, addedBy: ownerId })
            })
            // save and re-populate
            await project.save()
            project = await projectModel.findById(projectId).populate('users').populate('userAddedBy.user').populate('userAddedBy.addedBy')
        }
    }

    return project;
}

export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }

    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })

    return project;
}

export const removeUserFromProject = async ({ projectId, userIdToRemove, requestingUserId }) => {
    if (!projectId) throw new Error('projectId is required')
    if (!mongoose.Types.ObjectId.isValid(projectId)) throw new Error('Invalid projectId')
    if (!userIdToRemove) throw new Error('userIdToRemove is required')
    if (!mongoose.Types.ObjectId.isValid(userIdToRemove)) throw new Error('Invalid userIdToRemove')
    if (!requestingUserId) throw new Error('requestingUserId is required')
    if (!mongoose.Types.ObjectId.isValid(requestingUserId)) throw new Error('Invalid requestingUserId')

    const project = await projectModel.findById(projectId)
    if (!project) throw new Error('Project not found')

    // find the mapping for this user
    const mapping = project.userAddedBy.find(entry => entry.user.toString() === userIdToRemove.toString())
    if (!mapping) throw new Error('User not part of project')

    // only allow removal if the requesting user is the one who added them
    if (mapping.addedBy.toString() !== requestingUserId.toString()) {
        throw new Error('You are not authorized to remove this user')
    }

    // remove from users array and userAddedBy
    project.users = project.users.filter(u => u.toString() !== userIdToRemove.toString())
    project.userAddedBy = project.userAddedBy.filter(entry => entry.user.toString() !== userIdToRemove.toString())

    await project.save()

    const updated = await projectModel.findById(projectId).populate('users').populate('userAddedBy.user').populate('userAddedBy.addedBy')
    return updated
}