function formatWeight(quantity) {
    if (quantity >= 1) {
      return `${parseFloat(quantity.toFixed(2))} kg`;
    } else {
      return `${Math.round(quantity * 1000)} g`;
    }
}

function fixDate(dateStr) {
    return dateStr.split("T")[0];
}

function downloadCSV(data, filename = "data.csv") {
    const csvRows = [];
    
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));
    
    for (const row of data) {
        const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }
    
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    }

export { downloadCSV , formatWeight, fixDate };
