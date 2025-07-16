const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/consultations", require("./routes/consultationRoutes"));
app.use("/api/prescriptions", require("./routes/prescriptionRoutes"));
app.use("/api/pharmacy", require("./routes/pharmacyRoutes"));
app.use("/api/discharge", require("./routes/dischargeRoutes"));
app.use("/api/departments", require('./routes/departmentRoutes'));
app.use("/api/laboratory-referrals", require("./routes/labRoutes")); // already mapped properly
app.use('/api/daraja', require('./routes/darajaRoutes'));
app.use('/api', require('./routes/wardRoutes'));





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
