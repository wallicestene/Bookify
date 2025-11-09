/* eslint-disable react/prop-types */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function FormStep({ 
  step, 
  formData, 
  setFormData, 
  errors = {}, 
  children 
}) {
  // Generic error display
  const renderError = (field) => {
    if (!errors[field]) return null;
    
    return (
      <Alert variant="destructive" className="mt-2 border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-600">{errors[field]}</AlertDescription>
      </Alert>
    );
  };
  
  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Render different form fields based on step
  switch (step.id) {
    case "name":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Property Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="My Awesome Property"
              className="text-lg h-14 text-center border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
            {renderError('name')}
          </div>
        </div>
      );
      
    case "address":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address" className="text-sm font-medium text-gray-700">Property Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Vacation Lane, Paradise City"
              className="text-lg h-14 text-center border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
            {renderError('address')}
          </div>
        </div>
      );
      
    case "description":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">Property Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your property..."
              className="min-h-[200px] text-base border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              rows={8}
            />
            {renderError('description')}
          </div>
        </div>
      );
      
    case "guests":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium text-gray-700">Number of Guests</Label>
            <Input
              id="guests"
              name="guests"
              type="number"
              min={1}
              value={formData.guests}
              onChange={handleChange}
              placeholder="4"
              className="text-lg h-14 text-center border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
            {renderError('guests')}
          </div>
        </div>
      );
      
    case "price":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">Price Per Night (KES)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min={1}
              value={formData.price}
              onChange={handleChange}
              placeholder="100"
              className="text-lg h-14 text-center border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
            {renderError('price')}
          </div>
        </div>
      );
      
    // For custom components like ImagesUploader, WhereToSleep, etc.
    default:
      return children;
  }
}