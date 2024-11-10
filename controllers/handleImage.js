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
}

module.exports = new HandleImage();