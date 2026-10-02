const express = require("express");
const Post = require("../models/postModel");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

//Create a new post
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: "Title and content are required",
      });
    }

    const post = new Post({
      title,
      content,
      tags,
      status,
      author: req.user.id,
    });

    await post.save();

    return res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
//get all data
router.get("/", async (req, res) => {
  try {
    const { search, tag } = req.query;

    let posts;
    if (search) {
      posts = await Post.find({
        $or: [
          {
            title: {
              $regex: search,
              $options: "i",
            },
          },
          {
            tags: {
              $regex: search,
              $options: "i",
            },
          },
        ],
      }).populate("author", "name email");
    } else if (tag) {
      posts = await Post.find({
        tags: tag,
      }).populate("author", "name email");
    } else {
      posts = await Post.find().populate("author", "name email");
    }
    return res.status(200).json({
      posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
//get data by id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    return res.status(200).json({
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
//update data
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, content, tags, status } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    await post.save();

    return res.status(200).json({
      message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.error("Update post error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});
//delete the data
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }
    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});
module.exports = router;
