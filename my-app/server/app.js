const express = require('express');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User.js');
const Conversation = require('./models/conversation.js');
const Messages = require('./models/Messages.js');
const verifyToken = require('./middlewares/verifyToken.js');
const dbConnect = require('./db/connection.js');

const app = express();
const port = process.env.PORT || 8000;
const jwtSecretKey = process.env.JWT_SECRET_KEY || 'your_secret_key'; // Replace with a strong secret key

// Database Connection
dbConnect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Chat App');
});

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide username, email, and password' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'An error occurred during registration' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: 'Invalid email or password' });
    }

    const payload = { userId: user._id, email: user.email };
    const token = jwt.sign(payload, jwtSecretKey, { expiresIn: '1d' });

    await User.updateOne({ _id: user._id }, { $set: { token } });

    res.status(200).json({
      user: { id: user._id, email: user.email, username: user.username },
      token
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'An error occurred during login' });
  }
});

// Create a new conversation
app.post('/api/conversation', async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (!senderId || !receiverId) {
      return res.status(400).json({ msg: 'Please provide senderId and receiverId' });
    }

    const newConversation = new Conversation({ members: [senderId, receiverId] });
    await newConversation.save();

    res.status(200).json({ msg: 'Conversation created successfully' });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'An error occurred while creating conversation' });
  }
});



// Get conversations of a user
app.get('/api/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await Conversation.find({ members: userId });

    console.log(conversations)
    // Return necessary conversation data
    res.status(200).json(conversations);
  } catch (error) {
    console.error('Error retrieving conversations:', error);
    res.status(500).json({ error: 'An error occurred while retrieving conversations' });
  }
});


app.post('/api/message', async (req, res) => {
  try {
    const { conversationId, senderId, message, receiverId } = req.body;

    if (!senderId || !message) {
      return res.status(400).json({ msg: 'Please fill all required fields' });
    }

    if (!conversationId && receiverId) {
      const newConversation = new Conversation({ members: [senderId, receiverId] });
      await newConversation.save();

      const newMessage = new Messages({ conversationId: newConversation._id, senderId, message });
      await newMessage.save();

      return res.status(200).json({ msg: 'Message sent successfully' });
    }

    const newMessage = new Messages({ conversationId, senderId, message });
    await newMessage.save();

    res.status(200).json({ msg: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'An error occurred while sending message' });
  }
});

app.get('/api/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (conversationId === 'new') return res.status(200).json([]);

    const messages = await Messages.find({ conversationId });
    const messageWithUser = await Promise.all(messages.map(async (message) => {
      const user = await User.findById(message.senderId);
      return { user: { username: user.username }, message: message.message };
    }));

    res.status(200).json({ messages: messageWithUser });
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ error: 'An error occurred while retrieving messages' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    const usersData = users.map(user => ({
      user: { email: user.email, fullName: user.username, id: user._id },
      userId: user._id
    }));

    console.log(usersData)
    res.status(200).json(usersData);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'An error occurred while retrieving users' });
  }
});

app.post('/api/getUserData', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    const userData = {
      userId: user._id,
      username: user.username,
      email: user.email
    };
    res.status(200).json({ userData });
  } catch (error) {
    console.error('Error retrieving user data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving user data' });
  }
});


app.listen(port, () => {
  console.log('Server is running on port ' + port);
});
