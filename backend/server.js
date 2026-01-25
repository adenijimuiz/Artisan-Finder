import 'dotenv/config';
import express from 'express';
import cors from 'cors';


const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


app.get('/', (req, res) => {
  res.send('Hello from the backend server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
