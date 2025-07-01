import { type NextRequest, NextResponse } from "next/server"

const RAPIDAPI_KEY = "46315e0ba0mshb38ba720a10f4a3p1d1147jsndb97e5c4706b"
const RAPIDAPI_HOST = "sky-scrapper.p.rapidapi.com"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { entityId, checkIn, checkOut, adults, children = 0, rooms } = body

    // For now, return mock hotel data since the Sky Scrapper API might not have hotel search
    // In a real implementation, you would use the actual hotel search endpoint
    const mockHotels = generateMockHotels(body)

    return NextResponse.json({
      status: true,
      data: {
        hotels: mockHotels,
      },
    })
  } catch (error) {
    console.error("Error searching hotels:", error)

    const body = await request.json().catch(() => ({}))
    return NextResponse.json({
      status: true,
      data: {
        hotels: generateMockHotels(body),
      },
    })
  }
}

function generateMockHotels(searchParams: any) {
  const hotelNames = [
    "Grand Plaza Hotel",
    "Luxury Suites Downtown",
    "Business Center Inn",
    "Boutique Garden Hotel",
    "Executive Tower",
    "Comfort Inn & Suites",
    "Royal Palace Hotel",
    "Modern City Hotel",
    "Seaside Resort",
    "Mountain View Lodge",
  ]

  const locations = [
    "City Center",
    "Downtown District",
    "Business Quarter",
    "Historic District",
    "Waterfront Area",
    "Shopping District",
    "Financial District",
    "Entertainment Zone",
  ]

  const mockHotels = []

  for (let i = 0; i < 8; i++) {
    const basePrice = 80 + Math.random() * 300
    const rating = 3 + Math.random() * 2 // 3-5 stars
    const reviewScore = 7.0 + Math.random() * 2.5 // 7.0-9.5

    mockHotels.push({
      id: `hotel-${i}`,
      name: hotelNames[i % hotelNames.length],
      location: locations[i % locations.length],
      rating: Math.floor(rating),
      reviewScore: reviewScore.toFixed(1),
      reviewCount: Math.floor(Math.random() * 800) + 200,
      price: Math.round(basePrice),
      image: `/placeholder.svg?height=192&width=256&text=${encodeURIComponent(hotelNames[i % hotelNames.length])}`,
      description: `Experience comfort and luxury at ${hotelNames[i % hotelNames.length]}. This well-appointed hotel features modern amenities, excellent service, and a prime location in ${locations[i % locations.length]}.`,
      amenities: ["Free WiFi", "Parking", "Breakfast", "Gym", "Pool", "Restaurant"],
    })
  }

  return mockHotels
}
