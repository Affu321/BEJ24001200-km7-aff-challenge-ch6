const imagekit = require('../libs/imagekit');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class HandleImage {
    async uploadImage(req, res) {
        const { title, description } = req.body;
        try {
            if (!req.files || !req.files[0]) {
                return res.status(400).json({ error: "No file uploaded" });
            }
            const uploadResponse = await imagekit.upload({
                file: req.files[0].buffer.toString('base64'),
                fileName: req.files[0].originalname,
            });

            const image = await prisma.iamge.create({
                data: {
                    title,
                    description,
                    imageUrl: uploadResponse.url,
                    fileId: uploadResponse.fileId
                },
            });

            res.status(201).json(image);
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    }
    
    async getImage(req, res) {  
        try {
            let iamge = await prisma.iamge.findMany({  
                orderBy: {
                    id: 'asc'
                }
            });
            return res.json(iamge);
        } catch (error) {
            console.error("Error retrieving images:", error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateImage(req, res) {
        const { id } = req.params;
        const { title, description } = req.body;
        try {
            const existingImage = await prisma.iamge.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!existingImage) {
                return res.status(404).json({ error: 'Image not found' });
            }
            let updatedData = {
                title: title || existingImage.title,
                description: description || existingImage.description,
            };
            if (req.file) {
                console.log("File received:", req.file.originalname);
                try {
                    await imagekit.deleteFile(existingImage.fileId);
                } catch (deleteError) {
                    console.error("Error deleting old image from ImageKit:", deleteError);
                    return res.status(500).json({ error: "Failed to delete old image from ImageKit" });
                }
                try {
                    const uploadResponse = await imagekit.upload({
                        file: req.file.buffer.toString('base64'),
                        fileName: req.file.originalname,
                    });
                    updatedData.imageUrl = uploadResponse.url;
                    updatedData.fileId = uploadResponse.fileId;
                } catch (uploadError) {
                    console.error("Error uploading new image to ImageKit:", uploadError);
                    return res.status(500).json({ error: "Failed to upload new image to ImageKit" });
                }
            }

            const updatedImage = await prisma.iamge.update({
                where: { id: parseInt(id) },
                data: updatedData
            });
            res.json(updatedImage);
        } catch (error) {
            console.error("Error updating image:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    }

    async deleteImage(req, res) {
        const { id } = req.params;
    
        try {
            const image = await prisma.iamge.findUnique({
                where: { id: parseInt(id) }
            });
    
            if (!image) {
                return res.status(404).json({ error: "Image not found" });
            }
            try {
                await imagekit.deleteFile(image.fileId);
            } catch (deleteError) {
                console.error("Error deleting image from ImageKit:", deleteError);
                return res.status(500).json({ error: "Failed to delete image from ImageKit" });
            }
            await prisma.iamge.delete({
                where: { id: parseInt(id) }
            });
            return res.json({ message: 'Image deleted successfully' });
        } catch (error) {
            console.error("Error deleting image:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    
}
module.exports = new HandleImage();