/* eslint-disable import/prefer-default-export */
import sha256 from 'crypto-js/sha256';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
  const data = await request.json();
  try {
    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: sha256(data.password).toString(),
      },
    });

    return new Response({
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    let status = 500;
    let message = 'Failed to create user';

    if (error.code === 'P2002') {
      status = 409;
      message = 'A user with this email already exists.';
    }

    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
