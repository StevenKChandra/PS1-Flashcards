const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 8000;

app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get("/", (req: any, res: any) => {
    res.sendFile(path.join(__dirname, "../index.html"));
});

app.post("/add-flashcard", (req: any, res: any) => {
    const { front, back } = req.body;

    if (front === undefined || back === undefined) {
        return res.status(400).send("Front and back fields are required");
    }

    const flashcardData = "${front} | ${back}\n";

    fs.appendFile(path.join(__dirname, "flashcard.txt"), flashcardData, (err: NodeJS.ErrnoException | null) => {
        if (err) {
            console.error("failed to save flashcard:", err);
            return res.status(500).send("Failed to save flashcard");
        }
        
        res.status(200).send("Flashcard added succesfully");
    });
});