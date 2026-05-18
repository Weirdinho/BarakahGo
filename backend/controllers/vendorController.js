const Vendor = require('../models/Vendor');

// @desc    Get all approved vendors
// @route   GET /api/vendors
exports.getVendors = async (req, res) => {
  try {
    const { category, lat, lng, radius = 10 } = req.query;
    let query = { isApproved: true };

    if (category) {
      query.categories = category;
    }

    const vendors = await Vendor.find(query);
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register as vendor
// @route   POST /api/vendors
exports.registerVendor = async (req, res) => {
  try {
    const { name, email, phone, address, categories, logo } = req.body;

    let vendor = await Vendor.findOne({ email });
    if (vendor) {
      return res.status(400).json({ message: 'Vendor already registered' });
    }

    vendor = new Vendor({
      name,
      email,
      phone,
      address,
      categories,
      logo,
      isApproved: false
    });

    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Approve vendor (admin only)
// @route   PUT /api/vendors/:id/approve
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};