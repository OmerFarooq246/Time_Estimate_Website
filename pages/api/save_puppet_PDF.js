import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    console.log("rq.query in save_puppet_pdf: ", req.query)
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        await page.goto(`http://localhost:3000/estimate/${req.query.estimate_id}?edit=true&height_reset=true`, { waitUntil: 'networkidle2' });

        // Wait for 10 seconds
        await new Promise(resolve => setTimeout(resolve, 3000));

        const pdfBuffer = await page.pdf({ 
            format: 'A4', 
            landscape: true, 
            printBackground: true // Include background graphics and colors
        });
        
        await browser.close();
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=Estimate.pdf');
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).end();
    }
}