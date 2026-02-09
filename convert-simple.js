const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const pdfFile = 'the-age-of-decentralized-intelligence.pdf';
const outputDir = 'pdf-images';

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log('Converting PDF to images using pdftoppm...');
console.log('This may take a few minutes...\n');

try {
    // Convert PDF to PNG images
    // -png = PNG format
    // -r 150 = 150 DPI resolution
    // -scale-to 1200 = max width 1200px
    execSync(
        `pdftoppm -png -r 150 -scale-to 1200 "${pdfFile}" "${path.join(outputDir, 'page')}"`,
        { stdio: 'inherit' }
    );
    
    // Get list of generated files
    const files = fs.readdirSync(outputDir)
        .filter(f => f.startsWith('page-') && f.endsWith('.png'))
        .sort((a, b) => {
            const numA = parseInt(a.match(/page-(\d+)\.png/)[1]);
            const numB = parseInt(b.match(/page-(\d+)\.png/)[1]);
            return numA - numB;
        });
    
    console.log(`\n✓ Converted ${files.length} pages successfully!`);
    console.log('Images saved to:', outputDir);
    
    // Create manifest
    const manifest = {
        totalPages: files.length,
        format: 'png',
        pages: files
    };
    
    fs.writeFileSync(
        path.join(outputDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
    );
    
    console.log('\nManifest created!');
    
} catch (error) {
    console.error('\n✗ Error converting PDF:', error.message);
    console.log('\nMake sure poppler is installed:');
    console.log('  Mac: brew install poppler');
    console.log('  Linux: sudo apt-get install poppler-utils');
    console.log('  Windows: choco install poppler');
}
