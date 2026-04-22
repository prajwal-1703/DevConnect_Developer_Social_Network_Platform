import Project from "../models/Project.js";
import Like from "../models/Like.js";
import Tag from "../models/Tag.js";
// 📍 Create project
// export const createProject = async (req, res) => {
//   try {
//     const { title, description, githubLink, imageUrl, tags } = req.body;

//     const newProject = await Project.create({
//       userId: req.user.id,
//       title,
//       description,
//       githubLink,
//       imageUrl,
//       tags,
//     });

//     res.status(201).json(newProject);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };

export const createProject = async (req, res) => {
  try {
    const { title, description, githubLink, imageUrl, tags, status } = req.body; // tags as strings

    // Ensure tags exist in DB
    await Promise.all(
      tags.map(async (tag) => {
        await Tag.findOneAndUpdate(
          { name: tag },
          { name: tag },
          { upsert: true, new: true }
        );
      })
    );

    // Fetch tag IDs
    const tagDocs = await Tag.find({ name: { $in: tags } });

    const newProject = await Project.create({
      userId: req.user.id,
      title,
      description,
      githubLink,
      imageUrl,
      status,
      tags: tagDocs.map(t => t._id) // store ObjectIds in project
    });

    // Return populated document so frontend sees tag names immediately
    const populated = await Project.findById(newProject._id)
      .populate("userId", "username profilePicUrl")
      .populate("tags");

    // add likes meta
    const likesCount = await Like.countDocuments({ projectId: populated._id });
    const isLiked = req.user ? !!(await Like.findOne({ projectId: populated._id, userId: req.user.id })) : false;

    res.status(201).json({ ...populated.toObject(), likesCount, isLiked });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};



// 📍 Get all projects
export const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("userId", "username profilePicUrl")
      .populate("tags")
      .sort({ createdAt: -1 });

    const userId = req.user?.id;
    const enriched = await Promise.all(projects.map(async (p) => {
      const likesCount = await Like.countDocuments({ projectId: p._id });
      const isLiked = userId ? !!(await Like.findOne({ projectId: p._id, userId })) : false;
      return { ...p.toObject(), likesCount, isLiked };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get projects by user
export const getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.params.userId })
      .populate("userId", "username profilePicUrl")
      .populate("tags")
      .sort({ createdAt: -1 });

    const userId = req.user?.id;
    const enriched = await Promise.all(projects.map(async (p) => {
      const likesCount = await Like.countDocuments({ projectId: p._id });
      const isLiked = userId ? !!(await Like.findOne({ projectId: p._id, userId })) : false;
      return { ...p.toObject(), likesCount, isLiked };
    }));

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("userId", "username profilePicUrl")
      .populate("tags");

    if (!project) return res.status(404).json({ msg: "Project not found" });

    const likesCount = await Like.countDocuments({ projectId: project._id });
    const isLiked = req.user ? !!(await Like.findOne({ projectId: project._id, userId: req.user.id })) : false;
    res.json({ ...project.toObject(), likesCount, isLiked });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// 📍 Update project
// export const updateProject = async (req, res) => {
//   try {
//     const project = await Project.findById(req.params.id);
//     if (!project) return res.status(404).json({ msg: "Project not found" });

//     if (project.userId.toString() !== req.user.id) {
//       return res.status(403).json({ msg: "Not authorized to update this project" });
//     }

//     const { title, description, githubLink, imageUrl, tags } = req.body;

//     project.title = title || project.title;
//     project.description = description || project.description;
//     project.githubLink = githubLink || project.githubLink;
//     project.imageUrl = imageUrl || project.imageUrl;
//     project.tags = tags || project.tags;

//     await project.save();

//     res.json(project);
//   } catch (err) {
//     res.status(500).json({ msg: err.message });
//   }
// };




export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to update this project" });
    }

    const { title, description, githubLink, imageUrl, tags, status } = req.body;

    // Update basic fields
    project.title = title || project.title;
    project.description = description || project.description;
    project.githubLink = githubLink || project.githubLink;
    project.imageUrl = imageUrl || project.imageUrl;
    project.status = status || project.status;

    // Resolve tags if provided
    if (tags) {
      // Ensure tags exist in Tag collection
      await Promise.all(
        tags.map(async (tag) => {
          await Tag.findOneAndUpdate(
            { name: tag },
            { name: tag },
            { upsert: true, new: true }
          );
        })
      );

      // Get tag IDs
      const tagDocs = await Tag.find({ name: { $in: tags } });
      project.tags = tagDocs.map(t => t._id);
    }

    await project.save();

    const populated = await Project.findById(project._id)
      .populate("userId", "username profilePicUrl")
      .populate("tags");

    const likesCount = await Like.countDocuments({ projectId: project._id });
    const isLiked = !!(await Like.findOne({ projectId: project._id, userId: req.user.id }));

    res.json({ ...populated.toObject(), likesCount, isLiked });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};




// 📍 Delete project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    if (project.userId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.json({ msg: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
