const { fromPath } = require('pdf2pic');
const path = require('path');
const fs = require('fs');

const pdfPath = './the-age-of-decentralized-intelligence.pdf';
const outputDir = './pdf-images';

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const options = {
    density: 150,           // DPI (150 is good balance of quality/size)
    saveFilename: 'page',   // Base filename
    savePath: outputDir,
    format: 'webp',         // WebP for best compression
    width: 1200,            // Max width
    height: 1697            // Max height (A4 ratio)
};

const convert = fromPath(pdfPath, options);

console.log('Converting PDF to images...');

// Convert all pages
convert.bulk(-1, { responseType: 'image' })
    .then((response) => {
        console.log(`Converted ${response.length} pages successfully!`);
        console.log('Images saved to:', outputDir);
        
        // Generate manifest file
        const manifest = {
            totalPages: response.length,
            format: 'webp',
            pages: response.map((_, i) => `page.${i + 1}.webp`)
        };
        
        fs.writeFileSync(
            path.join(outputDir, 'manifest.json'),
            JSON.stringify(manifest, null, 2)
        );
        
        console.log('Manifest created:', manifest);
    })
    .catch((error) => {
        console.error('Error converting PDF:', error);
        console.log('\nMake sure you have:');
        console.log('1. Run: npm install pdf2pic');
        console.log('2. Installed poppler-utils (brew install poppler on Mac, apt-get install poppler-utils on Linux)');
    });
