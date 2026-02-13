import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Re-exporta helper de otimização (vive em utils para uso client+server)
export { optimizeCloudinaryImage } from '@/utils/cloudinary-optimizer'

export async function uploadImage(file: File) {
  try {
    // Converte o arquivo para base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Faz o upload para o Cloudinary
    const result = await cloudinary.uploader.upload(base64Image, {
      folder: 'blog-images', // Pasta específica para imagens do blog
      resource_type: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error);
    throw new Error('Falha ao fazer upload da imagem');
  }
}
