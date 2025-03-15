import { Link } from "react-router-dom";
import AddedProperties from "../components/AddedProperties";
import useFetch from "../hooks/useFetch";
import { Alert } from "@mui/material";
import { Button } from "../components/ui/button";
import { useUserContext } from "../hooks/Usercontext";
// import AccountNav from "../components/AccountNav";
import BeatLoader from "react-spinners/BeatLoader";
import useServer from "../hooks/ServerUrl";
import { Plus } from "lucide-react";
const PropertiesPage = () => {
  const [{ user }] = useUserContext();
  const { data, isLoading, error } = useFetch(
    `${useServer()}api/properties/owner/${user?.userId}`
  );
  return (
    <div className="w-full px-4 md:px-6 py-6 font-Mulish">
      {/* header section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold">My Properties</h1>
          <p className="text-gray-500 ">
            Here you can view and manage all your properties
          </p>
        </div>
        <Link to="/account/myProperties/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Property
          </Button>
        </Link>
      </div>

      {/* content section */}
      {isLoading && (
        <div className="flex justify-center items-center h-48">
          <BeatLoader color="#ff7a00" size={20} speedMultiplier={0.8} />
        </div>
      )}
      {error && (
        <div className="w-full h-48 flex items-center justify-center">
          <Alert severity="error">{error}</Alert>
        </div>
      )}

      {!isLoading && data.length === 0 && (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <div className="rounded-full bg-primary/10 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No properties yet</h3>
            <p className="text-gray-500 mb-4">
              Get started by adding your first property
            </p>
            <Link to="/account/myProperties/new">
              <Button size="lg">Add Your First Property</Button>
            </Link>
          </div>
        </div>
      )}

      {!isLoading && data?.length > 0 && (
        <div className=" grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-4 gap-y-24 m-3 p-2 lg:place-items-start place-items-center ">
          {/* New Property Card */}
          <Link to="/account/myProperties/new" className="w-full">
            <div className="h-full w-full min-h-[300px] rounded-lg border-2 border-dashed border-gray-200 hover:border-primary transition-colors p-6 flex flex-col items-center justify-center text-center group">
              <div className="rounded-full bg-primary/10 p-3 mb-4 group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Add New Property</h3>
              <p className="text-sm text-gray-500">
                Add a new property for listing
              </p>
            </div>
          </Link>
          {data?.map((property) => (
            <AddedProperties key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertiesPage;
