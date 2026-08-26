import "dotenv/config";
import { ethers } from "ethers";
import artifact from "../artifacts/contracts/ReputationManager.sol/ReputationManager.json" with { type: "json" };

const rpcUrl = "http://127.0.0.1:8545";
const contractAddress = "0x44264bfA3Dcd7F139398087C4Cb0E2330EB381Ef";

const provider = new ethers.JsonRpcProvider(rpcUrl);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
const contract = new ethers.Contract(contractAddress, artifact.abi, wallet);

// const validators = [
//   "0xee75e7826372e1edd7db15af807a9f02751756a4",
//   "0x74c09ba8de97efd2f836cc73a1bacac9d1d88a63",
//   "0xda5b0ef583641a69314b3d98b049f78bd24f0e14",
//   "0xa3e5f6fdb94c11aaf9ce352aec48438d3f078919",
// ];
const validators = [
  "0x2f53ca9e0c887f9c1b42c4486d50e0d8464bbecf",
  "0x39ad67cc8e22ebfb577bf6d856446c1f63c2b50d",
  "0x416f990fd2d76ee34516112fb37f7f73eae5a5d0",
  "0x4782cff471ddee18276682a992c6de624506f734",
  "0x47a62b31824b4203a0be8920c4cd5a403d02f477",
  "0x538cb748ff9f6770fe95b4c549adac91ab2dd72a",
  "0x7bf5502a5bf925ef02fa7884f4aa9d9036476ba9",
  "0xbd940de1255919734104edcba52d243e4a00be4f",
];
// const validators = [
//   "0x0fd629eeecb8675a011cceef0adf5a05c9ce35bd",
//   "0x18e9ae9e04083c37b9f972e1e53e2c0a99d98bc3",
//   "0x33dfaed508a59791c424afca10eab2265aff88c5",
//   "0x473898460a419dea8345a2bd0158010cbeed21d0",
//   "0x484bda0eab813a2cac8241eae571bebef2ce72ae",
//   "0x7163c2a11bf56a9d195f83810a8c56ca827c13f6",
//   "0x8c282c6b5cb5f62415e0087aa3f3f54b1b8d4d4a",
//   "0x9cc36adae075d2966cc50a4d0f13f85c28830934",
//   "0xb42cf1780a20e7e807ea6eaa546930ad7b4b08eb",
//   "0xb861147c2014b5794d290c8af4a57e1cb6e743aa",
//   "0xd9ab81e97b949ff21f2b248b463c1467fd811c16",
//   "0xee254bcc90775fc17d8904285be55af4e1c707a8",
// ];




// const validators = [
//   "0x164b37742cd9cbc48a397ea8a5e292b778d47705",
//   "0x1bbd4cbec577c78d6abc8aec13c7dbb07621f100",
//   "0x32e594d06d06d9fd056dec6a2d3a75f14057d970",
//   "0x3c723ce75e51a9da96e9867e4018cacc0eb2438e",
//   "0x414b73b13ee36739080bcf212e2e3ac412b319b1",
//   "0x6ef4760e364434ddd535adb81ec0a8464cf44823",
//   "0x711e96a0924312ed04d1d511384c52e0d6309d19",
//   "0x7979b082ea55897ae43938c8d30db6e070cc5b7b",
//   "0x82dfbabdbf29a8acdb722c9b2fdf726c7a0fd610",
//   "0x96de33a1fc25067da69dad1b0bd90afa7902b1ee",
//   "0xa1d3f67513a40d738a21591aa9c92b1d6e0fdf98",
//   "0xac8605cd8129c8a2427b1db9bc2e967e0b72c37d",
//   "0xb32145120e91173d67c7e20a0177f837afb6abf4",
//   "0xf65a8463a7c90d2e1ef6f27d617949bd8f2a0b01",
//   "0xf78ff5c8e8544206645b9cdafa49dbb7c397974d",
//   "0xfec64150aecf2b7dcbea4114fb26ddad0a70797f",
// ];

for (const validator of validators) {
  console.log("Registering:", validator);

  const tx = await contract.registerValidator(validator);
  console.log("Tx:", tx.hash);

  await tx.wait();
  console.log("Registered:", validator);
}

console.log("Active validators:");
console.log(await contract.getActiveValidators());