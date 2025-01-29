"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminProperties() {
  const router = useRouter()
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchProperties()
  }, [page, filters]) //Fixed unnecessary dependency

  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      setError("")
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters,
      })
      const response = await axios.get(`/api/properties?${params}`)
      setProperties(response.data.properties)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error("Error fetching properties:", error)
      setError("Failed to fetch properties")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = async (propertyId) => {
    try {
      const response = await axios.get(`/api/properties/${propertyId}`)
      if (response.data) {
        router.push(`/admin/properties/${propertyId}`)
      }
    } catch (error) {
      console.error("Error accessing property:", error)
      setError("Unable to edit property. Please try again.")
    }
  }

  const handleDelete = async (propertyId) => {
    if (!window.confirm("Are you sure you want to delete this property?")) {
      return
    }

    try {
      setIsDeleting(true)
      await axios.delete(`/api/properties/${propertyId}`)
      await fetchProperties() // Refresh the list
    } catch (error) {
      console.error("Error deleting property:", error)
      setError("Failed to delete property")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Properties Management</h1>
        <Button onClick={() => router.push("/admin/properties/new")}>Add New Property</Button>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search by location"
          onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
        />
        <Select onValueChange={(value) => setFilters((prev) => ({ ...prev, propertyType: value }))}>
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
          placeholder="Max Price"
          onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
        />
      </div>

      {properties.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No properties found</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell className="font-medium">{property.title}</TableCell>
                  <TableCell>{property.propertyType}</TableCell>
                  <TableCell>${property.price.toLocaleString()}</TableCell>
                  <TableCell>{property.location}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => handleEdit(property._id)} className="w-[80px]">
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(property._id)}
                        disabled={isDeleting}
                        className="w-[80px]"
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i + 1}
              variant={page === i + 1 ? "default" : "outline"}
              onClick={() => setPage(i + 1)}
              className="w-[40px]"
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}

