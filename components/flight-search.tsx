"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CalendarIcon, Search, ArrowLeftRight, MapPin, Loader2, Users, Plane } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Airport {
  skyId: string
  entityId: string
  title: string
  subtitle: string
  suggestionTitle: string
}

interface FlightSearchProps {
  onSearch: (params: any) => void
  isLoading: boolean
}

export function FlightSearch({ onSearch, isLoading }: FlightSearchProps) {
  const [tripType, setTripType] = useState("roundtrip")
  const [origin, setOrigin] = useState<Airport | null>(null)
  const [destination, setDestination] = useState<Airport | null>(null)
  const [departureDate, setDepartureDate] = useState<Date>()
  const [returnDate, setReturnDate] = useState<Date>()
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 })
  const [cabinClass, setCabinClass] = useState("economy")

  const [originSearch, setOriginSearch] = useState("")
  const [destinationSearch, setDestinationSearch] = useState("")
  const [originResults, setOriginResults] = useState<Airport[]>([])
  const [destinationResults, setDestinationResults] = useState<Airport[]>([])
  const [originOpen, setOriginOpen] = useState(false)
  const [destinationOpen, setDestinationOpen] = useState(false)

  const searchAirports = async (query: string, type: "origin" | "destination") => {
    if (query.length < 2) return

    try {
      const response = await fetch(`/api/airports/search?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.status && data.data) {
        if (type === "origin") {
          setOriginResults(data.data.slice(0, 5))
        } else {
          setDestinationResults(data.data.slice(0, 5))
        }
      }
    } catch (error) {
      console.error("Error searching airports:", error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (originSearch) {
        searchAirports(originSearch, "origin")
      }
    }, 600)
    return () => clearTimeout(debounce)
  }, [originSearch])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (destinationSearch) {
        searchAirports(destinationSearch, "destination")
      }
    }, 600)
    return () => clearTimeout(debounce)
  }, [destinationSearch])

  const swapLocations = () => {
    const tempOrigin = origin
    const tempDestination = destination
    setOrigin(tempDestination)
    setDestination(tempOrigin)
    setOriginSearch(tempDestination?.title || "")
    setDestinationSearch(tempOrigin?.title || "")
  }

  const handleSearch = () => {
    if (!origin || !destination || !departureDate) {
      alert("Please complete all required fields")
      return
    }

    const searchParams = {
      originSkyId: origin.skyId,
      destinationSkyId: destination.skyId,
      originEntityId: origin.entityId,
      destinationEntityId: destination.entityId,
      date: format(departureDate, "yyyy-MM-dd"),
      returnDate: tripType === "roundtrip" && returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
      cabinClass,
      adults: passengers.adults,
      children: passengers.children,
      infants: passengers.infants,
      tripType,
      origin,
      destination,
    }

    onSearch(searchParams)
  }

  const totalPassengers = passengers.adults + passengers.children + passengers.infants

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plane className="h-5 w-5 text-blue-600" />
          <span>Search Flights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Type */}
        <div className="flex space-x-4">
          <Button
            variant={tripType === "roundtrip" ? "default" : "outline"}
            onClick={() => setTripType("roundtrip")}
            className="flex-1"
          >
            Round trip
          </Button>
          <Button
            variant={tripType === "oneway" ? "default" : "outline"}
            onClick={() => setTripType("oneway")}
            className="flex-1"
          >
            One way
          </Button>
        </div>

        {/* Origin and Destination */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
          <div className="space-y-2">
            <Label htmlFor="origin">Origin</Label>
            <Popover open={originOpen} onOpenChange={setOriginOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={originOpen}
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {origin ? (
                    <div>
                      <div className="font-medium">{origin.title}</div>
                      <div className="text-sm text-muted-foreground">{origin.subtitle}</div>
                    </div>
                  ) : (
                    "Select origin"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search city or airport..."
                    value={originSearch}
                    onValueChange={setOriginSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {originResults.map((airport) => (
                        <CommandItem
                          key={airport.entityId}
                          onSelect={() => {
                            setOrigin(airport)
                            setOriginSearch(airport.title)
                            setOriginOpen(false)
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{airport.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {airport.subtitle} • {airport.skyId}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Popover open={destinationOpen} onOpenChange={setDestinationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={destinationOpen}
                  className="w-full justify-start text-left font-normal bg-transparent"
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  {destination ? (
                    <div>
                      <div className="font-medium">{destination.title}</div>
                      <div className="text-sm text-muted-foreground">{destination.subtitle}</div>
                    </div>
                  ) : (
                    "Select destination"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search city or airport..."
                    value={destinationSearch}
                    onValueChange={setDestinationSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {destinationResults.map((airport) => (
                        <CommandItem
                          key={airport.entityId}
                          onSelect={() => {
                            setDestination(airport)
                            setDestinationSearch(airport.title)
                            setDestinationOpen(false)
                          }}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          <div>
                            <div className="font-medium">{airport.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {airport.subtitle} • {airport.skyId}
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute top-8 left-1/2 transform -translate-x-1/2 z-10 hidden md:flex bg-transparent"
            onClick={swapLocations}
          >
            <ArrowLeftRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Departure date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {departureDate ? format(departureDate, "PPP", { locale: es }) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={departureDate}
                  onSelect={setDepartureDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {tripType === "roundtrip" && (
            <div className="space-y-2">
              <Label>Return date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {returnDate ? format(returnDate, "PPP", { locale: es }) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={returnDate}
                    onSelect={setReturnDate}
                    disabled={(date) => date < (departureDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        {/* Passengers and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Passengers</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  {totalPassengers} {totalPassengers === 1 ? "passenger" : "passengers"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-muted-foreground">12+ years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, adults: Math.max(1, p.adults - 1) }))}
                        disabled={passengers.adults <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{passengers.adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, adults: p.adults + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-muted-foreground">2-11 years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, children: Math.max(0, p.children - 1) }))}
                        disabled={passengers.children <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{passengers.children}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, children: p.children + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Infants</div>
                      <div className="text-sm text-muted-foreground">0-2 years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, infants: Math.max(0, p.infants - 1) }))}
                        disabled={passengers.infants <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{passengers.infants}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers((p) => ({ ...p, infants: p.infants + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Class</Label>
            <Select value={cabinClass} onValueChange={setCabinClass}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="premium_economy">Premium Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching flights...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search flights
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
