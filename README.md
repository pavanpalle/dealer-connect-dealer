# DealerConnect - Dealer Portal

React Native (Expo) TypeScript app for the B2B Dealer Portal.

## Features

- **Login** with quick dealer selection (3 demo dealers)
- **Home** dashboard with KPIs, quick actions, recent orders
- **Place Order** 3-step wizard with bulk tier pricing (Half Case, Full Case, Bulk discounts)
- **My Orders** list with status tracking and order timeline
- **Invoice View** with tax breakdown (CGST/SGST), bank details
- **Schemes & Offers** with active and upcoming deals
- **Payments & Ledger** with credit management and transaction history
- **Product Catalogue** with 4-tier pricing grid and stock status
- **Reports** with monthly spend, order frequency, and product mix charts
- **Notifications** for order status updates

## Setup

```bash
npm install
npx expo start
```

## Demo Accounts

| Dealer | ID | Location |
|--------|-----|----------|
| Ramesh Stores | RS-HYD-0001 | Ameerpet |
| Lakshmi Kirana | LK-HYD-0002 | Kukatpally |
| Sri Balaji Mart | SB-HYD-0003 | Madhapur |

## Tech Stack

- React Native with Expo SDK 52
- TypeScript
- React Navigation (Bottom Tabs + Native Stack)
- Context API for state management
