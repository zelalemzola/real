"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UploadButton } from "@/utils/uploadthing"
import Image from "next/image"

export default function EditProperty({ params }) {
  const router = useRouter()
  const [property, setProperty] = useState(null)

  useEffect(() => {
    fetchProperty()
  }, [])

  const fetchProperty = async () => {
    const response = await axios.get(`/api/properties/${params.id}`)
    setProperty(response.data)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setProperty((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.put(`/api/properties/${params.id}`, property)
    router.push("/admin/properties")
  }

  const handleImageDelete = (indexToDelete) => {
    setProperty((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToDelete),
    }))
  }

  if (!property) return <div>Loading...</div>

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Property</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input name="title" placeholder="Title" value={property.title} onChange={handleChange} required />
        <Input name="price" type="number" placeholder="Price" value={property.price} onChange={handleChange} required />
        <Textarea name="description" placeholder="Description" value={property.description} onChange={handleChange} />
        <Select value={property.propertyType} onValueChange={(value) => handleSelectChange("propertyType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apartment">Apartment</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Office">Office</SelectItem>
            <SelectItem value="Land">Land</SelectItem>
            <SelectItem value="Commercial">Commercial</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={property.finishingProgress}
          onValueChange={(value) => handleSelectChange("finishingProgress", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Finishing Progress" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Semi-Finished">Semi-Finished</SelectItem>
            <SelectItem value="Fully Finished">Fully Finished</SelectItem>
            <SelectItem value="Started">Started</SelectItem>
          </SelectContent>
        </Select>
        <Input name="bedrooms" type="number" placeholder="Bedrooms" value={property.bedrooms} onChange={handleChange} />
        <Input
          name="bathrooms"
          type="number"
          placeholder="Bathrooms"
          value={property.bathrooms}
          onChange={handleChange}
        />
        <Input name="location" placeholder="Location" value={property.location} onChange={handleChange} />
        <div>
          <label>
            <input type="checkbox" name="isForSale" checked={property.isForSale} onChange={handleChange} />
            For Sale
          </label>
        </div>
        <div>
          <label>
            <input type="checkbox" name="isForRent" checked={property.isForRent} onChange={handleChange} />
            For Rent
          </label>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setProperty((prev) => ({
                ...prev,
                images: [...prev.images, ...res.map((file) => ({ url: file.url, key: file.key }))],
              }))
            }}
            onUploadError={(error) => {
              alert(`ERROR! ${error.message}`)
            }}
          />
        </div>
        {property.images.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Property Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={`Property image ${index + 1}`}
                    width={200}
                    height={200}
                    className="object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => handleImageDelete(index)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <Button type="submit">Update Property</Button>
      </form>
    </div>
  )
}

