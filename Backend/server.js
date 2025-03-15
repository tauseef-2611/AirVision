const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const generateToken = (user) => {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const authenticate = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

const apiRouter = express.Router();

apiRouter.post("/signup", async (req, res) => {
    const { email, password, name, age, gender, smoker_status, occupation, allergies } = req.body;

    console.log("Request body:", req.body);

    if (!email || !password) return res.status(400).json({ error: "Email and password required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
        .from("users")
        .insert([{ email, password: hashedPassword, name, age, gender, smoker_status, occupation, allergies }])
        .select("*") 
        .single();   

    // 🔸 Handle errors
    if (error) return res.status(400).json({ error: error.message });

    const token = generateToken(data);  

    res.json({ message: "User created successfully", token , data});
});

apiRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single(); // Fetch a single user

    if (error || !data) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, data.password);

    if (!isMatch) {
        return res.status(401).json({ error: "Incorrect password" });
    }

    const token = generateToken(data);

    res.json({ message: "Login successful", token,data });
});

apiRouter.get("/profile", authenticate, async (req, res) => {
    const { data: user, error } = await supabase.from("users").select("*").eq("id", req.user.id).single();
    if (error) return res.status(400).json({ error: error.message });

    res.json(user);
});

apiRouter.post("/lung-health", authenticate, async (req, res) => {
    const { lung_condition, fev1, fvc, exercise_level, symptoms } = req.body;

    const { data, error } = await supabase
        .from("lung_health_data")
        .insert([{ user_id: req.user.id, lung_condition, fev1, fvc, exercise_level, symptoms }]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Lung health data added", data });
});

apiRouter.post("/pollution", authenticate, async (req, res) => {
    const { pollution_level, location } = req.body;

    const { data, error } = await supabase
        .from("pollution_data")
        .insert([{ user_id: req.user.id, pollution_level, location }]);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Pollution data added", data });
});
apiRouter.get("/lung-health", authenticate, async (req, res) => {
    const { data, error } = await supabase
        .from("lung_health_data")
        .select("*")
        .eq("user_id", req.user.id);

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
});

apiRouter.get("/user-data", authenticate, async (req, res) => {
    try {
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id, email, name, age, gender, smoker_status, occupation, allergies, created_at")
            .eq("id", req.user.id)
            .single();

        if (userError) return res.status(400).json({ error: userError.message });

        const { data: lungHealth, error: lungError } = await supabase
            .from("lung_health_data")
            .select("*")
            .eq("user_id", req.user.id);

        if (lungError) return res.status(400).json({ error: lungError.message });

        const { data: pollution, error: pollutionError } = await supabase
            .from("pollution_data")
            .select("*")
            .eq("user_id", req.user.id);

        if (pollutionError) return res.status(400).json({ error: pollutionError.message });

        res.json({
            user,
            lung_health_data: lungHealth,
            pollution_data: pollution
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

app.use("/api", apiRouter);

app.listen(5000, () => console.log("Server running on port 5000"));