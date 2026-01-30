# CarbonX – Setup Guide

## 1. Environment variables

### Frontend (`frontend/.env`)

Copy from `frontend/.env.example` and fill in:

- **Firebase**: Create a project at [Firebase Console](https://console.firebase.google.com). Enable Auth (Email/Password + Google), Firestore, and Storage. Copy config into:
  - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`
- **Contract**: After deploying (see below), set:
  - `VITE_CARBON_CREDIT_NFT_ADDRESS=<deployed contract address>`
- **Gemini**: Get an API key from [Google AI Studio](https://aistudio.google.com/app/apikey). Set:
  - `VITE_GEMINI_API_KEY=<your key>`

## 2. Blockchain (Hardhat + CarbonCreditNFT)

### Install and compile

```bash
cd /path/to/FactorFlow_9.3_SDG9
npm install
npx hardhat compile
```

### Deploy locally

1. Start a local node in one terminal:
   ```bash
   npx hardhat node
   ```
2. In another terminal, deploy the Carbon Credit NFT contract:
   ```bash
   npx hardhat ignition deploy ignition/modules/CarbonCreditNFT.ts --network localhost
   ```
3. Copy the deployed contract address from the output and set `VITE_CARBON_CREDIT_NFT_ADDRESS` in `frontend/.env`.
4. In MetaMask, add the Hardhat local network: RPC URL `http://127.0.0.1:8545`, Chain ID `31337`. Import an account using a private key from the `npx hardhat node` output (e.g. Account #0).

## 3. Firebase Storage CORS (fix upload CORS errors)

If you see **CORS** errors when uploading (e.g. NFT metadata or project files) from `http://localhost:8080`, the Storage bucket must allow your origin. Configure CORS on the **Google Cloud Storage** bucket (Firebase Storage uses GCS).

Your bucket name is in `VITE_FIREBASE_STORAGE_BUCKET` (e.g. `carbonx-4eeb9.firebasestorage.app` or `carbonx-4eeb9.appspot.com`).

### Option A: Google Cloud Shell (easiest)

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select project **carbonx-4eeb9** (or your Firebase project).
2. Click **Activate Cloud Shell** (top right).
3. Upload or create the CORS file. In the project we provide `frontend/cors.json`. You can create it in Cloud Shell:

   ```bash
   echo '[{"origin":["*"],"method":["GET","HEAD","PUT","POST","OPTIONS"],"responseHeader":["Content-Type","x-goog-resumable","Authorization","Content-Length","x-goog-meta-*"],"maxAgeSeconds":3600}]' > cors.json
   ```

4. Apply CORS (replace `YOUR_BUCKET_NAME` with your bucket, e.g. `carbonx-4eeb9.firebasestorage.app` or `carbonx-4eeb9.appspot.com`):

   ```bash
   gsutil cors set cors.json gs://YOUR_BUCKET_NAME
   ```

   Or with gcloud:

   ```bash
   gcloud storage buckets update gs://YOUR_BUCKET_NAME --cors-file=cors.json
   ```

5. Verify:

   ```bash
   gsutil cors get gs://YOUR_BUCKET_NAME
   ```

### Option B: Local machine

1. Install [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) and run `gcloud auth login`.
2. From the repo root, using the provided `frontend/cors.json`:

   ```bash
   gcloud storage buckets update gs://YOUR_BUCKET_NAME --cors-file=frontend/cors.json
   ```

   Use the same bucket name as in `VITE_FIREBASE_STORAGE_BUCKET`.

**Why this is needed:** The browser sends a **preflight** (OPTIONS) request before POST/PUT to Storage. If the bucket has no CORS config or is missing `responseHeader` / methods, the preflight fails with “does not pass access control check” and the upload is blocked.

## 4. Firestore indexes

Create these composite indexes in [Firebase Console](https://console.firebase.google.com) → Firestore → Indexes (or follow the link in the error when a query runs):

- **projects**: Collection `projects`, fields: `sellerId` (Ascending), `updatedAt` (Descending).
- **marketplace_listings**: Collection `marketplace_listings`, fields: `contractAddress` (Ascending), `status` (Ascending), `listedAt` (Descending).
- **marketplace_listings (buyer)**: Collection `marketplace_listings`, fields: `buyerId` (Ascending), `soldAt` (Descending).

## 5. Seller “verified” status (demo)

Projects appear in **NFT Minting** only when `verificationStatus === "verified"`. After **Create Project** and **Submit to ACVA**, status is set to `under_review`. For local testing you can:

- Manually set a project’s `verificationStatus` to `"verified"` in Firestore (e.g. in the Firebase Console), or
- Add a “Simulate verification” action in the app that updates the project to `verified`.

## 6. Run the app

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:8080`). Use the Hardhat local network in MetaMask when connecting wallet, minting, listing, and buying.

## Contract overview (CarbonCreditNFT.sol)

- **ERC-721** carbon credit NFTs; metadata includes project ID, tCO2e volume, verification proof hash.
- **Mint**: Only `minter` (set at deploy to deployer) can mint; call `mint(to, tokenURI, projectId, volumeTCO2e, verificationProofHash)`.
- **List / Unlist**: Owner calls `list(tokenId, priceWei)` or `unlist(tokenId)`.
- **Buy**: Anyone can call `buy(tokenId)` with `msg.value >= listingPrice`; ETH goes to seller, NFT to buyer.
- **Retire**: Owner of the token calls `retire(tokenId)` to mark it as used for offset; retired tokens are non-transferable.

Frontend uses **ethers.js v6** and **WalletContext** for MetaMask connection and contract calls (mint, list, buy, retire).
