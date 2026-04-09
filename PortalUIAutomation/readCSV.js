const fs = require('fs');
const csv = require('csv-parser');

// Function to read and log CSV data
function readPaymentCSV() {
    const results = [];

    // 1. Point to your filename
    fs.createReadStream('Cards.csv') 
        .pipe(csv({ 
            separator: '\t', // Use '\t' for Tab-Separated or ',' for Comma-Separated
            headers: ['Name', 'CardNumber', 'Amount', 'Comments', 'Card'] 
        }))
        .on('data', (data) => results.push(data))
        .on('end', () => {
            console.log('--- CSV Data Found ---');
            
            // 2. Loop through and display each row in the console
            results.forEach((row, index) => {
                // Skip the header row if it repeats
                if (row.Name === 'Name') return; 

                console.log(`[Row ${index}]`);
                console.log(`👤 Name: ${row.Name}`);
                console.log(`💳 Card: ${row.CardNumber}`);
                console.log(`💰 Amount: ${row.Amount}`);
                console.log(`💬 Status: ${row.Comments}`);
                console.log('----------------------');
            });

            console.log(`Total Records: ${results.length - 1}`);
        })
        .on('error', (err) => {
            console.error('Error reading file:', err.message);
        });
}

readPaymentCSV();
