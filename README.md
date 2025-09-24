# LandMafia

LandMafia is a decentralized land registry platform that leverages blockchain technology for secure, transparent, and tamper-proof property registration, verification, and transfer. The project consists of a Next.js frontend, a Flask backend for document/face verification, and smart contracts for property management.

---

## Project Structure

```
LandMafia/
│
├── Dockerfile
├── README.md
│
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
│
└── frontend/
    ├── .env.local
    ├── .gitignore
    ├── Dockerfile
    ├── eslint.config.mjs
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── postcss.config.mjs
    ├── README.md
    ├── tsconfig.json
    ├── app/
    │   ├── api/
    │   ├── approval/
    │   ├── login/
    │   ├── marketplace/
    │   ├── profile/
    │   ├── tst/
    │   ├── uploadLand/
    │   ├── viewLand/
    │   ├── Verification/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    ├── assets/
    ├── components/
    ├── context/
    ├── models/
    ├── public/
    ├── utils/
    └── .next/
```

---

## Features

- **User Authentication:** Wallet-based login and registration.
- **Property Registration:** Upload land details and documents, store on IPFS, and register on blockchain.
- **Document & Face Verification:** Uses AI (DeepFace) for KYC and document validation via the backend.
- **Admin Dashboard:** Approve/reject property listings and manage registrations.
- **Marketplace:** Browse, search, and request to buy verified properties.
- **Profile:** View owned properties, transaction history, and manage listings.
- **Blockchain Integration:** Smart contracts for property lifecycle management.
- **IPFS Integration:** Decentralized storage for property documents and images.

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.9+
- Docker (optional, for containerized deployment)
- MetaMask or compatible Ethereum wallet (for blockchain features)

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Running the Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs on [http://localhost:5000](http://localhost:5000) by default.

### Environment Variables

- Configure MongoDB and blockchain settings in `frontend/.env.local`.
- Set Pinata API keys for IPFS integration.

---

## Smart Contracts

- Located in [`frontend/utils/Contracts/Contract.sol`](frontend/utils/Contracts/Contract.sol)
- Handles property registration, verification, and transactions.

---

## Deployment

- Frontend can be deployed on [Vercel](https://vercel.com/) or any Node.js hosting.
- Backend can be deployed on [Render](https://render.com/) or any Python hosting.
- Use Docker for containerized deployment.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Flask](https://flask.palletsprojects.com/)
- [DeepFace](https://github.com/serengil/deepface)
- [Pinata](https://www.pinata.cloud/) for IPFS
- [Ethers.js](https://docs.ethers.org/)
- [MongoDB](https://www.mongodb.com/docs/)

---

For more details, see the [frontend/README.md](frontend/README.md).