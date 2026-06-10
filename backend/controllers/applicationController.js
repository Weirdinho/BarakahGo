const Application = require('../models/Application');

// @desc    Submit aid application
// @route   POST /api/donations/apply
exports.applyForAid = async (req, res) => {
  try {
    const { category, amount, reason } = req.body;

    const application = new Application({
      applicant: req.user.id,
      category,
      amount: parseFloat(amount),
      reason
    });

    await application.save();

    res.status(201).json({ 
      message: 'Application submitted successfully. You will be notified when it is reviewed.',
      application 
    });
  } catch (error) {
    console.error('APPLY FOR AID ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get my applications
// @route   GET /api/donations/applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user.id })
      .populate('voucher', 'code amount status redeemedAmount')
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    console.error('GET MY APPLICATIONS ERROR:', error);
    res.status(500).json({ message: 'Server error' });
  }
};