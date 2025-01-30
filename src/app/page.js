"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Slider } from "@/components/ui/slider"
import { BedDouble, Bath, MapPin, DollarSign } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function Home() {
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    location: "",
    propertyType: "all", // Changed from "" to "all"
    minPrice: 0,
    maxPrice: 1000000000000,
    bedrooms: "any", // Changed from "" to "any"
  })

  const fetchProperties = useCallback(async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      location: filters.location,
      minPrice: filters.minPrice.toString(),
      maxPrice: filters.maxPrice.toString(),
    })

    if (filters.propertyType !== "all") {
      params.append("propertyType", filters.propertyType)
    }
    if (filters.bedrooms !== "any") {
      params.append("bedrooms", filters.bedrooms)
    }

    try {
      const response = await axios.get(`/api/properties?${params}`)
      setProperties(response.data.properties)
      setTotalPages(Math.ceil(response.data.total / response.data.limit))
    } catch (error) {
      console.error("Failed to fetch properties:", error)
    }
  }, [page, filters])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handlePriceChange = (value) => {
    setFilters((prev) => ({ ...prev, minPrice: value[0], maxPrice: value[1] }))
    setPage(1)
  }

  return (
    <div >
      <Navbar/>
      <div className="container mx-auto px-4 space-y-8">
      <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 pt-[20%] md:pt-[5%]">Discover Your Dream Property</h1>

      {/* Filter Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Filter Properties</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Location"
            value={filters.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          />
          
          {/* Property Type Filter */}
          <Select value={filters.propertyType} onValueChange={(value) => handleFilterChange("propertyType", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Property Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Land">Land</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
            </SelectContent>
          </Select>

          {/* Bedrooms Filter */}
          <Select value={filters.bedrooms} onValueChange={(value) => handleFilterChange("bedrooms", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Bedrooms" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="1">1+</SelectItem>
              <SelectItem value="2">2+</SelectItem>
              <SelectItem value="3">3+</SelectItem>
              <SelectItem value="4">4+</SelectItem>
              <SelectItem value="5">5+</SelectItem>
            </SelectContent>
          </Select>

          {/* Price Range Filter */}
          <div>
            <p className="mb-2">
              Price Range: ${filters.minPrice.toLocaleString()} - ${filters.maxPrice.toLocaleString()}
            </p>
            <Slider
              min={0}
              max={1000000}
              step={10000}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
            />
          </div>
        </div>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="p-0">
              <div className="relative h-48">
                <img
                  src={property.images[0]?.url || "/placeholder.jpg"}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 space-x-2">
                  {property.isForSale && <Badge variant="secondary">For Sale</Badge>}
                  {property.isForRent && <Badge variant="secondary">For Rent</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-2 truncate">{property.title}</CardTitle>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="mr-1 h-4 w-4" />
                <span className="text-sm truncate">{property.location}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-blue-600">
                  <DollarSign className="mr-1 h-5 w-5" />
                  <span className="font-bold">{property.price.toLocaleString()}</span>
                </div>
                <div className="flex space-x-2 text-gray-600">
                  <span className="flex items-center">
                    <BedDouble className="mr-1 h-4 w-4" />
                    {property.bedrooms}
                  </span>
                  <span className="flex items-center">
                    <Bath className="mr-1 h-4 w-4" />
                    {property.bathrooms}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4">
              <Link href={`/properties/${property._id}`} className="w-full">
                <Button variant="outline" className="w-full">View Details</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink onClick={() => setPage(i + 1)} isActive={page === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      </div>
    </div>
  )
}
