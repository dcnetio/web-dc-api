/**
 * 链节点交互
 */
// Import everything
import { ethers, Wallet,JsonRpcProvider} from "ethers";

let jsonRpcProvider: ethers.JsonRpcProvider|null;

const getProvider = ():ethers.JsonRpcProvider|null => {
  return jsonRpcProvider;
}


const connectWithHttps = async (url: string) => {
  try {
    jsonRpcProvider = new JsonRpcProvider(url);
    console.log('connectChainWithWss success,url: ', url);
    return true;
  } catch (error) {
    jsonRpcProvider = null;
    console.log('connectChainWithWss error', error);
    return false;
  }
}

// 创建钱包账号
const createWalletAccount = async () => {
  // wallet 创建包，助记词，私钥，地址
  const wallet = Wallet.createRandom();
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
  return wallet;
};

// 根据助记词生成钱包账号
const createWalletAccountWithMnemonic = async (mnemonic: string) => {
  const wallet = Wallet.fromPhrase(mnemonic);
  console.log('===============wallet', wallet);
  console.log('===============wallet.mnemonic', wallet.mnemonic);
  console.log('===============wallet.privateKey', wallet.privateKey);
  console.log('===============wallet.address', wallet.address);
  return wallet;
}


// 获取当前区块高度
const getBlockNumber = async () => {
  if(jsonRpcProvider){
    const blockNumber = await jsonRpcProvider.getBlockNumber();
    return blockNumber;
  } else {
    return null;
  }
};

// 获取用户的余额
const getUserBalance = async (address:string) => {
  if(jsonRpcProvider){
      const balance = await jsonRpcProvider.getBalance(address);
      console.log('===============getUserBalance balance', balance);
      const nb = balance > 0 ? (Number(balance) / 10000000000 / 100000000).toFixed(4) : '0';
      return nb
    }

};

async function checkNetworkStatus() {  
  try {  
    if (!jsonRpcProvider) {  
        console.log("请先连接到网络");  
        return false;
    }
    const blockNumber = await jsonRpcProvider.getBlockNumber();  
    console.log("当前区块号:", blockNumber);  
    return true;
  } catch (error) {  
      console.log("无法连接到网络:", error);  
      return false; 
  }  
} 

// 转账
const transfer = async (wallet: ethers.HDNodeWallet, to: string, amount: string,gasLimit: number,gasPrice: string ) => {
  wallet = wallet.connect(jsonRpcProvider);
  // 定义交易对象  
  const transaction = {  
    to: to, // 接收者地址  
    value: ethers.parseEther(amount), // 发送金额（以太币）  
    gasLimit: gasLimit, // 基本交易的 gas 限制  
    gasPrice: ethers.parseUnits(gasPrice, "gwei") // gas 价格  
  }; 
  const txResponse  = await wallet.sendTransaction(transaction);
  return txResponse;
};

// 等待交易确认
const waitTransactionConfirm = async (txResponse: ethers.TransactionResponse,_confirms?:number,_timeout?:number) => {
  try {
    const receipt = await txResponse.wait(_confirms,_timeout);  
    console.log("Transaction receipt: ", receipt);  
    return receipt;
  } catch (error) {
    console.log('waitTransactionConfirm error', error);
    return null;
  }
}



// 生成签名
const signMessage = async (wallet: ethers.HDNodeWallet,message: Uint8Array|string,) => {  
  // Sign the message  
  const signature = await wallet.signMessage(message);  
  console.log("Signature: ", signature);  
  return signature;
}

