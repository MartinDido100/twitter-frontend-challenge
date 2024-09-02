import { createSlice } from '@reduxjs/toolkit';
import { LIMIT } from '../util/Constants';
import { ChatDTO, Post, User } from '../service';

type InitalStateType = {
  feed: Post[];
  query: string;
  length: number;
  currentChat?: ChatDTO;
  user: User;
  lastPost: string;
};

const initialState: InitalStateType = {
  feed: [],
  length: LIMIT,
  query: '',
  user: {
    id: '',
    username: '',
    private: false,
    createdAt: new Date().toString(),
    following: [],
    posts: [],
  },
  lastPost: '',
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateFeed: (state, action) => {
      state.feed = action.payload;
    },
    setLength: (state, action) => {
      state.length = action.payload;
    },
    setLastPost: (state, action) => {
      state.lastPost = action.payload;
    },
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    setChat: (state, action) => {
      state.currentChat = action.payload;
    },
    addMessage: (state, action) => {
      if (state.currentChat) {
        state.currentChat.messages.push(action.payload);
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { updateFeed, setLength, setQuery, setChat, addMessage, setUser, setLastPost } = userSlice.actions;

export default userSlice.reducer;
