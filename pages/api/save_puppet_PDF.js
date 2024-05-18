import puppeteer from 'puppeteer';

export default async function handler(req, res) {
    console.log("rq.query in save_puppet_pdf: ", req.query)
    try {
        const browser = await puppeteer.launch();
        // const browser = await puppeteer.launch({
        //     executablePath: '/home/sbx_user1051/.cache/puppeteer', // Specify the path to Chrome executable
        //     args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add necessary flags
        // });
        const page = await browser.newPage();
        
        await page.goto(`https://time-estimate-website.vercel.app/${req.query.estimate_id}?edit=true&height_reset=true`, { waitUntil: 'networkidle2' });

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