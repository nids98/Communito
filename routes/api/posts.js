const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator/check')
const auth = require('../../middleware/auth')
// Models
const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

// @route      POST api/posts
// @desc       create a post
// @access     Private
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      const post = new Post(newPost)
      await post.save()
      res.json(post)
    } catch (err) {
      console.error(err.message)
      res.status(500).json('Server error')
    }
  }
)

// @route      GET api/posts
// @desc       Get all posts
// @access     Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.json(posts)
  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server error')
  }
})

// @route      GET api/posts/:post_id
// @desc       Get post by id
// @access     Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.json(post)
  } catch (err) {
    console.error(err.message)
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).json('Server error')
  }
})

// @route      DELETE api/posts/post_id
// @desc       Delete a post
// @access     Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    // Check if the post exist
    if (!post) {
      return res.status(404).json({ msg: 'Post not found' })
    }

    //   Check if the user is the owner of the post
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    await post.remove()
    res.json({ msg: 'Post deleted' })
  } catch (err) {
    console.error(err.message)

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post not found' })
    }
    res.status(500).json('Server error')
  }
})

// @route      PUT api/posts/like/:post_id
// @desc       Like a post
// @access     Private
router.put('/like/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    // Check if this post has already been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: 'Post has already been liked' })
    }

    // Check if the user is liking his own post
    if (post.user.toString() === req.user.id) {
      return res
        .status(401)
        .json({ msg: 'User not authorized to like this post' })
    }

    post.likes.unshift({ user: req.user.id })

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server error')
  }
})

// @route      PUT api/posts/unlike/:post_id
// @desc       Unike a post
// @access     Private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    // Check if this post has been liked
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ msg: 'Post has not yey been liked' })
    }

    //   Get remove index
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id)

    post.likes.splice(removeIndex, 1)

    await post.save()

    res.json(post.likes)
  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server error')
  }
})

// @route      POST api/posts/comment/:post_id
// @desc       Comment on a post
// @access     Private
router.post(
  '/comment/:post_id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.post_id)

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      }

      post.comments.unshift(newComment)
      await post.save()
      res.json(post.comments)
    } catch (err) {
      console.error(err.message)
      res.status(500).json('Server error')
    }
  }
)

// @route      DELETE api/posts/comment/:post_id/:comment_id
// @desc       Delete a comment
// @access     Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    // Get post
    const post = await Post.findById(req.params.post_id)

    // Pull comment from the post
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    )

    // Check if comment exists
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' })
    }

    // Check if that user made the comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' })
    }

    //   Get remove index
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id)

    post.comments.splice(removeIndex, 1)
    await post.save()
    res.json(post.comments)
  } catch (err) {
    console.error(err.message)
    res.status(500).json('Server error')
  }
})

module.exports = router
