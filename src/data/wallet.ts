import { Transaction } from "@/types";

export const WALLET_TRANSACTIONS: Transaction[] = [
  {
    id: 't1',
    title: 'Cashback from Royal Spice',
    description: 'Order #12345',
    amount: 50.00,
    date: 'Aug 15',
    type: 'credit',
    expiryDate: 'Sep 15, 2024'
  },
  {
    id: 't2',
    title: 'Welcome Bonus',
    description: 'First order offer',
    amount: 100.00,
    date: 'Aug 12',
    type: 'credit',
    expiryDate: 'Sep 12, 2024'
  },
  {
    id: 't3',
    title: 'Paid for Order',
    description: 'Order #12340',
    amount: 450.00,
    date: 'Aug 10',
    type: 'debit',
  }
];
