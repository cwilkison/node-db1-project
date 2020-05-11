const express = require("express");
const db = require("../data/dbConfig.js");
const router = express.Router();

router.get("/", (req, res) => {
    db.select("*")
    .from("accounts")
    .then(account => {
        res.status(200).json({ data: account});
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.message});
    });
});

router.get("/:id", (req, res) => {
    db("accounts")
    .where({ id: req.params.id })
    .first()
    .then(account => {
        if(account) {
            res.status(200).json({ data: account});
        } else {
            res.status(404).json({ message: "No accounts by that ID "});
        }
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({ message: error.message });
    });
});

router.post("/", (req, res) => {
    const account = req.body;
    if (isValidAccount(account)) {
        db("accounts")
        //WHAT EXACTLY IS "id"
        .insert(account, "id")
        .then(ids => {
            res.status(201).json({ data: ids });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ message: error.message });
        })
    } else {
        res.status(400).json({ message: "please prode a name and budget" });
    }
});

router.put('/:id', (req, res) => {
    const changes = req.body
    db("accounts")
    .where({id:req.params.id})
    .update(changes)
    //WHAT EXACTLY IS COUNTS
    .then(count => {
        if(count > 0){
            res.status(200).json({data: count})
        } else {
            res.status(404).json({ message: "Record not found by that id"})
        }
    })
    .catch(err => {
        res.status(500).json({message: "err.message"})
    })
});

router.delete('/:id', (req, res) => {
    db("accounts")
    .where({id: req.params.id})
    .del()
    .then(count => {
        if(count > 0){
            res.status(200).json({data: count})
        } else {
            res.status(404).json({ message: "Record not found by that id"})
        }
    })
    .catch(err => {
        res.status(500).json({ message: "err.message"})
    })
})

function isValidAccount(account) {
    return Boolean(account.name && account.budget);
}
module.exports = router;