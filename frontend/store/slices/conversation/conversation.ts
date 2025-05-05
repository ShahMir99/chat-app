import Axios from "@/lib/ApiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type User = {
  _id: string;
  name: string;
  profilePic: string;
  lastSeen?: Date; // optional
};

type Participant = {
  _id: string;
  userId: User;
};

type Conversation = {
  _id: string;
  participants: Participant[];
  isGroupchat: boolean;
  groupName: string | null;
  groupAdmin: string | null;
  lastMessage: any;
  createdAt: string;
  updatedAt: string;
};

interface conversationSlice {
  isLoading: boolean;
  conversations: any[];
  selectedConversation: Conversation | null;
  onlineUser: any[];
  ConversationNotiCount: number;
}

const initialState: conversationSlice = {
  isLoading: false,
  conversations: [],
  selectedConversation: null,
  onlineUser: [],
  ConversationNotiCount: 0,
};

export const getConversations = createAsyncThunk(
  "conversation/getConversation",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("/conversation/get-all");
      return data;
    } catch (error: any) {
      console.log(
        "🚀 ~ Getting Error in Getting Conversations ~ error:",
        error
      );
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

// export const getConversationById = createAsyncThunk(
//   "conversation/getConversationById",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const { data } = await Axios.get(`/conversation/${id}`);
//       return data;
//     } catch (error: any) {
//       console.log(
//         "🚀 ~ Getting Error in Getting Conversations by Id ~ error:",
//         error
//       );
//       if (error.response && error.response.data.error) {
//         return rejectWithValue(error.response.data.error);
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );

// export const getMessagesByConvId = createAsyncThunk(
//   "conversation/getMessagesByConvId",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const { data } = await Axios.get(`/message/get-messages/${id}`);
//       return data;
//     } catch (error: any) {
//       console.log(
//         "🚀 ~ Getting Error in Getting Conversations by Id ~ error:",
//         error
//       );
//       if (error.response && error.response.data.error) {
//         return rejectWithValue(error.response.data.error);
//       }
//       return rejectWithValue(error.message);
//     }
//   }
// );

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setOnlineUser(state, action) {
      state.onlineUser = action.payload;
    },

    updateLastSeen(state, action) {
      const {OtherUserData } = action.payload;

      if (!state.selectedConversation) return;
      state.selectedConversation.participants =
        state.selectedConversation.participants.map((user) => {
          if (user.userId._id === OtherUserData._id) {
            return {
              ...user,
              userId: {
                ...user.userId,
                ...OtherUserData,
              },
            };
          }
          return user;
        });
    },
    
    updateConversation(state, {payload}) {
      state.conversations = state.conversations.map((conv) => conv._id === payload._id ? payload : conv);
    },

    setConversation(state, action) {
      state.conversations = [...(state.conversations || []), action.payload];
    },
     
    setConversationNotification(state) {
      state.ConversationNotiCount = state.ConversationNotiCount + 1;
    },
    clearConversationNotification(state) {
      state.ConversationNotiCount = 0;
    },
  },

  extraReducers(builder) {
    builder
      .addCase(getConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getConversations.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.conversations = payload.payload;
      })
      .addCase(getConversations.rejected, (state) => {
        state.conversations = [];
      });
  },
});

export const {
  setOnlineUser,
  updateLastSeen,
  setConversation,
  updateConversation,
  setConversationNotification,
  clearConversationNotification,
} = conversationSlice.actions;
export default conversationSlice.reducer;
