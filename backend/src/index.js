import express from "express";
const exp = express();
const PORT = 3000;

exp.get("/", (req, res) => {
    res.send("Hello World!");
});

exp.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});