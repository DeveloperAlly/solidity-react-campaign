# solidity-react-campaign

Project build off Stephen Griders Udemy course: Ethereum and Solidity: The Complete Developer's Guide


To use this project.

- Ensure you have a metamask with test ethereum on the rinkeby network and are signed up on infura (rinkeby testnet)
- Clone the project
- Create a .env file with 
      DEPLOYED_CONTRACT_ADDRESS = 38241x92 //You get this after deploying to infura
      INFURA_ADDRESS = "https://rinkeby.infura.io/v3/EXAMPLE ADDRESS"
      MM_SEED = //Your fresh worthless metamask dev wallet with test eth SEED phrase
- Navigate to /ethereum folder and run >node compile.js (this will compile the solidity files for deplpyment)
- Then deploy to infura >node deploy.js (make sure to get your deployment address from the console output for the .env file)
- Navigate to root folder. >npm run dev

(yes this readme leaves a lot to be desired - feel free to help fix it :P)
