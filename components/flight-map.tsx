"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Plane } from "lucide-react"

interface FlightMapProps {
  origin: any
  destination: any
  flights: any[]
}

export function FlightMap({ origin, destination, flights }: FlightMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  // Coordenadas de ejemplo para algunas ciudades principales
  const cityCoordinates: { [key: string]: [number, number] } = {
    NYCA: [-74.006, 40.7128], // New York
    LOND: [-0.1276, 51.5074], // London
    PARI: [2.3522, 48.8566], // Paris
    TOKY: [139.6917, 35.6895], // Tokyo
    SYDN: [151.2093, -33.8688], // Sydney
    LOSA: [-118.2437, 34.0522], // Los Angeles
    MIAM: [-80.1918, 25.7617], // Miami
    DUBL: [-6.2603, 53.3498], // Dublin
    AMST: [4.9041, 52.3676], // Amsterdam
    BERL: [13.405, 52.52], // Berlin
    ROME: [12.4964, 41.9028], // Rome
    BARC: [2.1734, 41.3851], // Barcelona
    MADR: [-3.7038, 40.4168], // Madrid
    LISS: [-9.1393, 38.7223], // Lisbon
    MUNI: [11.582, 48.1351], // Munich
    VIEN: [16.3738, 48.2082], // Vienna
    PRAG: [14.4378, 50.0755], // Prague
    BUDA: [19.0402, 47.4979], // Budapest
    WARS: [21.0122, 52.2297], // Warsaw
    STOC: [18.0686, 59.3293], // Stockholm
    COPE: [12.5683, 55.6761], // Copenhagen
    OSLO: [10.7522, 59.9139], // Oslo
    HELS: [24.9384, 60.1699], // Helsinki
    RIGA: [24.1052, 56.9496], // Riga
    TALL: [24.7536, 59.437], // Tallinn
    VILN: [25.2797, 54.6872], // Vilnius
    MOSC: [37.6173, 55.7558], // Moscow
    PETE: [30.3351, 59.9311], // St. Petersburg
    KIEV: [30.5234, 50.4501], // Kiev
    ISTA: [28.9784, 41.0082], // Istanbul
    ANKA: [32.8597, 39.9334], // Ankara
    ATHE: [23.7275, 37.9838], // Athens
    SOFI: [23.3219, 42.6977], // Sofia
    BUCH: [26.1025, 44.4268], // Bucharest
    BELG: [4.3517, 50.8503], // Belgrade
    ZAGR: [15.9819, 45.815], // Zagreb
    LJUB: [14.5058, 46.0569], // Ljubljana
    SARA: [18.4131, 43.8563], // Sarajevo
    SKOP: [21.4314, 41.9973], // Skopje
    TIRA: [19.8187, 41.3275], // Tirana
    PODG: [19.2636, 42.4304], // Podgorica
  }

  const getCoordinates = (skyId: string): [number, number] => {
    return cityCoordinates[skyId] || [0, 0]
  }

  useEffect(() => {
    if (!mapRef.current || !origin || !destination) return

    // Crear un mapa simple con SVG
    const mapContainer = mapRef.current
    mapContainer.innerHTML = ""

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("width", "100%")
    svg.setAttribute("height", "400")
    svg.setAttribute("viewBox", "-180 -90 360 180")
    svg.style.background = "#f0f9ff"

    // Dibujar continentes simplificados
    const continents = document.createElementNS("http://www.w3.org/2000/svg", "rect")
    continents.setAttribute("x", "-180")
    continents.setAttribute("y", "-90")
    continents.setAttribute("width", "360")
    continents.setAttribute("height", "180")
    continents.setAttribute("fill", "#e0f2fe")
    continents.setAttribute("stroke", "#0284c7")
    continents.setAttribute("stroke-width", "0.5")
    svg.appendChild(continents)

    // Obtener coordenadas
    const originCoords = getCoordinates(origin.skyId)
    const destCoords = getCoordinates(destination.skyId)

    if (originCoords[0] !== 0 && destCoords[0] !== 0) {
      // Dibujar línea de vuelo
      const flightPath = document.createElementNS("http://www.w3.org/2000/svg", "line")
      flightPath.setAttribute("x1", originCoords[0].toString())
      flightPath.setAttribute("y1", (-originCoords[1]).toString())
      flightPath.setAttribute("x2", destCoords[0].toString())
      flightPath.setAttribute("y2", (-destCoords[1]).toString())
      flightPath.setAttribute("stroke", "#dc2626")
      flightPath.setAttribute("stroke-width", "2")
      flightPath.setAttribute("stroke-dasharray", "5,5")
      svg.appendChild(flightPath)

      // Marcador de origen
      const originMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      originMarker.setAttribute("cx", originCoords[0].toString())
      originMarker.setAttribute("cy", (-originCoords[1]).toString())
      originMarker.setAttribute("r", "3")
      originMarker.setAttribute("fill", "#16a34a")
      originMarker.setAttribute("stroke", "#ffffff")
      originMarker.setAttribute("stroke-width", "2")
      svg.appendChild(originMarker)

      // Marcador de destino
      const destMarker = document.createElementNS("http://www.w3.org/2000/svg", "circle")
      destMarker.setAttribute("cx", destCoords[0].toString())
      destMarker.setAttribute("cy", (-destCoords[1]).toString())
      destMarker.setAttribute("r", "3")
      destMarker.setAttribute("fill", "#dc2626")
      destMarker.setAttribute("stroke", "#ffffff")
      destMarker.setAttribute("stroke-width", "2")
      svg.appendChild(destMarker)
    }

    mapContainer.appendChild(svg)
  }, [origin, destination])

  if (!origin || !destination) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select origin and destination to view route map</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Route Map</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={mapRef} className="w-full h-96 border rounded-lg overflow-hidden"></div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <div>
                <div className="font-medium">{origin.title}</div>
                <div className="text-sm text-muted-foreground">{origin.subtitle}</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <div className="font-medium">{destination.title}</div>
                <div className="text-sm text-muted-foreground">{destination.subtitle}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {flights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Flight Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Plane className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold">{flights.length}</div>
                <div className="text-sm text-muted-foreground">Flights found</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">${flights[0]?.price?.formatted || "N/A"}</div>
                <div className="text-sm text-muted-foreground">Lowest price</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {flights[0]?.legs?.[0]?.durationInMinutes
                    ? `${Math.floor(flights[0].legs[0].durationInMinutes / 60)}h ${flights[0].legs[0].durationInMinutes % 60}m`
                    : "N/A"}
                </div>
                <div className="text-sm text-muted-foreground">Shortest duration</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
