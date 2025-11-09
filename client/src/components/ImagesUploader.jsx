/* eslint-disable react/prop-types */
import { Upload, X } from "lucide-react";
import useServer from "../hooks/ServerUrl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImagesUploader = ({ imageLink, setImageLink, formData, setFormData }) => {
  const uploadByLink = (e) => {
    e.preventDefault();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    fetch(`${useServer()}api/upload-by-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: imageLink }),
    })
      .then((res) => res.json())
      .then((result) => {
        // Handle new API response format
        const image = result.data || result;
        setFormData((prevData) => {
          return {
            ...prevData,
            images: [...prevData.images, image],
          };
        });
      })
      .catch((err) => console.log(err));
    setImageLink("");
  };
  const uploadImage = (e) => {
    const { files } = e.target;
    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    fetch(`${useServer()}api/upload-images`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        // Handle new API response format
        const images = result.data || result;
        setFormData((prevData) => {
          return {
            ...prevData,
            images: Array.isArray(images)
              ? [...prevData.images, ...images]
              : [...prevData.images, images],
          };
        });
      });
  };

  const removeImage = (image) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        images: prevData.images.filter((img) => img !== image),
      };
    });
  };
  return (
    <div className="space-y-6">
      {/* Upload by Link Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Add image by URL</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="https://example.com/image.jpg"
            name="imageLink"
            value={imageLink}
            onChange={(e) => setImageLink(e.target.value)}
            className="flex-1 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
          />
          <Button
            onClick={uploadByLink}
            variant="outline"
            className="border-gray-300 hover:bg-gray-50 hover:text-gray-900"
          >
            Add Image
          </Button>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {formData.images.length > 0 &&
          formData.images.map((image, index) => (
            <div 
              key={index} 
              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <img
                src={image}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(image)}
                className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="h-4 w-4 text-gray-700" />
              </button>
            </div>
          ))}
        
        {/* Upload Button */}
        <label
          htmlFor="images"
          className="aspect-square flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition-colors"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm font-medium text-gray-600">Upload Images</span>
          <input
            type="file"
            name="images"
            id="images"
            className="hidden"
            multiple
            accept="image/*"
            onChange={uploadImage}
          />
        </label>
      </div>

      {formData.images.length > 0 && (
        <p className="text-sm text-gray-500">
          {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} uploaded
        </p>
      )}
    </div>
  );
};

export default ImagesUploader;
