import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModels from "../models/userModels.js";
import JWT from 'jsonwebtoken';


export const registerController = async (req, res) => {
    try {

        const { name, email, password, phone, address, answer } = await req.body;

        // validating data
        if (!name) {
            return res.send({ message: "Name is required" });
        }
        if (!email) {
            return res.send({ message: "Email is required" });
        }
        if (!password) {
            return res.send({ message: "Password is required" });
        }
        if (!phone) {
            return res.send({ message: "Phone no. is required" });
        }
        if (!address) {
            return res.send({ message: "Address is required" });
        }
        if (!answer) {
            return res.send({ message: "Answer is required" });
        }

        // check existing user
        const existingUser = await userModels.findOne({ email });
        if (existingUser) {
            return res.status(200).send({
                success: true,
                message: " User already exists please login"
            })
        }
        // Register user
        const hashedPassword = await hashPassword(password);

        const user = await new userModels({ name, email, phone, address, password: hashedPassword, answer }).save();

        res.status(200).send({
            success: true,
            message: "Registered Successfully ",
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration Controller",
            error
        })
    }
};


export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email or Password"
            });
        }
        const user = await userModels.findOne({ email: email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "email is not registered"
            });
        }

        const matchPassword = await comparePassword(password, user.password);
        if (!matchPassword) {
            return res.status(200).send({
                success: false,
                message: "Incorrect email/ password"
            })
        }

        // if successful will create JWT token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(200).send({
            success: true,
            message: "Login successfully",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role
            },
            token,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Login",
            error
        })
    }
};


export const testController = (req, res) => {
    try {
        res.send("PROTECTED ROUTE");

    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};


export const forgotPasswordController = async (req, res) => {

    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            return res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            return res.status(400).send({ message: "Security Answer is required" })
        }
        if (!newPassword) {
            return res.status(400).send({ message: "New Password is required" })
        }

        const user = await userModels.findOne({ email, answer })

        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Incorrect Email or Security Answer"
            })
        }

        const hashed = await hashPassword(newPassword);

        await userModels.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password changed successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Forgot Password Controller",
            error
        })
    }
}


export const updateProfileController = async (req, res) => {
    try {

        const { name, email, password, phone, address } = await req.body;


        if (password && password.length < 4) {
            return res.json({ message: "Password is required and 8 char long" });
        }

        const hashedPassword = password ? await hashPassword(password) : undefined;


        // check existing user
        const user = await userModels.findById(req.user._id);

        const updatedUser = await userModels.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true });

        res.status(200).send({
            success: true,
            message: "Updated profile Successfully ",
            updatedUser
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating profile Controller",
            error
        })
    }
};

export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting  orders Controller",
            error
        })
    }
}

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({"createdAt":-1})
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in getting all orders Controller",
            error
        })
    }

}
export const orderStatusController = async (req, res) => {
    try {
        const {orderId} = req.params
        const {status} = req.body
        const orders = await orderModel
            .findByIdAndUpdate(orderId, {status}, {new:true})
        res.json(orders);

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in while updating orders Controller",
            error
        })
    }

}