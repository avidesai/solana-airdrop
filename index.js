const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
} = require("@solana/web3.js");

// Create a wallet object of type Keypair
// We will airdrop SOL into this wallet.
const newPair = new Keypair();

// Every wallet has 2 components: public key and private key.
// Public key is used to uniquely identify your wallet over the blockchain and can be used to receive crypto to your wallet. 
// Private key is used to perform transactions through your wallet.
const publicKey = new PublicKey(newPair._keypair.publicKey).toString();
const secretKey = newPair._keypair.secretKey;

// Function to get wallet balance
const getWalletBalance = async () => {
    try {
        // Connection object used to get balance.
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const myWallet = await Keypair.fromSecretKey(secretKey);
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey)
        );
        console.log(`=> For wallet address ${publicKey}`);
        console.log(`   Wallet balance: ${parseInt(walletBalance)/LAMPORTS_PER_SOL}SOL`);
    } catch (err) {
        console.log(err);
    }
};

// Function to airdrop SOL into wallet
const airDropSol = async () => {
    try {
        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
        const walletKeyPair = await Keypair.fromSecretKey(secretKey);
        console.log(`Airdropping 2 SOL now...`)
        const airDropSignature = await connection.requestAirdrop(
            new PublicKey(walletKeyPair.publicKey),
            2 * LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(airDropSignature);
    } catch (err) {
            console.log(err);
    }
};


// Driver function
const driverFunction = async () => {
    await getWalletBalance();
    await airDropSol();
    await getWalletBalance();
}

driverFunction();