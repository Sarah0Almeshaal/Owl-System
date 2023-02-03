import asyncio
import websockets


async def handler(websocket):
    async for message in websocket:
        print(message)


async def main():
    async with websockets.serve(handler, "", 8001):
        await asyncio.Future()  # run forever
        print("\n------->>>>Server Started!\n")
if __name__ == "__main__":
    asyncio.run(main())