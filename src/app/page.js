"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Home() {
  const [properties, setProperties] = useState([])
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchProperties()
  }, []) // Updated dependency array

  const fetchProperties = async () => {
    try {
      const params = new URLSearchParams(filters)
      const response = await axios.get(`/api/properties?${params}`)
      setProperties(response.data.properties)
    } catch (error) {
      console.error("Error fetching properties:", error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Input
          placeholder="Search by location"
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
        />
        <Select onValueChange={(value) => setFilters({ ...filters, propertyType: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Min Price"
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Max Price"
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {properties.map((property) => (
          <Link key={property._id} href={`/properties/${property._id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <img
                  src={property.images[0]?.url || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
              </CardContent>
              <CardFooter className="flex flex-col items-start p-4">
                <h3 className="font-semibold text-lg">{property.title}</h3>
                <p className="text-muted-foreground">{property.location}</p>
                <p className="text-lg font-bold mt-2">${property.price.toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  {property.isForSale && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">For Sale</span>
                  )}
                  {property.isForRent && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">For Rent</span>
                  )}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

