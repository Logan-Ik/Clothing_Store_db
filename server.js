import express from "express";
import db from "./db.js";
import bcrypt from "bcrypt";

const app = express();

/* ---------- MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.static("public"));

/* ---------- PRODUCTS ---------- */
app.get("/products", async (_, res) => {
    try {
        const [products] = await db.query("SELECT * FROM products");
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// user info //
app.get("/me/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const [[user]] = await db.query(
            "SELECT username FROM users WHERE id = ?",
            [userId]
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------- CART ---------- */

// Add to cart
app.post("/cart", async (req, res) => {
    const { userId, productId } = req.body;

    try {
        const [existing] = await db.query(
            "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
            [userId, productId]
        );

        if (existing.length > 0) {
            await db.query(
                "UPDATE cart_items SET quantity = quantity + 1 WHERE id = ?",
                [existing[0].id]
            );
        } else {
            await db.query(
                "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, 1)",
                [userId, productId]
            );
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Decrease quantity OR remove item
app.patch("/cart/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const [[item]] = await db.query(
            "SELECT quantity FROM cart_items WHERE id = ?",
            [id]
        );

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        if (item.quantity > 1) {
            await db.query(
                "UPDATE cart_items SET quantity = quantity - 1 WHERE id = ?",
                [id]
            );
        } else {
            await db.query(
                "DELETE FROM cart_items WHERE id = ?",
                [id]
            );
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get cart for user
app.get("/cart/:userId", async (req, res) => {
    try {
        const [items] = await db.query(
            `
            SELECT 
                c.id,
                p.id AS product_id,
                p.name,
                p.price,
                p.image,
                c.quantity,
                (p.price * c.quantity) AS total
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            `,
            [req.params.userId]
        );

        res.json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ---------- CHECKOUT ---------- */
app.post("/checkout", async (req, res) => {
    const { userId } = req.body;

    try {
        const [items] = await db.query(
            `
            SELECT c.quantity, p.price
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            `,
            [userId]
        );

        if (items.length === 0) {
            return res.status(400).json({ error: "Cart is empty" });
        }

        const total = items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
        );

        await db.query(
            "INSERT INTO orders (user_id, total, status) VALUES (?, ?, 'PAID')",
            [userId, total]
        );

        await db.query(
            "DELETE FROM cart_items WHERE user_id = ?",
            [userId]
        );

        res.json({ success: true, total });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (email, password_hash) VALUES (?, ?)",
            [email, hashed]
        );

        res.json({ success: true });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "Email already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const [[user]] = await db.query(
            "SELECT id, password_hash FROM users WHERE email = ?",
            [email]
        );

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const match = await bcrypt.compare(password, user.password_hash);

        if (!match) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        res.json({ success: true, userId: user.id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const hash = await bcrypt.hash(password, 10);

    try {
        await db.query(
            "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
            [username, email, hash]
        );

        res.json({ success: true });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            return res.status(400).json({ error: "User already exists" });
        }
        res.status(500).json({ error: err.message });
    }
});

/* ---------- START SERVER ---------- */
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
