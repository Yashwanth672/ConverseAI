import projectModel from '../models/project.model.js';
import * as projectService from '../services/project.service.js';
import userModel from '../models/user.model.js';
import { validationResult } from 'express-validator';
import ProjectModel from '../models/project.model.js'


export const createProject = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.error('❌ Validation Error - createProject:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        console.log('📝 Creating project with data:', req.body);
        const { name } = req.body;
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await projectService.createProject({ name, userId });
        console.log('✅ Project created successfully:', newProject._id);

        res.status(201).json(newProject);

    } catch (err) {
        console.error('❌ Error creating project:', err);
        // If Mongo duplicate key error (11000) — return 409 Conflict with a clear message
        if (err && err.code === 11000) {
            return res.status(409).json({ message: 'Project name must be unique per user' });
        }

        // Default to 400 for other validation/service errors
        return res.status(400).json({ message: err.message || 'Failed to create project' });
    }

}

export const getAllProject = async (req, res) => {
    try {

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUserProjects = await projectService.getAllProjectByUserId({
            userId: loggedInUser._id
        })

        return res.status(200).json({
            projects: allUserProjects
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }
}

export const addUserToProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, users } = req.body

        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })


        const project = await projectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        })

        return res.status(200).json({
            project,
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }


}

export const removeUserFromProject = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { projectId, userId } = req.body;

        const loggedInUser = await userModel.findOne({ email: req.user.email });

        const project = await projectService.removeUserFromProject({
            projectId,
            userIdToRemove: userId,
            requestingUserId: loggedInUser._id
        })

        return res.status(200).json({ project })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const getProjectById = async (req, res) => {

    const { projectId } = req.params;

    try {

        const project = await projectService.getProjectById({ projectId });

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}

export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}
export const deleteProjectById = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await ProjectModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Project not found' });
        }

        return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
