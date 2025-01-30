"use client"
import { PhoneCall } from 'lucide-react';
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { BedDouble, Bath, MapPin, Home, DollarSign, Calendar, ArrowLeftCircle } from "lucide-react"
import Link from "next/link"

export default function PropertyDetails({ params }) {
  const [property, setProperty] = useState(null)
  const router = useRouter()

  useEffect(() => {
    fetchProperty()
  }, [])

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${params.id}`)
      setProperty(response.data)
    } catch (error) {
      console.error("Failed to fetch property:", error)
    }
  }

  if (!property) return <div className="flex justify-center items-center h-screen">Loading...</div>

  return (
    <div className="container mx-auto p-4 space-y-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeftCircle className="mr-2 h-4 w-4" /> Back to listings
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Carousel className="w-full max-w-xl">
            <CarouselContent>
              {property.images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="mr-2 h-4 w-4" />
              <span>{property.location}</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <Home className="mr-2 h-5 w-5 text-blue-500" />
                <span>{property.propertyType}</span>
              </div>
              <div className="flex items-center">
                <BedDouble className="mr-2 h-5 w-5 text-blue-500" />
                <span>{property.bedrooms} Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="mr-2 h-5 w-5 text-blue-500" />
                <span>{property.bathrooms} Bathrooms</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                <span>{property.finishingProgress}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 flex items-center">
                <DollarSign className="mr-1 h-8 w-8" />
                {property.price.toLocaleString()}
              </div>
              <div className="mt-2 space-x-2">
                {property.isForSale && <Badge variant="secondary">For Sale</Badge>}
                {property.isForRent && <Badge variant="secondary">For Rent</Badge>}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{property.description}</p>
            </CardContent>
          </Card>
                 <Separator className="my-4" />
         
            <Link className="flex-1 bg-green-500 w-fit mx-auto px-4 py-2 rounded-full flex items-center gap-3 text-white" href='https://t.me/+251912026258'><PhoneCall/>Contact Agent</Link>
           
         
        </div>
      </div>

      <Separator className="my-8" />

      
    </div>
  )
}

