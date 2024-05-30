const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors({
    origin: 'https://sreshtaedtech.com/compile'
}));

app.post('/run', (req, res) => {
    const { language, code } = req.body;
    const fileName = `temp.${getExtension(language)}`;
    const filePath = path.join(__dirname, fileName);
    
    fs.writeFileSync(filePath, code);

    const command = getCommand(language, filePath);

    exec(command, (error, stdout, stderr) => {
        if (error) {
            res.json({ output: stderr });
        } else {
            res.json({ output: stdout });
        }

        fs.unlinkSync(filePath);
        if (language === 'c' || language === 'cpp') {
            fs.unlinkSync(path.join(__dirname, 'temp'));
        }
    });
});

function getExtension(language) {
    switch (language) {
        case 'javascript': return 'js';
        case 'python': return 'py';
        case 'html': return 'html';
        case 'php': return 'php';
        case 'c': return 'c';
        case 'cpp': return 'cpp';
        case 'java': return 'java';
    }
}

function getCommand(language, filePath) {
    switch (language) {
        case 'javascript': return `node ${filePath}`;
        case 'python': return `python ${filePath}`;
        case 'html': return `echo "HTML cannot be executed in this environment."`;
        case 'php': return `php ${filePath}`;
        case 'c': return `gcc ${filePath} -o temp && ./temp`;
        case 'cpp': return `g++ ${filePath} -o temp && ./temp`;
        case 'java': return `javac ${filePath} && java ${path.basename(filePath, '.java')}`;
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
