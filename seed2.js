const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Medicine = require("./models/Medicine"); // adjust path if needed

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected for medicine seeding");
  } catch (error) {
    console.error("❌ MongoDB connection failed", error);
    process.exit(1);
  }
};

const medicines = [
  { name: "Amoxicillin 500mg" },
  { name: "Paracetamol 500mg" },
  { name: "Ibuprofen 400mg" },
  { name: "Vitamin C Tablets" },
  { name: "Ciprofloxacin 250mg" },
  { name: "Metronidazole 400mg" },
  { name: "Diclofenac Sodium 50mg" },
  { name: "Azithromycin 500mg" },
  { name: "Omeprazole 20mg" },
  { name: "Losartan 50mg" },
  { name: "Salbutamol Inhaler" },
  { name: "Cetirizine 10mg" },
  { name: "Chlorpheniramine 4mg" },
  { name: "Doxycycline 100mg" },
  { name: "Ferrous Sulfate Tablets" },
  { name: "Folic Acid Tablets" },
  { name: "Calcium Carbonate Tablets" },
  { name: "Ranitidine 150mg" },
  { name: "Hydrochlorothiazide 25mg" },
  { name: "Clotrimazole Cream" },
  { name: "Antacid Suspension" },
  { name: "ORS Sachets" },
  { name: "Multivitamin Syrup" },
  { name: "Loperamide 2mg" },
  { name: "Co-trimoxazole Tablets" },
  { name: "Prednisolone 5mg" },
  { name: "Fluconazole 150mg" },
  { name: "Atorvastatin 10mg" },
  { name: "Metformin 500mg" },
  { name: "Amlodipine 5mg" }
];

const seedMedicines = async () => {
  await connectDB();

  console.log("🧹 Deleting existing medicines...");
  await Medicine.deleteMany();

  console.log("📦 Inserting new medicines...");
  await Medicine.insertMany(medicines);

  console.log("✅ Medicine seeding complete!");
  process.exit();
};

seedMedicines();
