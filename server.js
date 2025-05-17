const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// DB
mongoose.connect('mongodb://localhost:27017/todoApp')
        .then(()=>console.log('✅ MongoDB connected'))
        .catch(err=>console.error('❌ MongoDB connection error:', err));

// Schema – strip _id & __v every time we convert to JSON
const taskSchema = new mongoose.Schema(
  {
    task: { type: String, required: true },
    completed: { type: Boolean, default: false }
  },
  {
    toJSON: {
      transform: (_, ret) => {
        delete ret._id;
        delete ret.__v;
      }
    }
  }
);

const Task = mongoose.model('Task', taskSchema);

// CREATE
app.post('/tasks', async (req, res) => {
  const newTask = await Task.create({ task: req.body.task });
  res.json(newTask);
});

// READ ALL
app.get('/tasks', async (_, res) => {
  const tasks = await Task.find().lean().select('-_id -__v');
  res.json(tasks);
});

// UPDATE
app.put('/tasks/:id', async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, projection: { _id: 0, __v: 0 } }
  );
  res.json(task);
});

// DELETE
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

app.listen(5000, () => console.log('🚀 Server on http://localhost:5000'));

