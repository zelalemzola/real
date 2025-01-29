"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"

export default function PropertyDetails() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)

  useEffect(() => {
    fetchProperty()
  }, []) // Removed unnecessary dependency 'id'

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${id}`)
      setProperty(response.data)
    } catch (error) {
      console.error("Error fetching property:", error)
    }
  }

  if (!property) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-4xl mx-auto">
        <Carousel className="w-full max-w-4xl mx-auto mb-8">
          <CarouselContent>
            {property.images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={`Property ${index + 1}`}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <Card>
          <CardContent className="p-6">
            <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-2xl font-bold">${property.price.toLocaleString()}</p>
                <p className="text-muted-foreground">{property.location}</p>
              </div>
              <div className="flex gap-2 justify-end">
                {property.isForSale && <span className="bg-green-100 text-green-800 px-3 py-1 rounded">For Sale</span>}
                {property.isForRent && <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">For Rent</span>}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="font-semibold">Property Type</p>
                <p>{property.propertyType}</p>
              </div>
              <div>
                <p className="font-semibold">Bedrooms</p>
                <p>{property.bedrooms}</p>
              </div>
              <div>
                <p className="font-semibold">Bathrooms</p>
                <p>{property.bathrooms}</p>
              </div>
              <div>
                <p className="font-semibold">Finishing</p>
                <p>{property.finishingProgress}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground">{property.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

