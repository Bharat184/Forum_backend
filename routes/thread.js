const express = require('express');
const router = express.Router();
const fetchUser = require('../middleware/fetchUser')
const { body, validationResult } = require('express-validator');
const Thread = require('../models/Thread')
const Comment = require('../models/Comment')


router.post('/create', fetchUser, [
    body('title', 'title should not be emtpy').not().isEmpty(),
    body('description', 'description should not be empty').not().isEmpty()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    try {
        let cat = Thread.create({
            title: req.body.title,
            description: req.body.description,
            cat_id: req.body.cat_id,
            user_id: req.user.id
        })
        if (cat) {
            return res.json({ "success": "true", "result": "thread posted", thread: cat });
        }
        // return res.json(req.user.id)
    } catch (error) {
        console.log(error.message);
    }
});

router.delete('/delete/:id', fetchUser, async (req, res) => {
    let thd = await Thread.findById(req.params.id)
    let cmt = await Comment.find({ th_id: req.params.id })
    let tid = req.params.id;
    thd = await Thread.findByIdAndDelete(tid);
    cmt = await Comment.deleteMany({ th_id: tid })
    res.send({ "success": "true", "result": "Deleted Thread and Comments" });


})

//Edit a thread thread_id as paramters.
router.put('/edit/:id', fetchUser, async (req, res) => {
    try {
        let id = req.params.id;
        let thd = await Thread.findById(id);
        if (!thd) {
            throw new Error("Invalid ThreadId");
        }
        let title = req.body.title;
        let description = req.body.description;
        let data = { title, description };
        if (req.user.id !== thd.user_id.toString()) {
            throw new Error("Restricted Acceess");
        }
        thread = await Thread.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
        res.json({ success: true, result: "thread updated", thread });
    }
    catch (err) {
        return res.json({ success: true, result: "Internal Server Error" });
    }


});

router.get('/comment/:id', fetchUser, async (req, res) => {
    let id = req.params.id;
    let thd = await Thread.findById(id)
    let cmt = await Comment.find({ th_id: id })
    res.json({ thd: thd, cmt: cmt })
})

router.get('/fetchThread/:cat_id', fetchUser, async (req, res) => {
    let id = req.params.cat_id;
    let thd = await Thread.find({ cat_id: id })
    res.json({ thd: thd });
})

module.exports = router;