// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import userModel from '../models/userModel.js';
// import transporter from '../config/nodemailer.js';


// export const register = async (req,res) =>{
// const{name,email,password} = req.body;
// if(!name || !email || !password){
//     return res.json({success : false,message:'Missing Details'})
// }

// try{

// const existingUser = await userModel.findOne({email})

// if(existingUser){
//     return res.json({ success:false,message :"user already exists"});
// }
// const hashedPassword = await bcrypt.hash(password, 10);
// const user = new userModel({name,email,password:hashedPassword});
// await user.save();

// const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

// res.cookie('token',token ,{
//     httpOnly :true,
// secure:process.env.NODE_ENV === 'production',
// sameSite : process.env.NODE_ENV === 'production' ? 'none':'strict',
// maxAge: 7* 24 * 60 * 60 * 1000
// });

// const mailOptions = {
//     from:process.env.SENDER_EMAIL,
//     to:email,
//     subject:'welcome to the website',
//     text:`your account has created with email id: ${email}`
// };

// await transporter.sendMail(mailOptions);

// return res.json({success: true});

// }catch(error) {
//     res.json({success:false,message:error.message})
// }
// };



// export const login = async (req,res)=>{
//     const{email,password} = req.body; 
//     if(!email || !password){
//         return res.json({success:false,message:'Email and password are required'})
//     }
//     try {

//     const user = await userModel.findOne({email});

//     if(!user){
//         return res.json({success:false,message:'Invalid email'});
//     }

//     const isMatch = await bcrypt.compare(password,user.password);
    
//     if(!isMatch) {

//         return res.json({success:false, message:'Invalid password'});
//     }

// const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});

// res.cookie('token',token ,{
// httpOnly :true,
// secure:process.env.NODE_ENV === 'production',
// sameSite : process.env.NODE_ENV === 'production' ? 'none':'strict',
// maxAge: 7* 24 * 60 * 60 * 1000
// });

// return res.json({success:true});


// }catch(error) {
//         return res.json({success:false,message:error.message});
//     }

// }




// export const logout = async(req,res) =>{
//     try{
//         res.clearCookie('token',{
//             httpOnly :true,
// secure:process.env.NODE_ENV === 'production',
// sameSite : process.env.NODE_ENV === 'production' ? 'none':'strict',
//         })

//         return res.json({success:true, message:"Logged Out"})

//     }catch(error){
//         return res.json({success:false,message:error.message});
//     }
//     };

    

//      export const sendVerifyOtp=async (req,res) =>{
//         try{

//             // const{userId} = req.body;
//             const userId = req.userId;

//          const user = await userModel.findById(userId);

//             if(user.isAccountVerified){
//                 return res.json({success:false,message:"Account already verified"});
//             }
//            const otp =  String(Math.floor( 100000 + Math.random() * 900000));

//            user.verifyOtp = otp;
//            user.verifyOtpExpireAt = Date.now() +24*60*60*1000

//            await user.save();

//            const mailOption ={
//              from:process.env.SENDER_EMAIL,
//               to:user.email,
//              subject:'Account Verification OTP',
//              text:`your OTP is${otp}.verify your account using this OTP.`
//            };

//            await transporter.sendMail(mailOption);

//            res.json({success:true,message:'Verification OTP sent on Email'});
//         }catch(error){
//             res.json({success :false,message:error.message});
//         }
//      };



//      export const verifyEmail = async(req,res)=> {
//         try{
// const userId = req.userId;
//         const{otp}=req.body;

//         if(!userId || !otp){
//             return res.json({success:false,message:'Missing Details'});
    
//         }
           
//              const user = await userModel.findById(userId);
// if(!user){
//     return res.json({success:false,message:'User not found'});
// }
// console.log("DB OTP:",user.verifyOtp,"Entered OTP:",otp);

// if(user.verifyOtp === ''|| user.verifyOtp !== String(otp)){
//     return res.json({success:false,message:'Invalid OTP'});
// }
// if(user.verifyOtpExpireAt < Date.now()){
//     return res.json({success:false,message:'OTP Expired'});
// }
// user.isAccountVerified =true;
// user.verifyOtp ='';
// user.verifyOtpExpireAt=0;
// await user.save();
// return res.json({success:true,message:'Email verified successfully'});
//         }catch(error){
//             return res.json({success:false,message:error.message});
//         }
//      };


import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

// Register User
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({ success: false, message: 'Missing Details' });
    }

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to the website',
            text: `Your account has been created with email id: ${email}`
        });

        return res.json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Login User
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, message: 'Logged in successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Logout User
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Send OTP for Verification
export const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });
        if (user.isAccountVerified) return res.json({ success: false, message: 'Account already verified' });

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        console.log("Generated OTP:", otp);

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
        });

        return res.json({ success: true, message: 'Verification OTP sent on Email' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

// Verify OTP
export const verifyEmail = async (req, res) => {
    try {
        const userId = req.userId;
        const { otp } = req.body;

        if (!userId || !otp) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const user = await userModel.findById(userId);
        if (!user) return res.json({ success: false, message: 'User not found' });

        console.log("DB OTP:", user.verifyOtp, "Entered OTP:", otp);

        if (!user.verifyOtp || user.verifyOtp.trim() !== String(otp).trim()) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.json({ success: false, message: 'OTP Expired' });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;
        await user.save();

        return res.json({ success: true, message: 'Email verified successfully' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

