const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const XLSX = require("xlsx");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post("/api/save-data", (req, res) => {
  const data = req.body;
  const filePath = "./DATA.xlsx";

  let workbook;
  let worksheet;

  if (fs.existsSync(filePath)) {
    workbook = XLSX.readFile(filePath);
    worksheet = workbook.Sheets["Sheet1"];
  } else {
    workbook = XLSX.utils.book_new();
    worksheet = XLSX.utils.aoa_to_sheet([]);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  }

  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (jsonData.length === 0) {
    jsonData.push([
      "First Name",
      "Last Name",
      "Date of Birth",
      "Phone",
      "Email",
      "Country",
      "Address",
      "Post Office", // Додаємо новий заголовок
    ]);
  }

  jsonData.push([
    data.firstName,
    data.lastName,
    data.dateOfBirth,
    data.phone,
    data.email,
    data.country,
    data.address,
    data.postOffice, // Додаємо нове поле
  ]);

  const newWorksheet = XLSX.utils.aoa_to_sheet(jsonData);
  workbook.Sheets["Sheet1"] = newWorksheet;

  XLSX.writeFile(workbook, filePath);

  res.send({ message: "Data saved successfully" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
