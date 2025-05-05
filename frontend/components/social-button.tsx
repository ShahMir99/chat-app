"use client"

import { Button } from "./ui/button";
import { IconType } from "react-icons";

interface SocialButtonProps {
    Icon : IconType
    onClick : () => void;
    disabled : boolean
}

const SocialButton : React.FC<SocialButtonProps> = ({
    Icon,
    onClick,
    disabled
}) => {
  return (
    <Button
    variant="outline"
    type="button"
    className=" shadow-md p-0"
    onClick={onClick}
    disabled={disabled}
    >
        <Icon className="w-5 h-5 shrink-0"/>
    </Button>
  )
}

export default SocialButton