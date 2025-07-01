"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { CalendarIcon, Search, MapPin, Loader2, Users, Hotel } from "lucide-react"
import { format } from "date-fns"

interface Location {
  entityId: string
  title: string
  subtitle: string
}

interface HotelSearchProps {
  onSearch: (params: any) => void
  isLoading: boolean
}

export function HotelSearch({ onSearch, isLoading }: HotelSearchProps) {
  const [destination, setDestination] = useState<Location | null>(null)
  const [checkInDate, setCheckInDate] = useState<Date>()
  const [checkOutDate, setCheckOutDate] = useState<Date>()
  const [guests, setGuests] = useState({ adults: 2, children: 0 })
  const [rooms, setRooms] = useState(1)

  const [destinationSearch, setDestinationSearch] = useState("")
  const [destinationResults, setDestinationResults] = useState<Location[]>([])
  const [destinationOpen, setDestinationOpen] = useState(false)

  const searchDestinations = async (query: string) => {
    if (query.length < 2) return

    try {
      const response = await fetch(`/api/hotels/destinations?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.status && data.data) {
        setDestinationResults(data.data.slice(0, 5))
      }
    } catch (error) {
      console.error("Error searching destinations:", error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (destinationSearch) {
        searchDestinations(destinationSearch)
      }
    }, 600)
    return () => clearTimeout(debounce)
  }, [destinationSearch])

  const handleSearch = () => {
    if (!destination || !checkInDate || !checkOutDate) {
      alert("Please complete all required fields")
      return
    }

    const searchParams = {
      entityId: destination.entityId,
      checkIn: format(checkInDate, "yyyy-MM-dd"),
      checkOut: format(checkOutDate, "yyyy-MM-dd"),
      adults: guests.adults,
      children: guests.children,
      rooms,
      destination,
    }

    onSearch(searchParams)
  }

  const totalGuests = guests.adults + guests.children

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Hotel className="h-5 w-5 text-blue-600" />
          <span>Search Hotels</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Destination */}
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
                  placeholder="Search city or location..."
                  value={destinationSearch}
                  onValueChange={setDestinationSearch}
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {destinationResults.map((location) => (
                      <CommandItem
                        key={location.entityId}
                        onSelect={() => {
                          setDestination(location)
                          setDestinationSearch(location.title)
                          setDestinationOpen(false)
                        }}
                      >
                        <MapPin className="mr-2 h-4 w-4" />
                        <div>
                          <div className="font-medium">{location.title}</div>
                          <div className="text-sm text-muted-foreground">{location.subtitle}</div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate ? format(checkInDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? format(checkOutDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => date < (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests and Rooms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Guests</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="mr-2 h-4 w-4" />
                  {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Adults</div>
                      <div className="text-sm text-muted-foreground">18+ years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests((g) => ({ ...g, adults: Math.max(1, g.adults - 1) }))}
                        disabled={guests.adults <= 1}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{guests.adults}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests((g) => ({ ...g, adults: g.adults + 1 }))}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-muted-foreground">0-17 years</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests((g) => ({ ...g, children: Math.max(0, g.children - 1) }))}
                        disabled={guests.children <= 0}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center">{guests.children}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setGuests((g) => ({ ...g, children: g.children + 1 }))}
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
            <Label>Rooms</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRooms(Math.max(1, rooms - 1))}
                disabled={rooms <= 1}
              >
                -
              </Button>
              <span className="w-16 text-center font-medium">
                {rooms} {rooms === 1 ? "room" : "rooms"}
              </span>
              <Button variant="outline" size="sm" onClick={() => setRooms(rooms + 1)}>
                +
              </Button>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <Button onClick={handleSearch} className="w-full h-12 text-lg font-semibold" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Searching hotels...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search hotels
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
