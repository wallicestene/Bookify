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
      };

      if (!id) {
        payload.owner = user?.userId;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save property");
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

        const data = await response.json();

        setFormData({
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
        setBedroom(data.bedroom || "");
        if (data.whereToSleep && data.whereToSleep.length > 0) {
          setSleepingPosition(
            data.sleepingPosition || {
              kingBed: 0,
              queenBed: 0,
              sofa: 0,
              singleBed: 1,
            }
          );
        }
      } catch (error) {
        toast.error("Error loading property: " + error.message);
      }
    };

    if (id) {
      getProperty();
    }
  }, [id, serverUrl]);

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle>{id ? "Edit Property" : "List Your Property"}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>

        <div className="px-6 mb-6">
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        <CardContent>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">
              {steps[currentStep].description}
            </h3>
            <p className="text-sm text-muted-foreground">
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
                  <div className="text-red-500 mt-2">{errors.images}</div>
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

        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button onClick={saveProperty} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Property
            </Button>
          ) : (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PlacesForm;
