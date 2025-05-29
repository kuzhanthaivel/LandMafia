import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET;
export async function POST(req) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return new Response(
        JSON.stringify({ message: 'Wallet address is required' }),
        { status: 400 }
      );
    }
    await dbConnect();
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return new Response(
        JSON.stringify({ isMember: false }),
        { status: 200 }
      );
    }
    const token = jwt.sign(
      { userId: user._id, walletAddress: user.walletAddress },
      jwtSecret,
      { expiresIn: '7d' }
    );
    return new Response(
      JSON.stringify({
        isMember: true,
        token,
        user: {
          username: user.username,
          email: user.email,
          walletAddress: user.walletAddress,
          myContracts: user.myContracts,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      { status: 500 }
    );
  }
}