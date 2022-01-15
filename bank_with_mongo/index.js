const app = require('./src/app');


const PORT = 3000

app.listen(PORT, _ => console.log(`server is running on http://localhost:${PORT}`))