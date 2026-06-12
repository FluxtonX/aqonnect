/**
 * eSIM Access API authentication.
 * Uses RT-AccessCode header as per the eSIM Access API docs.
 */

export function getEsimAccessHeaders(): Record<string, string> {
  const accessCode = process.env.ESIM_ACCESS_CODE;

  if (!accessCode) {
    throw new Error('eSIM Access credentials not configured (ESIM_ACCESS_CODE)');
  }

  return {
    'RT-AccessCode': accessCode,
    'Content-Type': 'application/json',
  };
}
