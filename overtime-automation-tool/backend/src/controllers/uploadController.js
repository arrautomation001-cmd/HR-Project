import XLSX from "xlsx";

const timeToMinutes = (time) => {
  if (!time) return 0;

  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;

  return `${String(totalHours).padStart(2, "0")}:${String(
    remainingMinutes
  ).padStart(2, "0")}`;
};

export const uploadExcel = async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const data = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

    // Daily OT Columns
    const overtimeColumns = [];

    for (let i = 10; i <= 155; i += 5) {
      overtimeColumns.push(i);
    }

    const employees = [];

    for (let i = 2; i < data.length; i++) {
      const employee = data[i];

      if (!employee[0]) continue;

      const employeeOTs = overtimeColumns.map(
        (columnIndex) => employee[columnIndex]
      );

      const totalMinutes = employeeOTs.reduce(
        (sum, time) => sum + timeToMinutes(time),
        0
      );

      const grandTotal = minutesToTime(totalMinutes);

      employees.push({
        paycode: employee[0],
        employeeName: employee[2]?.trim(),
        totalOT: grandTotal,
      });
    }

    return res.status(200).json({
      success: true,
      totalEmployees: employees.length,
      employees,
    });
  } catch (error) {
    console.error("Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to process Excel file",
      error: error.message,
    });
  }
};