import type { PostData, SingInData, SingUpData } from './index'
import axios from 'axios'
import { S3Service } from './S3Service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

axios.interceptors.request.use(
  (config) => {
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

const url = process.env.REACT_APP_API_URL || 'http://localhost:8080/api'

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (formData: Partial<SingUpData>) => await httpRequestService.signUp(formData),
  });
};

export const useSignIn = () => {
    return useMutation({
      mutationFn: async (formData: SingInData) => await httpRequestService.signIn(formData),
    })
};


export const useCreatePost = (postData: PostData) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => await httpRequestService.createPost(postData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['post'],
      });
    },
  });
};

export const useGetPaginatedPosts = (limit: number, after: string, query: string) => {
  return useQuery({
    queryKey: ['post'],
    queryFn: async () => await httpRequestService.getPaginatedPosts(limit,after,query),
    retry: false
  })
}

export const useGetPosts = (query: string) => {
  const { data, isLoading, error, refetch: fetchPosts } = useQuery({
    queryKey: ['post'],
    queryFn: async () => await httpRequestService.getPosts(query),
    enabled: false
  });
  return { data, isLoading, error, fetchPosts };
};

export const useGetPostById = (id: string) => {
  const { data, isLoading, error, refetch: fetchPostById } = useQuery({
    queryKey: ['post'],
    queryFn: async () => await httpRequestService.getPostById(id),
    enabled: false
  });
  return { data, isLoading, error, fetchPostById };
}

export const useRecommendedUsers = (limit: number,skip: number) => {
  const {data,isLoading,error} = useQuery({
    queryKey: ['user'],
    queryFn: async () => await httpRequestService.getRecommendedUsers(limit,skip)
  })

  return {data,isLoading,error}
}

export const useMe = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await httpRequestService.me()
  });

  return {data,isLoading,error}
}

export const useCreateReaction = () => {
    return useMutation({
      mutationFn: async ({ postId, type }: { postId: string; type: string }) =>
        await httpRequestService.createReaction(postId, type)
    });
}

export const useDeleteReaction = () => {
  return useMutation({
    mutationKey: ['reaction'],
    mutationFn: async ({postId, type}: {postId: string,type: string}) => 
      await httpRequestService.deleteReaction(postId, type)
  });
};

const httpRequestService = {
  signUp: async (data: Partial<SingUpData>) => {
    const res = await axios.post(`${url}/auth/signup`, data)
    if (res.status === 201) {
      localStorage.setItem('token', `Bearer ${res.data.token}`)
      return true
    }
  },
  signIn: async (data: SingInData) => {
    const res = await axios.post(`${url}/auth/login`, data)
    if (res.status === 200) {
      localStorage.setItem('token', `Bearer ${res.data.token}`)
      return true
    }
  },
  createPost: async (data: PostData) => {
    const images = data.images?.map(image => image.name)
    const res = await axios.post(`${url}/post`, {content: data.content,images})
    if (res.status === 201) {
      const { upload } = S3Service
      for (const imageUrl of res.data.images) {
        const index: number = res.data.images.indexOf(imageUrl)
        await upload(data.images![index], imageUrl)
      }
      return res.data
    }
  },
  getPaginatedPosts: async (limit: number, after: string, query: string) => {
    const res = await axios.get(`${url}/post/${query}`, {
      params: {
        limit,
        after
      }
    })
    if (res.status === 200) {
      return res.data
    }
  },
  getPosts: async (query: string) => {
    const res = await axios.get(`${url}/post/${query}`)
    if (res.status === 200) {
      return res.data
    }
  },
  getRecommendedUsers: async (limit: number, skip: number) => {
    const res = await axios.get(`${url}/user`, {
      params: {
        limit,
        skip
      }
    })
    if (res.status === 200) {
      return res.data
    }
  },
  me: async () => {
    const res = await axios.get(`${url}/user/me`)
    if (res.status === 200) {
      return res.data
    }
  },
  getPostById: async (id: string) => {
    const res = await axios.get(`${url}/post/${id}`)
    if (res.status === 200) {
      return res.data
    }
  },
  createReaction: async (postId: string, reaction: string) => {
    const res = await axios.post(`${url}/reaction/${postId}?type=${reaction}`)
    if (res.status === 201) {
      return res.data
    }
  },
  deleteReaction: async (postId: string,type:string) => {
    const res = await axios.delete(`${url}/reaction/${postId}?type=${type}`)
    if (res.status === 200) {
      return res.data
    }
  },
  followUser: async (userId: string) => {
    const res = await axios.post(
      `${url}/follow/${userId}`
    )
    if (res.status === 201) {
      return res.data
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await axios.delete(`${url}/follow/${userId}`)
    if (res.status === 200) {
      return res.data
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source()

      const response = await axios.get(`${url}/user/search`, {
        params: {
          username,
          limit,
          skip
        },
        cancelToken: cancelToken.token
      })

      if (response.status === 200) {
        return response.data
      }
    } catch (error) {
      if (!axios.isCancel(error)) console.log(error)
    }
  },

  getProfile: async (id: string) => {
    const res = await axios.get(`${url}/user/profile/${id}`)
    if (res.status === 200) {
      return res.data
    }
  },
  getPaginatedPostsFromProfile: async (
    limit: number,
    after: string,
    id: string
  ) => {
    const res = await axios.get(`${url}/post/by_user/${id}`, {
      params: {
        limit,
        after
      }
    })

    if (res.status === 200) {
      return res.data
    }
  },
  getPostsFromProfile: async (id: string) => {
    const res = await axios.get(`${url}/post/by_user/${id}`)

    if (res.status === 200) {
      return res.data
    }
  },

  isLogged: async () => {
    const res = await axios.get(`${url}/user/me`)
    return res.status === 200
  },

  getProfileView: async (id: string) => {
    const res = await axios.get(`${url}/user/${id}`)

    if (res.status === 200) {
      return res.data
    }
  },

  deleteProfile: async () => {
    const res = await axios.delete(`${url}/user/me`)

    if (res.status === 204) {
      localStorage.removeItem('token')
    }
  },

  getChats: async () => {
    const res = await axios.get(`${url}/chat`)

    if (res.status === 200) {
      return res.data
    }
  },

  getMutualFollows: async () => {
    const res = await axios.get(`${url}/follow/mutual`)

    if (res.status === 200) {
      return res.data
    }
  },

  createChat: async (id: string) => {
    const res = await axios.post(
      `${url}/chat`,
      {
        users: [id]
      }
    )

    if (res.status === 201) {
      return res.data
    }
  },

  getChat: async (id: string) => {
    const res = await axios.get(`${url}/chat/${id}`)

    if (res.status === 200) {
      return res.data
    }
  },

  deletePost: async (id: string) => {
    await axios.delete(`${url}/post/${id}`)
  },

  getPaginatedCommentsByPostId: async (
    id: string,
    limit: number,
    after: string
  ) => {
    const res = await axios.get(`${url}/post/comment/by_post/${id}`, {
      params: {
        limit,
        after
      }
    })
    if (res.status === 200) {
      return res.data
    }
  },
  getCommentsByPostId: async (id: string) => {
    const res = await axios.get(`${url}/post/comment/by_post/${id}`)
    if (res.status === 200) {
      return res.data
    }
  }
}

const useHttpRequestService = () => httpRequestService

export { useHttpRequestService }
