import { randomId } from './ids.js';

// Demo payment gateway.
//
// It behaves like a real card processor in test mode: it validates the card,
// returns realistic decline codes and never stores the full card number.
// Only published test numbers are accepted, so nobody can enter a real card
// into this demo store. Swap this module for Stripe or another provider to
// take real payments.

export interface CardInput {
  number: string;
  expMonth: number;
  expYear: number;
  cvc: string;
  name: string;
}

export type ChargeResult =
  | { ok: true; transactionId: string; brand: string; last4: string }
  | { ok: false; code: string; message: string; field?: 'number' | 'expiry' | 'cvc' };

type Outcome = 'success' | 'card_declined' | 'insufficient_funds' | 'expired_card' | 'incorrect_cvc';

export const TEST_CARDS: { number: string; brand: string; outcome: Outcome; label: string }[] = [
  { number: '4242424242424242', brand: 'Visa', outcome: 'success', label: 'Payment succeeds' },
  { number: '5555555555554444', brand: 'Mastercard', outcome: 'success', label: 'Payment succeeds' },
  { number: '378282246310005', brand: 'American Express', outcome: 'success', label: 'Payment succeeds' },
  { number: '4000000000000002', brand: 'Visa', outcome: 'card_declined', label: 'Card is declined' },
  { number: '4000000000009995', brand: 'Visa', outcome: 'insufficient_funds', label: 'Insufficient funds' },
  { number: '4000000000000127', brand: 'Visa', outcome: 'incorrect_cvc', label: 'Incorrect CVC' },
];

const DECLINE_MESSAGES: Record<Exclude<Outcome, 'success'>, string> = {
  card_declined: 'Your card was declined. Try a different card.',
  insufficient_funds: 'Your card has insufficient funds.',
  expired_card: 'Your card has expired.',
  incorrect_cvc: "Your card's security code is incorrect.",
};

export function luhnValid(num: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let d = Number(num[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return num.length >= 13 && sum % 10 === 0;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function charge(card: CardInput, amount: number): Promise<ChargeResult> {
  // Simulate the network round trip to a processor.
  await sleep(process.env.NODE_ENV === 'test' ? 0 : 900);

  const number = card.number.replace(/\D/g, '');
  if (!luhnValid(number)) {
    return { ok: false, code: 'invalid_number', message: 'Your card number is invalid.', field: 'number' };
  }

  const now = new Date();
  const expYear = card.expYear < 100 ? 2000 + card.expYear : card.expYear;
  const endOfExpiryMonth = new Date(expYear, card.expMonth, 0, 23, 59, 59);
  if (card.expMonth < 1 || card.expMonth > 12 || endOfExpiryMonth < now) {
    return { ok: false, code: 'expired_card', message: DECLINE_MESSAGES.expired_card, field: 'expiry' };
  }

  const test = TEST_CARDS.find((c) => c.number === number);
  if (!test) {
    return {
      ok: false,
      code: 'live_card_rejected',
      message: 'This is a demo store and only accepts test cards. Use 4242 4242 4242 4242.',
      field: 'number',
    };
  }

  const cvcLength = test.brand === 'American Express' ? 4 : 3;
  if (!new RegExp(`^\\d{${cvcLength}}$`).test(card.cvc)) {
    return { ok: false, code: 'invalid_cvc', message: `Security code must be ${cvcLength} digits.`, field: 'cvc' };
  }

  if (amount <= 0) return { ok: false, code: 'invalid_amount', message: 'Nothing to charge.' };

  if (test.outcome !== 'success') {
    return {
      ok: false,
      code: test.outcome,
      message: DECLINE_MESSAGES[test.outcome],
      field: test.outcome === 'incorrect_cvc' ? 'cvc' : 'number',
    };
  }

  return { ok: true, transactionId: `txn_${randomId(14)}`, brand: test.brand, last4: number.slice(-4) };
}
