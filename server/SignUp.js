let User = require('./models/users');

exports.signUp = async function (req, res){
  const { name, email, password } = req.body;

  try {
    // Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('An account with this email already exists');
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      name:name,
      email:email,
      password:password,
      time: new Date(),
    });

    // Save the user to the database
    await newUser.save();

    // Return a success message
    return res.status(201).json({ message: 'Account created successfully' })
  } catch (error) {
    console.error('Error signing up:', error);
    return res.status(500).json({ error: 'Failed to create an account' });
  }
};


