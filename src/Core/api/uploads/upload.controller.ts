import { NextFunction, Request, Response, Router } from 'express';
import { AuthRequest } from '../../../types';
import { ImageModel } from '../../../DAL/models/Image.model';
import path from 'path';
import { unlink } from 'fs/promises';

export const uploadImage = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void>  => {
    try {
        const file = req.file;
        if (!file) return next();

        const port = req.socket.localPort;
        const image = ImageModel.create({
            filename: file.filename,
            url: `${req.protocol}://${req.hostname}${port ? `:${port}` : ''}/uploads/${file.filename}`,
        });

        await ImageModel.save(image);

        const imageUrl = await ImageModel.findOne({
            where:{id: image.id}
        })

        if(!imageUrl) return next(res.status(400).json({ message: 'No file uploaded' }));
        
        req.img = imageUrl
        
        next();
    } catch (error) {
        if (req.file) {
            const filePath = path.join(process.cwd(), 'uploads', req.file.filename);
            await unlink(filePath).catch(() => console.error('Failed to delete uploaded file'));
        }
        return next(res.status(500).json({ message: 'Upload failed', error }));
    }
}

const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id);
        const image = await ImageModel.findOne({ where: { id } });

        if (!image) return next(res.status(404).json({ message: 'Image not found' }));

        const filePath = path.join(process.cwd(), 'uploads', image.filename);
        await unlink(filePath).catch(() => console.error('Failed to delete file from storage'));

        await ImageModel.remove(image);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error });
    }
};


export const UploadController = () => ({
    uploadImage,
    deleteImage
});