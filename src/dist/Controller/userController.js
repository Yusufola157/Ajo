"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOutToBank = exports.UpdateBackToSchoolAccount = exports.backToSchool = exports.getallUser = exports.getOneUser = exports.checkPayment = exports.fundWalletFromBank = exports.LoginUser = exports.RegisterUser = void 0;
const userModel_1 = __importDefault(require("../Model/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const walletModel_1 = __importDefault(require("../Model/walletModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const historyModel_1 = __importDefault(require("../Model/historyModel"));
// import saveLockModel from "../saveLock.model"
const node_cron_1 = __importDefault(require("node-cron"));
const backToSchoolModel_1 = __importDefault(require("../Model/backToSchoolModel"));
const adminModel_1 = __importDefault(require("../Model/adminModel"));
const uuidv4_1 = require("uuidv4");
const crypto_1 = __importDefault(require("crypto"));
const axios_1 = __importDefault(require("axios"));
const RegisterUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hash = yield bcrypt_1.default.hash(password, salt);
        const regUser = yield userModel_1.default.create({
            name,
            email,
            password: hash,
        });
        const createWalllet = yield walletModel_1.default.create({
            _id: regUser === null || regUser === void 0 ? void 0 : regUser._id,
            balance: 1000,
            credit: 0,
            debit: 0,
        });
        regUser === null || regUser === void 0 ? void 0 : regUser.wallet.push(new mongoose_1.default.Types.ObjectId(createWalllet === null || createWalllet === void 0 ? void 0 : createWalllet._id));
        regUser.save();
        return res.status(200).json({
            message: "created user",
            data: regUser,
            token: jsonwebtoken_1.default.sign({ _id: regUser._id }, "ddhrjd-jfjfndd-nehdjs")
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error
        });
    }
});
exports.RegisterUser = RegisterUser;
const LoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "you are not authorzed"
            });
        }
        else {
            return res.status(200).json({
                message: `welcome back ${user.name}`,
                data: user
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "email or password not correct"
        });
    }
});
exports.LoginUser = LoginUser;
const secret = "sk_test_wPZCcpTGDMgKMFF2EFYofTd1Bcqj9HKZHgFsPkU5";
const urlData = "https://api.korapay.com/merchant/api/v1/charges/card";
const encrypt = "r3uoR15H399dEzbBsBY3zyorErpvmhou";
function encryptAES256(encryptionKey, paymentData) {
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv("aes-256-gcm", encryptionKey, iv);
    const encrypted = cipher.update(paymentData);
    const ivToHex = iv.toString("hex");
    const encryptedToHex = Buffer.concat([encrypted, cipher.final()]).toString("hex");
    return `${ivToHex}:${encryptedToHex}:${cipher.getAuthTag().toString("hex")}`;
}
const fundWalletFromBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const getUser = yield userModel_1.default.findById(req.params.userId);
        const getWallet = yield walletModel_1.default.findById(getUser === null || getUser === void 0 ? void 0 : getUser._id);
        if (getUser) {
            const data = {
                amount: `${amount}`,
                redirect_url: "https://codelab-student.web.app",
                currency: "NGN",
                reference: `${(0, uuidv4_1.uuid)()}`,
                narration: "Fix Test Webhook",
                channels: ["card"],
                default_channel: "card",
                customer: {
                    name: `${getUser === null || getUser === void 0 ? void 0 : getUser.name}`,
                    email: `${getUser === null || getUser === void 0 ? void 0 : getUser.email}`,
                },
                notification_url: "https://webhook.site/8d321d8d-397f-4bab-bf4d-7e9ae3afbd50",
                metadata: {
                    key0: "test0",
                    key1: "test1",
                    key2: "test2",
                    key3: "test3",
                    key4: "test4",
                },
            };
            var config = {
                method: "post",
                maxBodyLength: Infinity,
                url: "https://api.korapay.com/merchant/api/v1/charges/initialize",
                headers: {
                    Authorization: `Bearer ${secret}`,
                },
                data: data,
            };
            // res.end();
            yield (0, axios_1.default)(config)
                .then(function (response) {
                return __awaiter(this, void 0, void 0, function* () {
                    //   console.log("here",response.config.data."")
                    const getUser = yield userModel_1.default.findById(req.params.id);
                    //mycode
                    yield walletModel_1.default.findByIdAndUpdate(getUser === null || getUser === void 0 ? void 0 : getUser._id, {
                        balance: (getWallet === null || getWallet === void 0 ? void 0 : getWallet.balance) + 12000
                    }, { new: true });
                    return res.status(200).json({
                        message: `the sum of ${amount} is added`,
                        data: { paymentInfo: getWallet,
                            paymentData: JSON.parse(JSON.stringify(response.data))
                        },
                    });
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
        else {
            return res.status(400).json({
                message: "you are not a user"
            });
        }
    }
    catch (error) {
        return res.status(401).json({
            message: "an error occured"
        });
    }
});
exports.fundWalletFromBank = fundWalletFromBank;
const checkPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // name: "Test Cards",
        // number: "5188513618552975",
        // cvv: "123",
        // expiry_month: "09",
        // expiry_year: "30",
        // pin: "1234",
        const user = yield userModel_1.default.findById(req.params.id);
        // console.log(getWallet);
        const wallet = yield walletModel_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        const { amount, description, name, number, cvv, pin, expiry_year, expiry_month } = req.body;
        const paymentData = {
            reference: (0, uuidv4_1.uuid)(),
            card: {
                name: "Test Cards",
                number,
                cvv,
                expiry_month,
                expiry_year,
                pin,
            },
            amount,
            currency: "NGN",
            redirect_url: "https://merchant-redirect-url.com",
            customer: {
                name: user === null || user === void 0 ? void 0 : user.name,
                email: user === null || user === void 0 ? void 0 : user.email,
            },
            metadata: {
                internalRef: "JD-12-67",
                age: 15,
                fixed: true,
            },
        };
        const stringData = JSON.stringify(paymentData);
        const bufData = Buffer.from(stringData, "utf-8");
        const encryptedData = encryptAES256(encrypt, bufData);
        var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: urlData,
            headers: {
                Authorization: `Bearer ${secret}`,
            },
            data: {
                charge_data: `${encryptedData}`,
            },
        };
        (0, axios_1.default)(config)
            .then(function (response) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                console.log(response);
                if (((_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.status) === true) {
                    yield walletModel_1.default.findByIdAndUpdate(wallet === null || wallet === void 0 ? void 0 : wallet._id, {
                        balance: Number(amount + (wallet === null || wallet === void 0 ? void 0 : wallet.balance)),
                    });
                    const getHistory = yield historyModel_1.default.create({
                        message: `Dear ${user === null || user === void 0 ? void 0 : user.name} your account has been credited by ${amount}`,
                        transactionRefrence: (_b = response === null || response === void 0 ? void 0 : response.data) === null || _b === void 0 ? void 0 : _b.reference,
                        Date: new Date().toLocaleDateString(),
                        description,
                    });
                    (_c = user === null || user === void 0 ? void 0 : user.history) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(getHistory === null || getHistory === void 0 ? void 0 : getHistory._id));
                    user === null || user === void 0 ? void 0 : user.save();
                    return res.status(200).json({
                        message: `an amount of ${amount} has been added`,
                        data: {
                            paymentInfo: amount,
                            paymentData: JSON.parse(JSON.stringify(response.data)),
                        },
                    });
                }
                else {
                    return res.status(404).json({
                        message: "failed transaction",
                    });
                }
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkPayment = checkPayment;
// if(saves){
//     cron.schedule('* * * * *',()=>{
//      saves.balance +=   10000
//      console.log("balance added")
//  })
// }
// export const Save =  async (req:Request,res:Response):Promise<Response>=>{
//     try {
//        const{balance,amount} = req.body;
//        const user = await userModel.findById(req.params.id)
//        const userWallet = await walletModel.findById(user?._id)
//     //    const saveLocks = await saveLockModel.findById(userWallet?._id)
//        if(amount > userWallet!){
//          return res.status(404).json({
//             message:"insufficient fund"
//         }) 
//        }else{
//         cron.schedule('* * * * *',async ()=>{
//             await walletModel.findByIdAndUpdate(user?._id,{
//                 balance: balance - amount 
//                })
//                const saves = await saveLockModel.findByIdAndUpdate({
//                 _id:user?._id,
//                 balance:balance + amount,
//                 credit:+ amount,
//                 debit : 0,
//            })
//             user?.saveLock?.push(new mongoose.Types.ObjectId(saves?._id))
//             user?.save()
//             return res.status(200).json({
//                 message:"savelock created",
//                 data:saves
//                })
//                       })
//                       return res.status(400).json({
//                         message:"savelock not created",
//                        })
//     } 
// }catch (error) {
//     return res.status(400).json({
//         message:"savelock not created",
//        })
// }
// }
const getOneUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield userModel_1.default.findById(req.params.id).populate('wallet');
        return res.status(200).json({
            message: "here is the user",
            data: all,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "erro occ"
        });
    }
});
exports.getOneUser = getOneUser;
const getallUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield userModel_1.default.find();
        return res.status(200).json({
            message: "all user",
            data: all,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "erro occ"
        });
    }
});
exports.getallUser = getallUser;
const backToSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { purpose, Target } = req.body;
        const user = yield userModel_1.default.findById(req.params.id);
        if (user) {
            const create = yield backToSchoolModel_1.default.create({
                _id: user === null || user === void 0 ? void 0 : user._id,
                purpose,
                balance: 0,
                Target,
            });
            (_a = user === null || user === void 0 ? void 0 : user.backToSchool) === null || _a === void 0 ? void 0 : _a.push(new mongoose_1.default.Types.ObjectId(create._id));
            user === null || user === void 0 ? void 0 : user.save();
            return res.status(200).json({
                message: "account created",
                data: create,
            });
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "account not created",
        });
    }
});
exports.backToSchool = backToSchool;
const UpdateBackToSchoolAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { amount, description } = req.body;
        const user = yield userModel_1.default.findById(req.params.id);
        const wallet = yield walletModel_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        const backToSchool = yield backToSchoolModel_1.default.findById(wallet === null || wallet === void 0 ? void 0 : wallet._id);
        if (!backToSchool) {
            return res.status(400).json({
                message: "backtoschool wallet not created"
            });
        }
        else {
            if (amount > (wallet === null || wallet === void 0 ? void 0 : wallet.balance)) {
                return res.status(404).json({
                    message: "insuuficient balaance"
                });
            }
            else {
                yield walletModel_1.default.findByIdAndUpdate(wallet === null || wallet === void 0 ? void 0 : wallet._id, {
                    balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) - amount,
                    debit: amount,
                    credit: 0,
                });
                yield backToSchoolModel_1.default.findByIdAndUpdate(backToSchool === null || backToSchool === void 0 ? void 0 : backToSchool._id, {
                    balance: (backToSchool === null || backToSchool === void 0 ? void 0 : backToSchool.balance) + amount,
                    debit: 0,
                    credit: amount,
                });
                const getHistory = yield historyModel_1.default.create({
                    message: `Dear ${user === null || user === void 0 ? void 0 : user.name} your back to school wallet has been credited with ${amount}`,
                    transactionRefrence: Math.floor(Math.random() * 54000000000),
                    Date: new Date().toLocaleDateString(),
                    description,
                });
                (_b = user === null || user === void 0 ? void 0 : user.history) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(getHistory === null || getHistory === void 0 ? void 0 : getHistory._id));
                node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
                    var _c;
                    yield walletModel_1.default.findByIdAndUpdate(wallet === null || wallet === void 0 ? void 0 : wallet._id, {
                        balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) + (backToSchool === null || backToSchool === void 0 ? void 0 : backToSchool.balance),
                    });
                    const getHistory = yield historyModel_1.default.create({
                        message: `Dear ${user === null || user === void 0 ? void 0 : user.name} your back to school wallet has been credited with ${wallet === null || wallet === void 0 ? void 0 : wallet.balance}`,
                        transactionRefrence: Math.floor(Math.random() * 54000000000),
                        Date: new Date().toLocaleDateString(),
                        description,
                    });
                    (_c = user === null || user === void 0 ? void 0 : user.history) === null || _c === void 0 ? void 0 : _c.push(new mongoose_1.default.Types.ObjectId(getHistory === null || getHistory === void 0 ? void 0 : getHistory._id));
                    yield backToSchoolModel_1.default.findByIdAndUpdate(wallet === null || wallet === void 0 ? void 0 : wallet._id, {
                        balance: 0,
                        credit: 0,
                        debit: backToSchool === null || backToSchool === void 0 ? void 0 : backToSchool.balance,
                    });
                    console.log("amount has been added....");
                }));
                return res.status(200).json({
                    message: "ok"
                });
            }
        }
    }
    catch (error) {
        return res.status(400).json({
            message: "error occured"
        });
    }
});
exports.UpdateBackToSchoolAccount = UpdateBackToSchoolAccount;
// export const withdraw = async(req:Request,res:Response):Promise<Response>=>{
//     try {
//         const {amount} = req.body
//         const user = await userModel.findById(req.params.userId)
//         const admin = await adminModel.findById(req.params.adminId)
//         const wallet = await walletModel.findById(user?._id)
//         const adminWallet = await walletModel.findById(admin?._id)
//         if(user){
//           if((amount * 1.09) > wallet?.balance!){
//                return res.status(400).json({
//                 message:"insufficient balance"
//                })
//           }else{
//               const userWith= await walletModel?.findByIdAndUpdate(user?._id,{
//                 balance:wallet?.balance! - ( amount * 1.09)
//               })
//               const adminWith= await walletModel?.findByIdAndUpdate(admin?._id,{
//                 balance:adminWallet?.balance! + ((amount * 1.09) - amount)
//               })
//               return res.status(200).json({
//                 message:`dear mr/mrs${user?.name} you have succefully withdraw the sum of ${amount} and with mentainance fee of ${adminWallet?.balance! + ((amount * 1.09) - amount)} your current balance is ${wallet?.balance! - ( amount * 1.09)}`,
//                 // data:userWith
//                })
//           }
//         }else{
//             return res.status(404).json({
//                 message:"you are not a user"
//             })
//         }
//     } catch (error) {
//         return res.status(404).json({
//             message:"an error occured"
//            })
//     }
// }
const checkOutToBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, name, number, cvv, pin, expiry_year, expiry_month, title, description, } = req.body;
        const user = yield userModel_1.default.findById(req.params.userId);
        const admin = yield adminModel_1.default.findById(req.params.adminId);
        const wallet = yield walletModel_1.default.findById(user === null || user === void 0 ? void 0 : user._id);
        const adminWallet = yield walletModel_1.default.findById(admin === null || admin === void 0 ? void 0 : admin._id);
        var data = JSON.stringify({
            reference: (0, uuidv4_1.uuid)(),
            destination: {
                type: "bank_account",
                amount,
                currency: "NGN",
                narration: "Test Transfer Payment",
                bank_account: {
                    bank: "033",
                    account: "0000000000",
                },
                customer: {
                    name: "John Doe",
                    email: "johndoe@korapay.com",
                },
            },
        });
        var config = {
            method: "post",
            maxBodyLength: Infinity,
            url: "https://api.korapay.com/merchant/api/v1/transactions/disburse",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${secret}`,
            },
            data: data,
        };
        (0, axios_1.default)(config)
            .then(function (response) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                if (user) {
                    if ((amount * 1.09) > (wallet === null || wallet === void 0 ? void 0 : wallet.balance)) {
                        return res.status(400).json({
                            message: "insufficient balance"
                        });
                    }
                    else {
                        const userWith = yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, {
                            balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) - (amount * 1.09)
                        }));
                        const adminWith = yield (walletModel_1.default === null || walletModel_1.default === void 0 ? void 0 : walletModel_1.default.findByIdAndUpdate(admin === null || admin === void 0 ? void 0 : admin._id, {
                            balance: (adminWallet === null || adminWallet === void 0 ? void 0 : adminWallet.balance) + ((amount * 1.09) - amount)
                        }));
                        const getHistory = yield historyModel_1.default.create({
                            message: `Dear ${user === null || user === void 0 ? void 0 : user.name} your back to school wallet has been credited with ${wallet === null || wallet === void 0 ? void 0 : wallet.balance}`,
                            transactionRefrence: (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.reference,
                            Date: new Date().toLocaleDateString(),
                            description,
                        });
                        (_b = user === null || user === void 0 ? void 0 : user.history) === null || _b === void 0 ? void 0 : _b.push(new mongoose_1.default.Types.ObjectId(getHistory === null || getHistory === void 0 ? void 0 : getHistory._id));
                        return res.status(201).json({
                            message: "success",
                            data: JSON.parse(JSON.stringify(response.data)),
                        });
                    }
                }
                else {
                    return res.status(404).json({
                        message: "you are not a user"
                    });
                }
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkOutToBank = checkOutToBank;
