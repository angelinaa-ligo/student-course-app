const createApp = require('./config/express');
const connectDB = require('./config/mongoose');
const { port } = require('./config/config');

const studentRoutes = require('./app/routes/studentRoutes');
const courseRoutes = require('./app/routes/courseRoutes');
//authentication would come here too

const app = createApp();

connectDB();

app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
