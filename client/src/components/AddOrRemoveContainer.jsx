/* eslint-disable react/prop-types */
import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
const AddOrRemoveContainer = ({ remove, value, add }) => {
  return (
    <div className="flex items-center justify-between gap-3 space-x-2">
      <Button onClick={remove} className="minus rounded-full p-4 w-0 h-0">
        <Minus />
      </Button>
      <div>
        <p>{value}</p>
      </div>
      <Button onClick={add} className="add rounded-full p-4 w-0 h-0">
        <Plus />
      </Button>
    </div>
  );
};

export default AddOrRemoveContainer;
