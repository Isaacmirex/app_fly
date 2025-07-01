"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plane, Wifi, Utensils, Tv, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface FlightResultsProps {
  results: any
  searchParams: any
  isLoading: boolean
}

export function FlightResults({ results, searchParams, isLoading }: FlightResultsProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Finding the best flights...</p>
          <p className="text-muted-foreground">This may take a few seconds</p>
        </div>
      </div>
    )
  }

  if (!results || !results.status) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No flights found</h3>
          <p className="text-muted-foreground">Try modifying your search criteria or dates</p>
        </CardContent>
      </Card>
    )
  }

  const itineraries = results.data?.itineraries || []

  if (itineraries.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No flights available</h3>
          <p className="text-muted-foreground">No flights found for the selected dates</p>
        </CardContent>
      </Card>
    )
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "HH:mm")
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd MMM", { locale: es })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          Flights from {searchParams?.origin?.title} to {searchParams?.destination?.title}
        </h2>
        <Badge variant="secondary">
          {itineraries.length} {itineraries.length === 1 ? "result" : "results"}
        </Badge>
      </div>

      <div className="grid gap-4">
        {itineraries.slice(0, 10).map((itinerary: any, index: number) => {
          const price = itinerary.price
          const legs = itinerary.legs || []

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                {legs.map((leg: any, legIndex: number) => (
                  <div key={legIndex} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{leg.carriers?.marketing?.[0]?.name || "Airline"}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {leg.segments?.length || 0} {leg.segments?.length === 1 ? "stop" : "stops"}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">${price?.formatted || "N/A"}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatTime(leg.departure)}</div>
                            <div className="text-sm text-muted-foreground">{leg.origin?.displayCode}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(leg.departure)}</div>
                          </div>

                          <div className="flex-1 flex items-center justify-center">
                            <div className="flex items-center space-x-2">
                              <div className="h-px bg-gray-300 flex-1"></div>
                              <div className="flex flex-col items-center">
                                <Plane className="h-4 w-4 text-blue-600 mb-1" />
                                <div className="text-xs text-muted-foreground">
                                  {formatDuration(leg.durationInMinutes)}
                                </div>
                              </div>
                              <div className="h-px bg-gray-300 flex-1"></div>
                            </div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold">{formatTime(leg.arrival)}</div>
                            <div className="text-sm text-muted-foreground">{leg.destination?.displayCode}</div>
                            <div className="text-xs text-muted-foreground">{formatDate(leg.arrival)}</div>
                          </div>
                        </div>

                        {leg.segments && leg.segments.length > 1 && (
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium mb-2">Stops:</div>
                            <div className="space-y-1">
                              {leg.segments.slice(0, -1).map((segment: any, segIndex: number) => (
                                <div key={segIndex} className="text-sm text-muted-foreground">
                                  {segment.destination?.displayCode} - {formatDuration(segment.durationInMinutes)} stop
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Wifi className="h-4 w-4 text-blue-600" />
                          <span className="text-xs">WiFi</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Utensils className="h-4 w-4 text-green-600" />
                          <span className="text-xs">Meals</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tv className="h-4 w-4 text-purple-600" />
                          <span className="text-xs">Entertainment</span>
                        </div>
                      </div>

                      <Button className="ml-4">Select flight</Button>
                    </div>

                    {legIndex < legs.length - 1 && <Separator className="my-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {itineraries.length > 10 && (
        <div className="text-center py-6">
          <Button variant="outline">Show more results</Button>
        </div>
      )}
    </div>
  )
}
