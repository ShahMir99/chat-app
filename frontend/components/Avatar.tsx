import Image from "next/image";
import React from "react";

interface IAvatar {
  className ? : string;
  url: string;
  isActive? : boolean
}

const Avatar: React.FC<IAvatar> = ({ url,isActive, className }) => {
  return (
    <div className="relative flex items-center justify-center">
      <div className={`w-10 h-10 relative inline-block rounded-full overflow-hidden ${className}`}>
        <Image src={url || "/images/placeholder.jpg"} alt="profile" fill />
      </div>
      {isActive && (
        <span
          className="
      absolute
      block
      rounded-full
      bg-green-500
      ring-2
      ring-white
      top-0
      right-0
      h-2
      w-2
      md:h-3
      md:w-3

      "
        />
      )}
    </div>
  );
};

export default Avatar;
