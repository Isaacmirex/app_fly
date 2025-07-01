"use client"

import { useState } from "react"
import { FlightSearch } from "@/components/flight-search"
import { FlightResults } from "@/components/flight-results"
import { FlightMap } from "@/components/flight-map"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plane } from "lucide-react"
import { HotelSearch } from "@/components/hotel-search"
import { HotelResults } from "@/components/hotel-results"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  const [searchResults, setSearchResults] = useState(null)
  const [searchParams, setSearchParams] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("flights")
  const [hotelResults, setHotelResults] = useState(null)

  const handleSearch = async (params: any) => {
    setIsLoading(true)
    setSearchParams(params)

    try {
      const response = await fetch("/api/flights/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching flights:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleHotelSearch = async (params: any) => {
    setIsLoading(true)
    setSearchParams(params)

    try {
      const response = await fetch("/api/hotels/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      })

      const data = await response.json()
      setHotelResults(data)
    } catch (error) {
      console.error("Error searching hotels:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">SkySearch</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab("flights")}
                className={`font-medium ${activeTab === "flights" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
              >
                Flights
              </button>
              <button
                onClick={() => setActiveTab("hotels")}
                className={`font-medium ${activeTab === "hotels" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
              >
                Hotels
              </button>
              <button
                onClick={() => setActiveTab("packages")}
                className={`font-medium ${activeTab === "packages" ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
              >
                Packages
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="map">Route Map</TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="space-y-4">
            <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
            {searchResults && (
              <FlightResults results={searchResults} searchParams={searchParams} isLoading={isLoading} />
            )}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-4">
            <HotelSearch onSearch={handleHotelSearch} isLoading={isLoading} />
            {hotelResults && <HotelResults results={hotelResults} searchParams={searchParams} isLoading={isLoading} />}
          </TabsContent>

          <TabsContent value="packages" className="space-y-4">
            <Card className="w-full shadow-lg">
              <CardContent className="py-12 text-center">
                <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Package Deals Coming Soon</h3>
                <p className="text-muted-foreground">Flight + Hotel packages will be available soon</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="map">
            <FlightMap
              origin={searchParams?.origin}
              destination={searchParams?.destination}
              flights={searchResults?.data?.itineraries || []}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
