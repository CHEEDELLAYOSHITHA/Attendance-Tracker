const Attendance = require('../models/Attendance');

exports.checkIn = async (req, res) => {
  try {
    // Prevent multiple check-ins per day
    const today = new Date();
    today.setHours(0,0,0,0);
    const existing = await Attendance.findOne({ user: req.user._id, checkIn: { $gte: today } });
    if (existing) return res.status(400).json({ message: 'Already checked in today' });
    const attendance = new Attendance({ user: req.user._id, checkIn: new Date() });
    await attendance.save();
    res.json({ message: 'Checked in', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.checkOut = async (req, res) => {
  try {
    // Find today's check-in without check-out
    const today = new Date();
    today.setHours(0,0,0,0);
    const attendance = await Attendance.findOne({ user: req.user._id, checkIn: { $gte: today }, checkOut: { $exists: false } });
    if (!attendance) return res.status(400).json({ message: 'No check-in found for today' });
    attendance.checkOut = new Date();
    await attendance.save();
    res.json({ message: 'Checked out', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.myLogs = async (req, res) => {
  try {
    const logs = await Attendance.find({ user: req.user._id }).sort({ checkIn: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 