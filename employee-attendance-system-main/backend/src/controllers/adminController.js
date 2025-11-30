const Attendance = require('../models/Attendance');
const User = require('../models/User');

exports.allLogs = async (req, res) => {
  try {
    const logs = await Attendance.find().populate('user', 'username role').sort({ checkIn: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// List all users
exports.allUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user (username, role)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  if (role && !['admin', 'employee'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (username) user.username = username;
    if (role) user.role = role;
    await user.save();
    res.json({ message: 'User updated', user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 