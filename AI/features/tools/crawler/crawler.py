import httpx
import asyncio
from bs4 import BeautifulSoup
from langchain_core.tools import tool

# def crawl(url: str) -> str:
#     headers = {"User-Agent": "Mozilla/5.0"}
#     try:
#         response = httpx.get(url, headers=headers, timeout=10, follow_redirects=True)
#
#         soup = BeautifulSoup(response.text, "html.parser")
#
#         for tag in soup(["script", "style", "noscript"]):
#             tag.extract()
#
#         text = soup.get_text(separtor="\n")
#
#         return "\n".join(line.strip() for line in text.splitlines() if line.strip())
#
#     except Exception as e:
#         return f"Failed: {e}"
#
#


async def crawl(url: str) -> dict:
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        async with httpx.AsyncClient(
            headers=headers,
            follow_redirects=True,
            timeout=10,
        ) as client:

            print(f"[CRAWLER] Fetching: {url}")

            response = await client.get(url)
            response.raise_for_status()

    except Exception as e:
        print(f"[CRAWLER] Failed: {e}")

        return {
            "success": False,
            "url": url,
            "error": str(e),
        }

    soup = BeautifulSoup(response.text, "html.parser")

    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()

    content = soup.find("article") or soup.find("main") or soup.body or soup

    text = content.get_text(separator=" ", strip=True)

    return {
        "success": True,
        "url": url,
        "title": soup.title.string.strip() if soup.title else "",
        "text": text,
    }


from langchain_core.tools import tool


@tool
async def crawl_page(urls: list[str]) -> list[dict]:
    """
    Crawl urls and return their title and text.
    """
    results = await asyncio.gather(*(crawl(url) for url in urls))

    return [page for page in results if page["success"]]
