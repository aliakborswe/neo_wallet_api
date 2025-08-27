# 💳 Neo_Wallet_API  

A **secure, modular, and role-based backend API** for a digital wallet system (similar to **Bkash** or **Nagad**) built with **Express.js** and **Mongoose**.  

This API enables **users, agents, and admins** to perform core financial operations such as **add money, withdraw, send money**, while ensuring **authentication, authorization, and transaction tracking**.  

---

## 🚀 Features  

### 🔐 Authentication & Authorization  
- JWT-based authentication.  
- Secure password hashing with **bcrypt**.  
- Role-based access control: `admin`, `agent`, `user`.  

### 🏦 Wallet Management  
- Automatic wallet creation during registration.  
- Initial balance for every wallet (default: **৳50**).  
- Admin can **block/unblock wallets**.  

### 💸 User Features  
- Add money (top-up).  
- Withdraw money.  
- Send money to another user.  
- View own transaction history.  

### 🧑‍💼 Agent Features  
- Cash-in: Add money to a user’s wallet.  
- Cash-out: Withdraw money from a user’s wallet.  
- Commission tracking (optional).  

### 👨‍💻 Admin Features  
- View all users, agents, wallets, and transactions.  
- Approve or suspend agents.  
- Block/unblock wallets.  
- Configure system parameters (optional).  

### 📊 Transactions  
- Fully trackable transaction history.  
- Atomic balance updates + transaction record creation.  
- Support for `add_money`, `withdraw`, `send_money`, `cash_in`, `cash_out`.  

---

## 📁 Project Structure  

src/app/api/v1

├── modules/

│   ├── auth/          # Login, register, JWT logic

│   ├── user/          # User & agent management

│   ├── wallet/        # Wallet model & operations

│   └── transaction/   # Transaction logic & history

├── middlewares/       # Auth, role guards, error handling

├── config/            # Environment & app config

├── utils/             # Helpers (logger, response, etc.)

├── app.ts             # Express app entry point

```
---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repo
```bash
git clone https://github.com/aliakborswe/neo_wallet_api.git
cd neo_wallet_api

```

### 2️⃣ Install Dependencies

```bash
npm install

```

### 3️⃣ Configure Environment

Create `.env` file:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/digital_wallet
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
INITIAL_BALANCE=50

```

### 4️⃣ Run Project

```bash
npm run dev

```

---

## 📌 API Endpoints

### 🔐 Auth

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register new user/agent |
| POST | `/auth/login` | Public | Login & get JWT |

### 🏦 Wallet

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET | `/wallets/me` | User | Get own wallet |
| PATCH | `/wallets/block/:id` | Admin | Block/unblock wallet |
| POST | `/wallets/deposit` | User | Add money (top-up) |
| POST | `/wallets/withdraw` | User | Withdraw money |
| POST | `/wallets/send` | User | Send money to another |

### 💸 Transactions

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| GET | `/transactions/me` | User/Agent | View own transactions |
| GET | `/transactions/all` | Admin | View all transactions |

### 🧑‍💼 Agent

| Method | Endpoint | Role | Description |
| --- | --- | --- | --- |
| POST | `/agents/cashin` | Agent | Add money to user wallet |
| POST | `/agents/cashout` | Agent | Withdraw money from user |
| GET | `/agents/commissions` | Agent | View commission history |
| PATCH | `/agents/approve/:id` | Admin | Approve/suspend agent |

---

## 🔁 Transaction Model

Each transaction stores:

- `type` → add_money | withdraw | send_money | cash_in | cash_out
- `amount`
- `from` (user/agent ID)
- `to` (receiver ID)
- `fee` (if applicable)
- `commission` (for agents)
- `status` → pending | completed | reversed
- `timestamp`

---

## 🛡️ Validations & Rules

- Users cannot withdraw/send more than balance.
- Blocked wallets cannot perform transactions.
- Agents cannot transact on behalf of blocked users.
- Negative/zero amounts are rejected.