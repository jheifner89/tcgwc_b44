import React from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Search } from 'lucide-react'

export default function ProductFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedDistributor,
  setSelectedDistributor,
  selectedAvailability,
  setSelectedAvailability,
  inStockOnly,
  setInStockOnly,
  categories,
  distributors,
  availabilities
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Distributor Filter */}
        <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
          <SelectTrigger>
            <SelectValue placeholder="All Distributors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Distributors</SelectItem>
            {distributors.map(distributor => (
              <SelectItem key={distributor} value={distributor}>
                {distributor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Availability Filter */}
        <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
          <SelectTrigger>
            <SelectValue placeholder="Availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Availability</SelectItem>
            {availabilities.map(availability => (
              <SelectItem key={availability} value={availability}>
                {availability}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* In Stock Filter */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={inStockOnly}
            onCheckedChange={setInStockOnly}
          />
          <Label htmlFor="in-stock" className="text-sm font-medium">
            In Stock Only
          </Label>
        </div>
      </div>
    </div>
  )
}