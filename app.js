const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Secure DevOps Pipeline using Trivy and Jenkins working flawlessly!');
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
