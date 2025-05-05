import Axios from "@/lib/ApiConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface findPeopleState {
  isLoading: boolean;
  people: any[] 
  friendRequest: any[]
  PeoplenotiCount : number
}

const initialState: findPeopleState = {
  isLoading: false,
  people: [],
  PeoplenotiCount : 0,
  friendRequest: [],
};

export const getPeople = createAsyncThunk(
  "people/getPeople",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("/user/get-users");
      return data;
    } catch (error: any) {
      console.log("🚀 ~ Getting Error in Getting people List ~ error:", error);
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);


export const getFriendRequest = createAsyncThunk(
  "people/friendRequest",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await Axios.get("/user/get-friend-request");
      return data;
    } catch (error: any) {
      console.log("🚀 ~ Getting Error in Getting people List ~ error:", error);
      if (error.response && error.response.data.error) {
        return rejectWithValue(error.response.data.error);
      }
      return rejectWithValue(error.message);
    }
  }
);

const PeopleSlice = createSlice({
  name: "people",
  initialState,
  reducers: {
    setFriendRequest(state, action) {
      state.friendRequest = [...state.friendRequest || [], action.payload];
      state.people = state.people?.filter(person => person._id !== action.payload.sender._id);
    },
    setPeopleNotification (state) {
      state.PeoplenotiCount = state.PeoplenotiCount + 1
    },
    clearPeopleNotification (state){
      state.PeoplenotiCount = 0
    },
    removePeopleFromList (state, action){
      state.people = state.people.filter((people) => people._id !== action.payload)
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(getPeople.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPeople.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.people = payload.payload;
      })
      .addCase(getPeople.rejected, (state) => {
        state.people = [];
      });

    builder
      .addCase(getFriendRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFriendRequest.fulfilled, (state, { payload }) => {
        state.isLoading = false;
        state.friendRequest = payload.payload;
      })
      .addCase(getFriendRequest.rejected, (state) => {
        state.friendRequest = [];
      });
  },
});

export const {setFriendRequest, setPeopleNotification, clearPeopleNotification, removePeopleFromList} = PeopleSlice.actions
export default PeopleSlice.reducer