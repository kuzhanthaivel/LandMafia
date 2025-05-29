import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const body = await req.json();  
    const { username, email, walletAddress } = body;

    if (!username || !email || !walletAddress) {
      return new Response(JSON.stringify({ message: 'All fields are required' }), {
        status: 400,
      });
    }
    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 409,
      });
    }

    const newUser = await User.create({ username, email, walletAddress });

    const token = jwt.sign({ userId: newUser._id }, jwtSecret, { expiresIn: '7d' });

    return new Response(
      JSON.stringify({
        message: 'User created successfully',
        user: { username: newUser.username, email: newUser.email, walletAddress: newUser.walletAddress },
        token,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup API:', error);
    return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
      status: 500,
    });
  }
}