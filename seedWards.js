// seedWards.js

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Ward = require("./models/Ward"); // Adjust path if needed
const Bed = require("./models/Bed");   // Adjust path if needed

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed", error);
    process.exit(1);
  }
};

// List of wards you want to seed
const wardNames = [
  "Children Ward",
  "Female Surgical Ward",
  "Male Surgical Ward",
  "ICU",
  "Maternity Ward",
  "General Ward"
];

const seedWards = async () => {
  await connectDB();

  console.log("🧹 Deleting existing wards and beds...");
  await Ward.deleteMany();
  await Bed.deleteMany();

  const createdWards = [];

  for (const wardName of wardNames) {
    const ward = await Ward.create({
      name: wardName,
      totalBeds: 20
    });

    const beds = [];

    for (let i = 1; i <= 20; i++) {
      beds.push({
        ward: ward._id,
        bedNumber: i,  // ✅ Consistent field name used in Bed model
        isOccupied: false,
        currentPatient: null
      });
    }

    await Bed.insertMany(beds);
    createdWards.push(ward.name);
    console.log(`✅ Seeded ${ward.name} with 20 beds`);
  }

  console.log("✅ Seeding complete. Wards created:", createdWards);
  process.exit();
};

seedWards();
