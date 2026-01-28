import api from './api';

export const getPhotosVideos = async () => {
  const { data } = await api.get('/photos-videos');
  return data;
};

export const getPhotoVideoById = async (id: string) => {
  const { data } = await api.get(`/photos-videos/${id}`);
  return data;
};

export const createPhotoVideo = async (formData: FormData) => {
  const { data } = await api.post('/photos-videos', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updatePhotoVideo = async (id: string, formData: FormData) => {
  const { data } = await api.patch(`/photos-videos/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deletePhotoVideo = async (id: string) => {
  const { data } = await api.delete(`/photos-videos/${id}`);
  return data;
};
