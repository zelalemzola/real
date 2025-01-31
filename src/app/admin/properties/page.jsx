"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Pencil, Plus } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    const params = new URLSearchParams({ page, ...filters })
    try {
      const response = await axios.get(`/api/properties?${params}`)
      setProperties(response.data.properties)
      setTotalPages(Math.ceil(response.data.total / response.data.limit))
    } catch (error) {
      console.error("Failed to fetch properties:", error)
      toast({
        title: "Error",
        description: "Failed to fetch properties. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [page, filters])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
    setPage(1)
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await axios.delete(`/api/properties/${id}`)
        fetchProperties()
        toast({
          title: "Success",
          description: "Property deleted successfully",
        })
      } catch (error) {
        console.error("Failed to delete property:", error)
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between items-center">
            Admin Properties
            <Link href="/admin/properties/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input name="title" placeholder="Filter by title" onChange={handleFilterChange} />
            <Select
              name="propertyType"
              onValueChange={(value) => handleFilterChange({ target: { name: "propertyType", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
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
            <Input name="location" placeholder="Filter by location" onChange={handleFilterChange} />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>{property.title}</TableCell>
                  <TableCell>${property.price.toLocaleString()}</TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell>
                    {property.isForSale && <Badge className="mr-1">For Sale</Badge>}
                    {property.isForRent && <Badge variant="secondary">For Rent</Badge>}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      className="mr-2"
                      onClick={() => router.push(`/admin/properties/${property._id}`)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(property._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {properties.length === 0 && !isLoading && (
            <div className="text-center py-4">
              <p className="text-gray-500">No properties found.</p>
            </div>
          )}
          {totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => setPage((prev) => Math.max(prev - 1, 1))} />
                </PaginationItem>
                {[...Array(totalPages).keys()].map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink onClick={() => setPage(pageNumber + 1)} isActive={page === pageNumber + 1}>
                      {pageNumber + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

