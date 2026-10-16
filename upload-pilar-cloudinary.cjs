require("dotenv").config();

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;

const uploadsDir = path.join(__dirname, "public", "uploads");
const reportPath = path.join(__dirname, "cloudinary-upload-report.csv");
const allowed = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

function csv(value) {
  return '"' + String(value ?? "").replace(/"/g, '""') + '"';
}

async function main() {
  if (!process.env.CLOUDINARY_NAME ||
      !process.env.CLOUDINARY_KEY ||
      !process.env.CLOUDINARY_SECRET) {
    throw new Error("Konfigurasi Cloudinary belum lengkap.");
  }

  if (!fs.existsSync(uploadsDir)) {
    throw new Error("Folder public/uploads tidak ditemukan.");
  }

  const files = fs.readdirSync(uploadsDir, { withFileTypes: true })
    .filter(f => f.isFile() && allowed.has(path.extname(f.name).toLowerCase()))
    .map(f => f.name);

  const rows = [];
  console.log(`Ditemukan ${files.length} file gambar. File lokal tidak akan dihapus.`);

  for (const name of files) {
    const fullPath = path.join(uploadsDir, name);
    const ext = path.extname(name);
    const stem = path.basename(name, ext);
    const safeStem = stem.normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9_-]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 90) || "image";
    const suffix = crypto.createHash("sha1").update(name).digest("hex").slice(0, 8);
    const publicId = `${safeStem}_${suffix}`;

    try {
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: "pilar-legacy",
        public_id: publicId,
        overwrite: false,
        resource_type: "image",
      });

      rows.push([name, publicId, result.secure_url, "uploaded", ""]);
      console.log(`[OK] ${name}`);
    } catch (err) {
      rows.push([name, publicId, "", "failed", err.message]);
      console.error(`[GAGAL] ${name}: ${err.message}`);
    }
  }

  const header = ["filename", "public_id", "secure_url", "status", "error"];
  fs.writeFileSync(
    reportPath,
    [header, ...rows].map(row => row.map(csv).join(",")).join("\r\n"),
    "utf8"
  );

  console.log("\nSelesai.");
  console.log(`Berhasil: ${rows.filter(r => r[3] === "uploaded").length}`);
  console.log(`Gagal: ${rows.filter(r => r[3] === "failed").length}`);
  console.log(`Laporan: ${reportPath}`);
  console.log("Database dan file lokal tidak diubah.");
}

main().catch(err => {
  console.error("Upload dibatalkan:", err.message);
  process.exitCode = 1;
});
