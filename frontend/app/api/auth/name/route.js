import dbConnect from '../../../../utils/dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    const { username } = await req.json();

    if (!username) {
      return new Response(
        JSON.stringify({ message: 'Username is required' }),
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findOne({ username });

    if (user) {
      return new Response(
        JSON.stringify({ available: false, message: 'Username is taken' }),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ available: true, message: 'Username is available' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error checking username:', error);
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}