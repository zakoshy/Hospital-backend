const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User"); // Adjust path if needed

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

const departments = [
  "General Medicine",
  "Pediatrics",
  "ENT",
  "Dermatology",
  "Gynecology",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Psychiatry",
  "Urology",
  "Oncology",
  "Ophthalmology",
  "Dental",
  "Radiology",
  "Emergency",
  "Surgery",
  "Physiotherapy"
];

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const seedUsers = async () => {
  await connectDB();

  console.log("🧹 Deleting existing users...");
  await User.deleteMany(); // Deletes all previous user records

  const users = [
    {
      name: "Admin",
      email: "admin@hospital.com",
      password: await hashPassword("admin123"),
      role: "admin"
    },
    {
      name: "Receptionist",
      email: "reception@hospital.com",
      password: await hashPassword("reception254"),
      role: "reception"
    },
    {
      name: "Lab Technician",
      email: "lab@hospital.com",
      password: await hashPassword("lab123"),
      role: "laboratory"
    },
    {
      name: "Pharmacist",
      email: "pharmacy@hospital.com",
      password: await hashPassword("pharmacy123"),
      role: "pharmacy"
    },
    {
      name: "Cashier",
      email: "cashier@hospital.com",
      password: await hashPassword("cashier123"),
      role: "payment"
    },
   {
  name: "Consultation Doctor",
  email: "consultation@hospital.com",
  password: await hashPassword("consult123"),
  role: "consultation"
}

  ];

  // ✅ Add department doctors
  for (const dept of departments) {
    users.push({
      name: `Dr. ${dept} Specialist`,
      email: `${dept.toLowerCase().replace(/\s+/g, "")}@hospital.com`,
      password: await hashPassword("doctor123"),
      role: "department",
      department: dept
    });
  }

  console.log("📥 Inserting new users...");
  await User.insertMany(users);
  console.log("✅ Seeding complete. All users inserted.");
  process.exit();
};

seedUsers();
