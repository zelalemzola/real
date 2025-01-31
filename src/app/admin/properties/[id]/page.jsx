"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadButton } from "@/utils/uploadthing"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function EditProperty({ params }) {
  const router = useRouter()
  const [property, setProperty] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [])

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`/api/properties/${params.id}`)
      setProperty(response.data)
    } catch (error) {
      console.error("Failed to fetch property:", error)
      toast({
        title: "Error",
        description: "Failed to fetch property details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setProperty((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await axios.put(`/api/properties/${params.id}`, property)
      toast({
        title: "Success",
        description: "Property updated successfully",
      })
      router.push("/admin/properties")
    } catch (error) {
      console.error("Failed to update property:", error)
      toast({
        title: "Error",
        description: "Failed to update property. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="text-center py-10">Loading...</div>
  if (!property) return <div className="text-center py-10">Property not found</div>

  return (
    <div className="container mx-auto p-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Property</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" value={property.title} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" value={property.price} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select
                  name="propertyType"
                  value={property.propertyType}
                  onValueChange={(value) => handleChange({ target: { name: "propertyType", value } })}
                >
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="finishingProgress">Finishing Progress</Label>
                <Select
                  name="finishingProgress"
                  value={property.finishingProgress}
                  onValueChange={(value) => handleChange({ target: { name: "finishingProgress", value } })}
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input id="bedrooms" name="bedrooms" type="number" value={property.bedrooms} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={property.bathrooms}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" value={property.location} onChange={handleChange} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={property.description}
                onChange={handleChange}
                rows={4}
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isForSale"
                  name="isForSale"
                  checked={property.isForSale}
                  onCheckedChange={(checked) => handleChange({ target: { name: "isForSale", checked } })}
                />
                <Label htmlFor="isForSale">For Sale</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isForRent"
                  name="isForRent"
                  checked={property.isForRent}
                  onCheckedChange={(checked) => handleChange({ target: { name: "isForRent", checked } })}
                />
                <Label htmlFor="isForRent">For Rent</Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Images</Label>
              <UploadButton
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  setProperty((prev) => ({
                    ...prev,
                    images: [...prev.images, ...res.map((file) => ({ url: file.url, key: file.key }))],
                  }))
                  toast({
                    title: "Success",
                    description: "Image uploaded successfully",
                  })
                }}
                onUploadError={(error) => {
                  toast({
                    title: "Error",
                    description: `ERROR! ${error.message}`,
                    variant: "destructive",
                  })
                }}
              />
              {property.images && property.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {property.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url || "/placeholder.svg"}
                      alt={`Property image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Updating Property..." : "Update Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

