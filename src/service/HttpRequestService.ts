import type { PostData, SingInData, SingUpData, User } from './index'
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


export const useCreatePost = () => {
  return useMutation({
    mutationFn: async (postData: PostData) => await httpRequestService.createPost(postData),
  });
};

export const useCommentPost = () => {
  return useMutation({
    mutationFn: async (commentData: PostData) => await httpRequestService.commentPost(commentData),
  });
};

export const useDeletePost = () => {
  return useMutation({
    mutationFn: async ({id}:{id:string}) => await httpRequestService.deletePost(id),
  });
}

export const useGetPaginatedPosts = (limit: number, after: string, query: string) => {
  const { data,isError,isLoading } = useQuery({
    queryKey: ['feed',query,after],
    queryFn: async () => await httpRequestService.getPaginatedPosts(limit, after, query),
    refetchOnWindowFocus: false,
    retry: false
  });
  return {data,isError,isLoading}
}

export const useGetPostById = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['post',id],
    queryFn: async () => await httpRequestService.getPostById(id),
  });
  return { data, isLoading, error };
}

export const useGetRecommendedUsers = (limit: number,skip: number): {
  data: User[] | undefined
} => {
  const {data} = useQuery({
    queryKey: ['suggestion'],
    queryFn: async () => await httpRequestService.getRecommendedUsers(limit,skip),
    refetchOnWindowFocus: false
  })
  return {data}
}

export const useMe = () => {
  const { data,error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => await httpRequestService.me(),
    retry: false,
    refetchOnWindowFocus: false
  });
  return {data,error}
}

export const useCreateReaction = () => {
    return useMutation({
      mutationKey: ['reaction'],
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

export const useFollowUser = () => {
  return useMutation({
    mutationKey: ['follow'],
    mutationFn: async ({userId}:{userId: string}) => await httpRequestService.followUser(userId)
  })
}

export const useUnfollowUser = () => {
  return useMutation({
    mutationKey: ['follow'],
    mutationFn: async ({ userId }: { userId: string }) => await httpRequestService.unfollowUser(userId),
  });
};

export const useSearchUsers = (username: string, limit: number, skip: number) => {
  const { refetch: search } = useQuery({
    queryKey: ['search'],
    queryFn: async () => await httpRequestService.searchUsers(username,limit,skip),
    enabled: false,
  });

  return { search };
};

export const useGetProfile = (id: string) => {
  const { data } = useQuery({
    queryKey: ['user',id],
    queryFn: async () => await httpRequestService.getProfile(id),
  });

  return { data };
}

export const useGetPaginatedPostsFromProfile = (limit: number,after: string,id: string) => {
  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ['user', id],
    queryFn: async () => await httpRequestService.getPaginatedPostsFromProfile(limit,after,id),
  });

  return { data, isLoading, isError, isRefetching };
}

export const useGetPostsFromProfile = (id: string) => {
  const { data, isLoading, isError, isRefetching } = useQuery({
    queryKey: ['feed', id],
    queryFn: async () => await httpRequestService.getPostsFromProfile(id)
  });

  return { data, isLoading, isError,isRefetching };
}

export const useDeleteProfile = () =>{
  const client = useQueryClient()
  return useMutation({
    mutationKey: ['profile'],
    mutationFn: async () => await httpRequestService.deleteProfile(),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ['user','feed'],
      });
    }
  })
}

export const useGetCommentsByPost = (postId: string) => {
  const {data,error,isLoading} = useQuery({
    queryKey: ['feed',postId],
    queryFn: async () => await httpRequestService.getCommentsByPostId(postId)
  })

  return {data,error,isLoading}
}

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
  commentPost: async(data: PostData) => {
    const images = data.images?.map((image) => image.name);
    const res = await axios.post(`${url}/comment/${data.parentId}`,{content: data.content,images})
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
    const res = await axios.get(`${url}/post/feed/${query}`, {
      params: {
        limit,
        after,
      },
    });
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
      `${url}/follower/follow/${userId}`
    )
    if (res.status === 201) {
      return res.data
    }
  },
  unfollowUser: async (userId: string) => {
    const res = await axios.post(`${url}/follower/unfollow/${userId}`)
    if (res.status === 200) {
      return res.data
    }
  },
  searchUsers: async (username: string, limit: number, skip: number) => {
    try {
      const cancelToken = axios.CancelToken.source()

      const response = await axios.get(`${url}/user/by_username/${username}`, {
        params: {
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
    const res = await axios.get(`${url}/user/${id}`)
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

  deleteProfile: async () => {
    const res = await axios.delete(`${url}/user`)

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
    const res = await axios.get(`${url}/comment/${id}`)
    if (res.status === 200) {
      return res.data
    }
  }
}

const useHttpRequestService = () => httpRequestService;

export { useHttpRequestService };