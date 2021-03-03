//controller for handling the products

// with cloudinary you have to delete the images
// or update the images or create the images when doing the subsequent actions

import Product from "../models/products.js";
import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import APIFeatures from "../utils/apiFeatures.js";
import cloudinary from 'cloudinary';


//product api should be /api/v1/admin/product/new => admin

export const newProduct = catchAsyncErrors(async (req, res, next) => {
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    let imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }
    req.body.images = imagesLinks;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

//get all products in the database(user)=/api/v1/products
export const getProducts = catchAsyncErrors(async (req, res, next) => {
    // return next(new ErrorHandler('My error'));
    const resPerPage = 12;
    const productsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find().sort({$natural: -1}), req.query)
        .search()
        .filter();

    let products = await apiFeatures.query;
    let filteredProductsCount = products.length;

    apiFeatures.pagination(resPerPage);
    products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        productsCount,
        filteredProductsCount,
        resPerPage,
        products,
    });
});


//get all products in the database(admin)=/api/v1/admin/products
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

//get single product details api=>/api/v1/product/:id

export const getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        product,
    });
});

//update product api=> /api/v1/product/:id=> admin

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images);
    } else {
        images = req.body.images;
    }
    if (images!==undefined){
        //delete product images on cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        let imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: 'products'
            });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imagesLinks;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });
    res.status(200).json({
        success: true,
        product,
    });
});

//delete a product from database => /api/v1/admin/product/:id

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    //delete product images on cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }
    await product.remove();
    res.status(200).json({
        success: true,
        message: "Deleted successfully",
    });
});

///create new review for a product=>/api/v1/review

export const createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        createdAt:new Date(Date.now()),
        comment,
    };
    const product = await Product.findById(productId);
    const isReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length;
    }
    product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
    });
});

//Get products Reviews =>/api/v1/reviews
export const getProductsReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.id);
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});

//Delete a  products Review =>/api/v1/reviews
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId);
    const reviews = product.reviews.filter(
        (review) => review._id.toString() !== req.query.id.toString()
    );
    const numOfReviews = reviews.length;
    const ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        reviews.length;
    await Product.findByIdAndUpdate(
        req.query.productId,
        {
            reviews,
            ratings,
            numOfReviews,
        },
        {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        }
    );
    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
});
