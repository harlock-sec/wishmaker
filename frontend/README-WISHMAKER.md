# Wishmaker hackathon frontend

This package is based on the uploaded current frontend and includes the existing homepage, rotating ten-category questionnaire, MetaMask identity minting, on-chain score submission, identity viewer, demo discovery page, and messages placeholder.

## Install (from the repository root)

```bash
cd ~/wishmaker/frontend
unzip -o ~/Downloads/wishmaker-final-release.zip -d .
npm install
npm run build
cd ..
git add frontend
git commit -m "Release Wishmaker hackathon frontend"
git push
```

The zip extracts into `src/`, `package.json`, `vercel.json` and this README. Vercel should have Root Directory set to `frontend`.

## Routes

- `/` homepage and wallet connection/mint
- `/questionnaire` ten categories, demo match preview, and **Save scores to Monad**
- `/identity` view your on-chain identity and signed quotient scores
- `/discover` clearly marked fictional example profiles
- `/messages` placeholder, not real messaging

## Important limitations

This is a **hackathon demo**, not a finished dating platform. The app does **not** implement username/password registration, verified wallet-account association, real multi-user matching, private messaging, notifications, or production privacy/security controls. The sample matches are fictional. On-chain score writes require MetaMask, Monad Testnet MON, and an already minted identity. Questionnaire answers live in browser state only and are lost on refresh. Score order is **IMOK, UROK, Solar, Lunar, Mars, Mercury, Jupiter, Venus, Saturn, Selflessness**, so verify this matches your intended contract interpretation before presenting scores as semantically canonical. Contract stores only a ten-element array, not category labels.

Monad Testnet chain 10143. Contract: `0xDaC80f0b8C396eAe2024Bc112BF1D82b7a1226CE`.
