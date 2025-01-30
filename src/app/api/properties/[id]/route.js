import { NextResponse } from "next/server"
import dbConnect from "@/lib/dbConnect"
import Property from "@/models/Property"

export async function GET(request, { params }) {
  await dbConnect()
  const { id } = await params
  const property = await Property.findById(id)
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }
  return NextResponse.json(property)
}

export async function PUT(request, { params }) {
  await dbConnect()
  const { id } = await params
  const data = await request.json()
  const property = await Property.findByIdAndUpdate(id, data, { new: true })
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }
  return NextResponse.json(property)
}

export async function DELETE(request, { params }) {
  await dbConnect()
  const { id } = await params
  const property = await Property.findByIdAndDelete(id)
  if (!property) {
    return NextResponse.json({ error: "Property not found" }, { status: 404 })
  }
  return NextResponse.json({ message: "Property deleted successfully" })
}

