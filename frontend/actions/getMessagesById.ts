import Axios from "@/lib/ApiConfig";
import { headers } from "next/headers";



export const getMessagesById = async (conversationId: string) => {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie") || "";

    const {data} = await Axios.get(`/message/get-messages/${conversationId}`,{
        headers : {
            Cookie: cookie,
        }
    });
    return data.payload;
  } catch (error: any) {
    console.log("error in fetching messages by id", error);
    return null;
  }
};
