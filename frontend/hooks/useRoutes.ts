"use client"

import { logOutUser } from "@/store/slices/auth/authSlice"
import {usePathname} from "next/navigation"

import {HiChat} from "react-icons/hi"
import {HiArrowLeftOnRectangle, HiUser} from "react-icons/hi2"
import useConversation from "./useConversation"

const useRoutes = () => {
    const Pathname = usePathname()
    const {conversationId} = useConversation()

    const routes = [
        {
            label : "Chat",
            href : "/conversations",
            icon : HiChat,
            active : Pathname === "/conversations" || !!conversationId
        },
        {
            label : "User",
            href : "/user",
            icon : HiUser,
            active : Pathname === "/user"
        },
        {
            label : "LogOut",
            href : "#",
            icon : HiArrowLeftOnRectangle,
            onClick : logOutUser,
        },
    ]

    return routes
}

export default useRoutes