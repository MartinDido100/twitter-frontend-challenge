import axios from "axios";

export const S3Service = {
  upload: async (file: File, url: string) => {
    const blob = new Blob([file], { type: file.type });
    const instance = axios.create()
    
    await instance.put(url, blob, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
