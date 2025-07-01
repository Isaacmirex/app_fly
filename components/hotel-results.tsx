"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Wifi, Car, Coffee, Dumbbell, Loader2, Hotel } from "lucide-react"

interface HotelResultsProps {
  results: any
  searchParams: any
  isLoading: boolean
}

export function HotelResults({ results, searchParams, isLoading }: HotelResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Finding the best hotels...</p>
          <p className="text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  if (!results || !results.status) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Hotel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hotels found</h3>
          <p className="text-muted-foreground">Try modifying your search criteria or dates</p>
        </CardContent>
      </Card>
    )
  }

  const hotels = results.data?.hotels || []

  if (hotels.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Hotel className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No hotels available</h3>
          <p className="text-muted-foreground">No hotels found for the selected dates</p>
        </CardContent>
      </Card>
    )
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hotels in {searchParams?.destination?.title}</h2>
        <Badge variant="secondary">
          {hotels.length} {hotels.length === 1 ? "result" : "results"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {hotels.slice(0, 10).map((hotel: any, index: number) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Hotel Image */}
                <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={hotel.image || `/placeholder.svg?height=192&width=256`}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Hotel Details */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">{renderStars(hotel.rating || 4)}</div>
                        <span className="text-sm text-muted-foreground">{hotel.rating || 4} star hotel</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {hotel.location || hotel.address || "City Center"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ${hotel.price || Math.floor(Math.random() * 200) + 100}
                      </div>
                      <div className="text-sm text-muted-foreground">per night</div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-1">
                      <Wifi className="h-4 w-4 text-blue-600" />
                      <span className="text-xs">Free WiFi</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Car className="h-4 w-4 text-green-600" />
                      <span className="text-xs">Parking</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Coffee className="h-4 w-4 text-orange-600" />
                      <span className="text-xs">Breakfast</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Dumbbell className="h-4 w-4 text-purple-600" />
                      <span className="text-xs">Gym</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {hotel.description ||
                      "Experience comfort and luxury at this well-appointed hotel featuring modern amenities, excellent service, and a prime location."}
                  </p>

                  {/* Reviews */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{hotel.reviewScore || (8.0 + Math.random() * 1.5).toFixed(1)}/10</Badge>
                      <span className="text-sm text-muted-foreground">
                        {hotel.reviewCount || Math.floor(Math.random() * 500) + 100} reviews
                      </span>
                    </div>
                    <Button>Select Room</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {hotels.length > 10 && (
        <div className="text-center py-6">
          <Button variant="outline">Show more results</Button>
        </div>
      )}
    </div>
  )
}
