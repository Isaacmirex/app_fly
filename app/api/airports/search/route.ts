import { type NextRequest, NextResponse } from "next/server"

const RAPIDAPI_KEY = "46315e0ba0mshb38ba720a10f4a3p1d1147jsndb97e5c4706b"
const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com"

// --- simple in-memory cache (lives for the life of the lambda) ------------
type Cached = { data: any; created: number }
const cache: Record<string, Cached> = {}
const ONE_DAY = 24 * 60 * 60 * 1000

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  // Return cached value if we have it and it’s still fresh
  const hit = cache[query!]
  if (hit && Date.now() - hit.created < ONE_DAY) {
    return NextResponse.json(hit.data)
  }

  try {
    const response = await fetch(
      `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=es-ES`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
      },
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Transformar los datos para que coincidan con nuestra interfaz
    const transformedData = {
      ...data,
      data:
        data.data?.map((airport: any) => ({
          skyId: airport.skyId,
          entityId: airport.entityId,
          title: airport.presentation?.title || airport.navigation?.localizedName,
          subtitle: airport.presentation?.subtitle,
          suggestionTitle: airport.presentation?.suggestionTitle,
        })) || [],
    }

    // save to cache
    cache[query] = { data: transformedData, created: Date.now() }

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error searching airports:", error)

    if ((error as any).message?.includes("429") && cache[query!]) {
      return NextResponse.json(cache[query!].data)
    }

    return NextResponse.json({ error: "Failed to search airports" }, { status: 500 })
  }
}
