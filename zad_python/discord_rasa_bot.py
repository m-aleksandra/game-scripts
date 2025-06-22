
import discord
import requests
import asyncio
import dotenv
import os

dotenv.load_dotenv()
DISCORD_BOT_TOKEN = os.getenv("DISCORD_BOT_TOKEN")

RASA_URL = "http://localhost:5005/webhooks/rest/webhook"

intents = discord.Intents.default()
intents.messages = True
intents.message_content = True

client = discord.Client(intents=intents)

@client.event
async def on_ready():
    print(f"Zalogowano jako {client.user}")

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    user_message = message.content
    sender_id = str(message.author.id)

    response = requests.post(
        RASA_URL,
        json={"sender": sender_id, "message": user_message}
    )

    if response.status_code == 200:
        rasa_messages = response.json()
        if rasa_messages:
            for msg in rasa_messages:
                await message.channel.send(msg.get("text", "🤖 (brak odpowiedzi)"))
        else:
            await message.channel.send("🤖 Nie wiem co odpowiedzieć.")
    else:
        await message.channel.send("❌ Błąd komunikacji z Rasa.")

client.run(DISCORD_BOT_TOKEN)
