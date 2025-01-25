import React, { useEffect, useRef } from "react";
import { RLottie } from "./tgsticker";
interface RLottiePlayerProps {
  src: string;
  width: number | string;
  height: number | string;
  options?: {
    maxDeviceRatio?: number;
    cachingModulo?: number;
    unsupportedURL?: string;
  };
  className?: string;
  thumbWidth?: number | string;
  thumbHeight?: number | string;
  thumbPath?: string;
  svgClassName?: string;
}

const RLottiePlayer: React.FC<RLottiePlayerProps> = ({
  src,
  width,
  height,
  options,
  thumbWidth = 128,
  thumbHeight = 128,
  thumbPath = "",
  svgClassName = "",
  className = "",
  ...props
}) => {
  const customEmojiRef = useRef<HTMLDivElement>(null);
  // console.log("RLottiePlayer", src, width, height, options);
  useEffect(() => {
    if (customEmojiRef.current) {
      // console.log("Initializing RLottie with URL:", src);
      try {
        RLottie.init(
          customEmojiRef.current,
          {
            width,
            height,
            ...options,
          },
          src
        );
      } catch (error) {
        console.error("Error initializing RLottie:", error);
      }
    }

    // Cleanup function to destroy the player when the component is unmounted
    return () => {
      if (customEmojiRef.current) {
        try {
          RLottie.destroy(customEmojiRef.current);
        } catch (error) {
          console.error("Error destroying RLottie:", error);
        }
      }
    };
  }, [src, width, height, options]);

  return (
    <>
      <div role="custom-emoji" ref={customEmojiRef} className={className} {...props}>
        <svg
          fill="#000"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width={thumbWidth}
          height={thumbHeight}
          className={svgClassName}
        >
          <path d={thumbPath}></path>
        </svg>
      </div>
    </>
  );
};

export default RLottiePlayer;
