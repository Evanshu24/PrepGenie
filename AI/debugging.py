import asyncio
import httpx


async def main():
    url = "https://www.langgraph.ai/releasenotes.html"

    async with httpx.AsyncClient() as client:
        r = await client.get(url)
        print(r.status_code)


asyncio.run(main())
