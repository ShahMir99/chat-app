import Axios from "@/lib/ApiConfig";
import { headers } from "next/headers";



export const getConversationById = async (conversationId: string) => {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const {data} = await Axios.get(`/conversation/${conversationId}`,{
        headers : {
            Cookie: cookie,
        }
    });


    return data.payload;
  } catch (error: any) {
    console.log("error in fetching conversation by id", error);
    return null;
  }
};
