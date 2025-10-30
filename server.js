import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

const server = createServer(async (req, res) => {
    try {
        let filePath = req.url;
        
        // Remove query parameters
        filePath = filePath.split('?')[0];
        
        // Security: prevent directory traversal
        if (filePath.includes('..')) {
            res.writeHead(400);
            res.end('Bad Request');
            return;
        }
        
        // Handle static assets first
        if (filePath === '/styles.css') {
            filePath = '/todoMVC/styles.css';
        }
        else if (filePath === '/app.js') {
            filePath = '/todoMVC/app.js';
        }
        else if (filePath.startsWith('/pages/')) {
            filePath = `/todoMVC${filePath}`;
        }
        else if (filePath.startsWith('/components/')) {
            filePath = `/todoMVC${filePath}`;
        }
        else if (filePath.startsWith('/src/')) {
            // Framework files - serve as-is
        }
        else if (filePath === '/favicon.ico') {
            filePath = '/todoMVC/favicon.ico';
        }
        else if (filePath.includes('.well-known')) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        else {
            // For all other routes (/, /active, /completed, /unknown, etc.)
            // serve the main HTML file and let the client-side router handle it
            filePath = '/todoMVC/index.html';
        }
        
        const fullPath = join(__dirname, filePath);
        const ext = extname(filePath);
        const contentType = mimeTypes[ext] || 'text/plain';
        
        try {
            const content = await readFile(fullPath);
            
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });
            res.end(content);
        } catch (fileError) {
            if (fileError.code === 'ENOENT') {
                // If it's a static file that doesn't exist, return 404
                if (ext && ext !== '.html') {
                    res.writeHead(404);
                    res.end('File not found');
                } else {
                    // If it's a route request and HTML file doesn't exist, that's a server error
                    console.error(`HTML file not found: ${fullPath}`);
                    res.writeHead(500);
                    res.end('Server configuration error');
                }
            } else {
                throw fileError;
            }
        }
        
    } catch (error) {
        console.error(`Error serving ${req.url}:`, error.message);
        res.writeHead(500);
        res.end('Server error');
    }
});

server.listen(PORT, () => {
    console.log(`🚀 Mini Framework TodoMVC running at http://localhost:${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`📂 Project structure:`);
    console.log(`   ${__dirname}/`);
    console.log(`   ├── src/           - Framework files`);
    console.log(`   ├── todoMVC/       - TodoMVC application`);
    console.log(`   │   ├── pages/     - Route pages`);
    console.log(`   │   ├── components/- UI components`);
    console.log(`   │   ├── app.js     - Main application`);
    console.log(`   │   └── styles.css - Application styles`);
    console.log(`   └── server.js      - This server`);
    console.log(`\n🎯 Available routes:`);
    console.log(`   • http://localhost:${PORT}/        - All todos`);
    console.log(`   • http://localhost:${PORT}/active  - Active todos`);
    console.log(`   • http://localhost:${PORT}/completed - Completed todos`);
    console.log(`   • http://localhost:${PORT}/any-unknown-route - 404 error page`);
});