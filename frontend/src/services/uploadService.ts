import { api } from './api';

export interface UploadResponse {
  imageUrl: string;
}

export const uploadService = {
  async uploadImage(imageFile: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
