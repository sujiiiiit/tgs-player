import React, { useEffect, useState } from "react";
import RLottiePlayer from "./lib/rlottie/Rlottie";

// Define the type for the sticker_set.json data
interface StickerPack {
  emoticon: string;
  documents: number[];
}

const emoji = "RestrictedEmoji";
const path = `assets/tgs/${emoji}`

interface StickerSet {
  set: {
    id: string;
    access_hash: string;
    title: string;
    short_name: string;
    count: string;
    hash: string;
    archived: boolean;
    official: boolean;
    masks: boolean;
    emojis: boolean;
    text_color: boolean;
    channel_emoji_status: boolean;
    creator: boolean;
    installed_date: null | string;
    thumbs: any[];
    thumb_dc_id: null | number;
    thumb_version: null | number;
    thumb_document_id: null | number;
  };
  packs: StickerPack[];
  keywords: string[];
  documents: {
    id: string;
    access_hash: number;
    file_reference: string;
    date: null | string;
    mime_type: string;
    size: number;
    dc_id: number;
    attributes: any[];
    thumbs: {
      type: string;
      bytes: string; // assuming thumbs have a bytes field as string
      w: number;
      h: number;
      size: number;
    }[];
    video_thumbs: any[];
  }[];
}

const App: React.FC = () => {
  const dim = 34;
  const options = {
    width: dim,
    height: dim,
    // needUpscale: true,
  };

  const [data, setData] = useState<StickerSet | null>(null);
  const limit = 10; // Set the limit for the number of documents to display

  useEffect(() => {
    const fetchStickers = async () => {
      try {
        const response = await fetch(`/${path}/sticker_set.json`);
        const data: StickerSet = await response.json();
        setData(data);
        // console.log(data.documents);
      } catch (error) {
        console.error("Error fetching sticker set:", error);
      }
    };

    fetchStickers();
  }, []);

  function getPathFromBytes(bytes: Uint8Array): string {
    const lookup =
      "AACAAAAHAAALMAAAQASTAVAAAZaacaaaahaaalmaaaqastava.az0123456789-,";

    let path = "M";
    for (let i = 0, length = bytes.length; i < length; ++i) {
      const num = bytes[i];
      if (num >= 128 + 64) {
        path += lookup[num - 128 - 64];
      } else {
        if (num >= 128) {
          path += ",";
        } else if (num >= 64) {
          path += "-";
        }
        path += "" + (num & 63);
      }
    }
    path += "z";
    return path;
  }

  return (
    // <div className="category-items px-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1 p-4 max-w-[26rem] h-[12rem] items-center overflow-y-auto">
    <div className="category-items px-2 grid grid-cols-[repeat(auto-fill,2.625rem)] justify-between relative text-[2.125rem] leading-[2.125rem] gap-1 p-4  items-center ">
      {data &&
        data.documents.slice(0, limit).map((document, i) => {
          const thumbBytes =
            document.thumbs.length > 0 && document.thumbs[0].bytes
              ? new Uint8Array(
                  document.thumbs[0].bytes
                    .split("")
                    .map((char) => char.charCodeAt(0))
                )
              : new Uint8Array();
          return (
            <RLottiePlayer
              key={i}
              data-src={document.id}
              src={`/${path}/${document.id}.tgs`}
              className="w-[2.125rem] h-[2.125rem]"
              thumbWidth={"2.125rem"}
              thumbHeight={"2.125rem"}
              thumbPath={getPathFromBytes(thumbBytes)}
              svgClassName="fill-black/10"
              {...options}
            />
          );
        })}
    </div>
  );
};

export default App;
