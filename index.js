const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/search", async (req, res) => {
    const query = "جروب واتساب حدائق الأهرام";
    const googleQuery = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(googleQuery, { waitUntil: "domcontentloaded" });

    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll("a"))
            .map(a => a.href)
            .filter(href => href.includes("chat.whatsapp.com"));
    });

    await browser.close();

    res.json([...new Set(links)]);
});

app.listen(3000, () => console.log("Server running on port 3000"));
