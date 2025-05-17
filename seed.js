const mongoose = require('mongoose');
const Task = require('./models/Task');

const seedTasks = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/todo-app'); // No extra options

    console.log('MongoDB connected');

    await Task.deleteMany(); // Clear existing tasks

    await Task.insertMany([
      { task: 'Buy groceries' },
      { task: 'Complete project' },
      { task: 'Call friend' },
    ]);

    console.log('Tasks seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedTasks();
