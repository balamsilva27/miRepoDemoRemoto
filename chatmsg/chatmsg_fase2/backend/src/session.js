import crypto from 'crypto';

const COOKIE_NAME = process.env.COOKIE_NAME || 'chatmsg_session';
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev_secret_compartido';
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

function encodePayload(payload) {
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function decodePayload(encodedPayload) {
  return JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8'));
}

function sign(value) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: SESSION_MAX_AGE_MS,
    path: '/'
  };
}

export function createSessionToken(payload) {
  const encodedPayload = encodePayload(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token) {
  if (!token) return null;

  const [encodedPayload, signature] = token.split('.');
  if (!encodedPayload || !signature || !safeEqual(signature, sign(encodedPayload))) {
    return null;
  }

  try {
    const payload = decodePayload(encodedPayload);
    const createdAt = Date.parse(payload.createdAt);

    if (!payload.userId || !payload.username || Number.isNaN(createdAt)) {
      return null;
    }

    if (Date.now() - createdAt > SESSION_MAX_AGE_MS) {
      return null;
    }

    return {
      userId: payload.userId,
      username: payload.username,
      createdAt: payload.createdAt
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(res, user) {
  res.cookie(COOKIE_NAME, createSessionToken(user), cookieOptions());
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, cookieOptions());
}

export function getSessionFromRequest(req) {
  return verifySessionToken(req.cookies?.[COOKIE_NAME]);
}

export { COOKIE_NAME };
