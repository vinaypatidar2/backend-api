import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";

export const createCategoryController = async(req, res) =>{

    try {
        const {name} = req.body;
        if (!name) {
            return res.status(401).send({message: 'Category Name is required'})
        }

        const existingCategory = await categoryModel.findOne({name})

        if (existingCategory){
            return res.status(200).send({
                success: true,
                message: "Category Already exists",
                
            })
        }
        const category = await new categoryModel({name, slug: slugify(name)}).save();
        res.status(200).send({
            success: true,
            message: "New Category Created",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message : " error in category controller",
            error
        })
    }

}

export const updateCategoryController = async(req, res) =>{

    try {
        const {name} = req.body;
        const {id} = req.params;
        const category = await categoryModel.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new : true})

        res.status(200).send({
            success:true,
            message: "Category updated successfully",
            category
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message: "Error while updating category",
            error
        }
        )
    }

}

export const getCategoryController = async(req, res) =>{

    try {
        const category = await categoryModel.find({});
        res.status(200).send({
            success:true,
            message:"Successfully fetched all categories",
            category,
        })
        
    } catch (error) {
        console.log(error);
        res.send(500).send({
            success:false,
            message:"error in getting all categories",
            error
        })
    }
}
export const singleCategoryController = async(req, res) =>{

    try {

        const category = await categoryModel.findOne({slug:req.params.slug});
        if (category){
            res.status(200).send({
                success:true,
                message:"Successfully fetched all categories",
                category,
            })
        } else{
            res.status(200).send({
                success:true,
                message:"Category Not Found",
                category,
            })
        }
        
        
    } catch (error) {
        console.log(error);
        res.send(500).send({
            success:false,
            message:"error in getting single category",
            error
        })
    }
}
export const deleteCategoryController = async(req, res) =>{

    try {
        const {id} = req.params;
        await categoryModel.findByIdAndDelete({_id:id})
        res.status(200).send({
            success:true,
            message:"Category Deleted successfully",
        }) 
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"error in deleting category",
            error
        })
    }
}