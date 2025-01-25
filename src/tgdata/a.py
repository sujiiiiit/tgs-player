import os
from dotenv import load_dotenv
from telethon import TelegramClient
from telethon.tl.functions.messages import GetStickerSetRequest
from telethon.tl.types import InputStickerSetShortName, DocumentAttributeCustomEmoji
import json

load_dotenv()

# Telegram credentials
api_id = os.getenv('API_ID')
api_hash = os.getenv('API_HASH')
phone_number = os.getenv('PHONE_NUMBER')

# Create the client and connect
client = TelegramClient('session_name', api_id, api_hash)

async def main():
    # Log in to your account
    await client.start(phone_number)
    print("Client Created")

    # Replace with the short name of the emoji pack
    # emoji_pack_short_name = 'MashupEmoji'
    emoji_pack_short_name = 'RestrictedEmoji'

    # Get the sticker set
    sticker_set = await client(GetStickerSetRequest(
        stickerset=InputStickerSetShortName(short_name=emoji_pack_short_name),
        hash=0  # Initially 0 if you don't have the hash
    ))
    

    def bytes_to_str(obj):
        if isinstance(obj, bytes):
            try:
                return obj.decode('utf-8')
            except UnicodeDecodeError:
                return obj.decode('latin1')

    sticker_set_json = json.dumps(sticker_set.to_dict(), indent=4, default=bytes_to_str)
    # print(sticker_set_json)

    # Write the sticker set metadata to a JSON file
    output_dir = f'../../public/tgs/{emoji_pack_short_name}'
    os.makedirs(output_dir, exist_ok=True)
    def convert_ids_to_strings(obj):
            if isinstance(obj, dict):
                 return {k: (str(v) if k == 'id' else convert_ids_to_strings(v)) for k, v in obj.items()}
            elif isinstance(obj, list):
                 return [convert_ids_to_strings(i) for i in obj]
            else:
                 return obj
    json_file_path = os.path.join(output_dir, 'sticker_set.json')
    with open(json_file_path, 'w', encoding='utf-8') as f:
        sticker_set_dict = json.loads(sticker_set_json)
        sticker_set_dict = convert_ids_to_strings(sticker_set_dict)
        sticker_set_json = json.dumps(sticker_set_dict, indent=4, default=bytes_to_str)
        f.write(sticker_set_json)
    print(f"Sticker set metadata saved to {json_file_path}")

    # Helper to create unified filenames
    def emoji_to_unified(emoji: str) -> str:
        return '-'.join(f"{ord(c):X}" for c in emoji)

    # Download each custom emoji
    count = 1
    for document in sticker_set.documents:
        mime_type = document.mime_type
        extension = 'tgs' if mime_type == 'application/x-tgsticker' else 'webp'
        for attribute in document.attributes:
            if isinstance(attribute, DocumentAttributeCustomEmoji):
                filename = f"{document.id}.{extension}"
                file_path = os.path.join(output_dir, filename)
                try:
                    await client.download_media(document, file=file_path)
                    print(f"Downloaded {filename} to {file_path}")
                    count += 1
                except Exception as e:
                    print(f"Failed to download {filename}: {e}")

# Run the main function
with client:
    client.loop.run_until_complete(main())
