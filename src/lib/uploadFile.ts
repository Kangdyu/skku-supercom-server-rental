import { axiosClient } from '@/lib/fetcher';

export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('applicationFile', file);

  const {
    data: { url },
  } = await axiosClient.post<{ url: string }>('/upload-file', formData);

  return url;
}
