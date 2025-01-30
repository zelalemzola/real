"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Link from "next/link"
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

export default function AdminProperties() {
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    fetchProperties()
  }, [page, filters])

  const fetchProperties = async () => {
    const params = new URLSearchParams({ page, ...filters })
    const response = await axios.get(`/api/properties?${params}`)
    setProperties(response.data.properties)
    setTotalPages(Math.ceil(response.data.total / response.data.limit))
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }))
    setPage(1)
  }

  const handleDelete = async (id) => {
    await axios.delete(`/api/properties/${id}`)
    fetchProperties()
  }

  return (
    <div className="container mx-auto p-4">
    <div className="flex items-center justify-between w-full py-4">
      <h1 className="text-2xl font-bold mb-4">Admin </h1>
      <Link href="/admin/properties/new">
        <Button className="mt-4">Add New Property</Button>
      </Link>
      </div>
      <div className="mb-4 flex space-x-2">
        <Input placeholder="Filter by title" onChange={(e) => handleFilterChange("title", e.target.value)} />
        <Select onValueChange={(value) => handleFilterChange("propertyType", value)}>
          <SelectTrigger className="w-[180px]">
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
        <Input type="number" placeholder="Min Price" onChange={(e) => handleFilterChange("minPrice", e.target.value)} />
        <Input type="number" placeholder="Max Price" onChange={(e) => handleFilterChange("maxPrice", e.target.value)} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property._id}>
              <TableCell>{property.title}</TableCell>
              <TableCell>${property.price}</TableCell>
              <TableCell>{property.propertyType}</TableCell>
              <TableCell>
                <Link href={`/admin/properties/${property._id}`}>
                  <Button variant="outline" className="mr-2">
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" onClick={() => handleDelete(property._id)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination className="mt-4">
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
  )
}