// 生成eip712签名
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const signEIP712Message = async (wallet: ethers.HDNodeWallet,primaryType:string, domain:ethers.TypedDataDomain, types:Record<string, Array<ethers.TypedDataField>>, message:Record<string, any>) => {  
  try{
    // 计算域分隔符  
    const domainSeparator = ethers.TypedDataEncoder.hashDomain(domain);  

    // 计算结构化数据的哈希值  
    const hashStruct = ethers.TypedDataEncoder.hashStruct(primaryType, types, message);  

    // 生成最终的哈希值  
    const digest = ethers.keccak256(  
        ethers.solidityPacked(  
            ["string", "bytes32", "bytes32"],  
            ["\x19\x01", domainSeparator, hashStruct]  
        )  
    );  

    // 从签名中恢复地址  
    const signature = await wallet.signMessage(digest);  
    console.log("Signature: ", signature);  
   const flag = await verifyEIP712Signature(primaryType, domain, types, message, signature, wallet.address);
    console.log('signEIP712Message flag', flag);
    return signature;
  } catch (error) {
    console.log('signEIP712Message error', error);
  }
  return null;
}

// Function to verify the signature  message:要签名的消息，signature:签名,16进制，expectedAddress:预期的签名者地址
const verifySignature =  (message: Uint8Array|string, signature: string, expectedAddress:string) => {  
  // Hash the message  
  const messageHash = ethers.hashMessage(message);  

  // Recover the address from the signature  
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);  

  // Compare the recovered address with the expected address  
  if (recoveredAddress.toLowerCase() === expectedAddress.toLowerCase()) {  
      console.log("Signature is valid and matches the expected address.");  
      return true;
  } else {  
      console.log("Signature is invalid or does not match the expected address.");  
      return false;
  }  
}


/**  
 * 验证 EIP-712 签名  
 * @param {string} primaryType - 主类型名称  
 * @param {object} domain - 域信息  
 * @param {object} types - 类型定义集合  
 * @param {object} message - 要验证的消息数据  
 * @param {string} signature - 签名  
 * @param {string} expectedAddress - 预期的签名者地址  
 * @returns {boolean} - 签名是否有效  
 */  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyEIP712Signature =  (primaryType:string, domain:ethers.TypedDataDomain, types:Record<string, Array<ethers.TypedDataField>>, message:Record<string, any>, signature:string, expectedAddress:string) => {  
  // 计算域分隔符  
  const domainSeparator = ethers.TypedDataEncoder.hashDomain(domain);  

  // 计算结构化数据的哈希值  
  const hashStruct = ethers.TypedDataEncoder.hashStruct(primaryType, types, message);  

  // 生成最终的哈希值  
  const digest = ethers.keccak256(  
      ethers.solidityPacked(  
          ["string", "bytes32", "bytes32"],  
          ["\x19\x01", domainSeparator, hashStruct]  
      )  
  );  
    // Hash the message  
   const messageHash = ethers.hashMessage(digest);  
  // 从签名中恢复地址  
  const recoveredAddress = ethers.recoverAddress(messageHash, signature);  
  // 比较恢复的地址与预期地址  
  return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();  
}  


//获取转账预估gas
const estimateGas = async (wallet: ethers.HDNodeWallet, to: string, amount: string) => {
  wallet = wallet.connect(jsonRpcProvider);
  // 定义交易对象  
  const transaction = {  
    to: to, // 接收者地址  
    value: ethers.parseEther(amount), // 发送金额（以太币）  
  }; 
  const gas = await wallet.estimateGas(transaction);
  return gas;
};

// 获取交易状态 
const  checkTransactionStatus = async (txHash:string) => {  
  if (!jsonRpcProvider) {
    return null;
  }
  try { 
      const receipt = await jsonRpcProvider.getTransactionReceipt(txHash);  
      if (receipt) {  
          if (receipt.status === 1) {  
              console.log('Transaction succeeded:', receipt);  
          } else {  
              console.log('Transaction failed:', receipt);  
          }  
          return receipt;
      } else {  
          console.log('Transaction is still pending...');  
          return null;
      }  
  } catch (error) {  
      console.error('Error checking transaction status:', error);  
      return null;
  }  
}  

const ethersHelper = {
  getProvider,
  connectWithHttps,
  checkNetworkStatus,
  createWalletAccount,
  createWalletAccountWithMnemonic,
  getBlockNumber,
  getUserBalance,
  transfer,
  waitTransactionConfirm,
  signMessage,
  signEIP712Message,
  verifySignature,
  verifyEIP712Signature,
  estimateGas,
  checkTransactionStatus
};
export default  ethersHelper;

