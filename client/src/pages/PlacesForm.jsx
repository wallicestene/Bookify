import { useState, useEffect } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import { useUserContext } from "../hooks/Usercontext";
import useServer from "../hooks/ServerUrl";
import { StepIndicator } from "../components/StepIndicator";
import { FormStep } from "../components/FormStep";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Import your existing components
import ImagesUploader from "../components/ImagesUploader";
import WhereToSleep from "../components/MenuItems";
import Tags from "../components/Tags";
import Amenities from "../components/Amenities";

const steps = [
  {
    id: "name",
    title: "Name",
    description: "Add a title or name to your place",
    subtitle: "Title for your place. Should be short and precise",
  },
  {
    id: "address",
    title: "Address",
    description: "Add the Address to your place",
    subtitle: "Address to your property",
  },
  {
    id: "images",
    title: "Images",
    description: "Add Images of your place",
    subtitle: "The more the images the better",
  },
  {
    id: "description",
    title: "Description",
    description: "Add a Description for your place",
    subtitle: "Use a description that suits your place best",
  },
  {
    id: "sleeping",
    title: "Sleeping",
    description: "Add a place to sleep",
    subtitle: "The place to sleep i.e bedrooms and the sleeping position",
  },
  {
    id: "guests",
    title: "Guests",
    description: "Number of Guests",
    subtitle: "The number of guests for this place",
  },
  {
    id: "price",
    title: "Price",
    description: "Add a Price for your place",
    subtitle: "How much do you charge for this place in KES?",
  },
  {
    id: "amenities",
    title: "Amenities",
    description: "Amenities",
    subtitle: "What amenities does your place offer?",
  },
  {
    id: "tags",
    title: "Tags",
    description: "Tags",
    subtitle: "What is your property best known for?",
  },
];

const PlacesForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [redirect, setRedirect] = useState(null);
  const [formData, setFormData] = useState({
    owner: "",
    name: "",
    address: "",
    description: "",
    images: [],
    whereToSleep: [],
    guests: 1,
    price: 10,
    amenities: [],
    tags: [],
  });

  // State for custom components
  const [imageLink, setImageLink] = useState("");
  const [bedroom, setBedroom] = useState("");
  const [sleepingPosition, setSleepingPosition] = useState({
    kingBed: 0,
    queenBed: 0,
    sofa: 0,
    singleBed: 1,
  });

  const { id } = useParams();
  const [{ user }] = useUserContext();
  const navigate = useNavigate();
  const serverUrl = useServer();

  // Validate current step
  const validateStep = () => {
    const newErrors = {};
    const step = steps[currentStep];

    switch (step.id) {
      case "name":
        if (!formData.name) {
          newErrors.name = "Property name is required";
        } else if (formData.name.length < 3) {
          newErrors.name = "Property name must be at least 3 characters";
        }
        break;

      case "address":
        if (!formData.address) {
          newErrors.address = "Address is required";
        } else if (formData.address.length < 5) {
          newErrors.address = "Please enter a complete address";
        }
        break;

      case "images":
        if (formData.images.length === 0) {
          newErrors.images = "At least one image is required";
        }
        break;

      case "description":
        if (!formData.description) {
          newErrors.description = "Description is required";
        } else if (formData.description.length < 20) {
          newErrors.description =
            "Description should be at least 20 characters";
        }
        break;

      case "guests":
        if (!formData.guests || formData.guests < 1) {
          newErrors.guests = "Number of guests must be at least 1";
        }
        break;

      case "price":
        if (!formData.price || formData.price < 10) {
          newErrors.price = "Price must be at least KES 1000";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // next step
  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  //  previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Save property
  const saveProperty = async (e) => {
    e.preventDefault();

    if (!validateStep()) {
      return;
    }

    try {
      const endpoint = id
        ? `${serverUrl}api/property/${id}`
        : `${serverUrl}api/property`;
      const method = id ? "PUT" : "POST";

      const payload = {
        ...formData,
        owner: formData.owner || user?.userId, // Ensure owner is always included
      };

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Show detailed validation errors
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.join(', ');
          throw new Error(errorMessages);
        }
        
        throw new Error(errorData.message || "Failed to save property");
      }

      toast.success(
        id ? "Property updated successfully" : "Property created successfully"
      );
      setRedirect("/account/myListings");
    } catch (error) {
      toast.error("Error saving property: " + error.message);
    }
  };

  // Fetch property data for editing
  useEffect(() => {
    const getProperty = async () => {
      try {
        const response = await fetch(`${serverUrl}api/property/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const result = await response.json();
        // Handle new API response format
        const data = result.data || result;

        setFormData({
          owner: data.owner || user?.userId, // Include owner for editing
          name: data.name || "",
          address: data.address || "",
          description: data.description || "",
          images: data.images || [],
          whereToSleep: data.whereToSleep || [],
          guests: data.guests || 1,
          price: data.price || 10,
          amenities: data.amenities || [],
          tags: data.tags || [],
        });

        // Reset bedroom and sleepingPosition for adding new ones
        setBedroom("");
        setSleepingPosition({
          kingBed: 0,
          queenBed: 0,
          sofa: 0,
          singleBed: 1,
        });
      } catch (error) {
        toast.error("Error loading property: " + error.message);
      }
    };

    if (id) {
      getProperty();
    }
  }, [id, serverUrl, user?.userId]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-4 border-b border-gray-100">
            <CardTitle className="text-xl font-semibold text-gray-900">
              {id ? "Edit Property" : "List Your Property"}
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              {steps[currentStep].description}
            </CardDescription>
          </CardHeader>

          <div className="px-6 py-6 bg-gray-50 border-b border-gray-100">
            <StepIndicator steps={steps} currentStep={currentStep} />
          </div>

          <CardContent className="pt-6">
            <div className="mb-6">
              <h3 className="text-base font-semibold text-gray-900">
                {steps[currentStep].description}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {steps[currentStep].subtitle}
              </p>
            </div>

            <div className="py-4">
            {steps[currentStep].id === "images" && (
              <FormStep
                step={steps[currentStep]}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              >
                <ImagesUploader
                  imageLink={imageLink}
                  setImageLink={setImageLink}
                  formData={formData}
                  setFormData={setFormData}
                />
                {errors.images && (
                  <div className="text-sm text-red-600 mt-2">{errors.images}</div>
                )}
              </FormStep>
            )}

            {steps[currentStep].id === "sleeping" && (
              <FormStep
                step={steps[currentStep]}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              >
                <WhereToSleep
                  bedroom={bedroom}
                  setBedroom={setBedroom}
                  sleepingPosition={sleepingPosition}
                  setSleepingPosition={setSleepingPosition}
                  formData={formData}
                  setFormData={setFormData}
                />
              </FormStep>
            )}

            {steps[currentStep].id === "amenities" && (
              <FormStep
                step={steps[currentStep]}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              >
                <Amenities
                  selectedAmenities={formData.amenities}
                  setSelectedAmenities={(amenities) =>
                    setFormData({ ...formData, amenities })
                  }
                  mode="listing"
                />
              </FormStep>
            )}

            {steps[currentStep].id === "tags" && (
              <FormStep
                step={steps[currentStep]}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              >
                <Tags formData={formData} setFormData={setFormData} />
              </FormStep>
            )}

            {!["images", "sleeping", "amenities", "tags"].includes(
              steps[currentStep].id
            ) && (
              <FormStep
                step={steps[currentStep]}
                formData={formData}
                setFormData={setFormData}
                errors={errors}
              />
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t border-gray-100 pt-6 bg-gray-50">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={saveProperty} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Property
            </Button>
          ) : (
            <Button 
              onClick={nextStep} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
      </div>
    </div>
  );
};

export default PlacesForm;
