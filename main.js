const fs = require("fs");
const crypto = require('crypto');
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.listen(8000);


app.get('/login', (req, res) => {
    try {
        const { password,ㅤ} = req.query;

        // Three people have access to the panel 
        const validHash = [
            '420165201ce6a87ff3f869445a8ba0004b5f2644c63f2b7af551b93b1a03898c',
            'a48aa637f364c4f5564cd4bae216910354cdc305ef8abcbcdaab8ab666363eed',
            '7fbc154e4e245a4e377e5d15245b98370702fd01a4ec5b007f57bd008b0a5534',ㅤ
        ];

        const hash = crypto.createHash('sha256').update(password).digest('hex');
        var login = "";
        validHash.forEach(validPair => {
            if (hash === validPair) {
                login = "success";
            }
        });

        if (login === "") {
            res.status(403);
            res.render("feedback", {
                type: "warning",
                msg: "Authentication failed.",
            });
            return;
        }

        if (login === "success") {
            var flag = fs.readFileSync("flag.txt");
            res.status(200);
            res.render("feedback", {
                type: "success",
                msg: "You are in! " + flag,
            });
            return;
        }
    } catch (e) {
        return res.redirect("/");
    }
});

app.get('/sourcecode', async (req, res) => {
    const source = fs.readFileSync(__filename);
    res.render("sourcecode", {
        source: source,
    });
    return;
});

app.get('/', async (req, res) => {
    res.render("index");
    return;
});

app.use(function(req, res) {
    res.status(404);
    res.render("feedback", {
        type: "warning",
        msg: "This page does not exist.",
    });
    return;
});


