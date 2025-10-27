/* eslint-disable react/prop-types */
import { CloudUploadOutlined, DeleteOutlineRounded } from "@mui/icons-material";
import useServer from "../hooks/ServerUrl";
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
    <>
      <div className=" flex flex-row gap-2 w-full">
        <input
          type="text"
          placeholder="Add image by link"
          name="imageLink"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
        />
        <button
          className=" bg-slate-300 rounded-md w-28 text-center"
          onClick={uploadByLink}
        >
          Add Image
        </button>
      </div>
      <div className=" grid grid-cols-3 gap-3 mt-2 w-full">
        {formData.images.length > 0 &&
          formData.images.map((image, index) => (
            <div key={index} className=" relative">
              <img
                src={image}
                alt=""
                className=" h-28 lg:h-32 w-full rounded-md object-cover"
              />
              <div className=" absolute bottom-2 right-2 z-10 bg-totem-pole-100 flex items-center justify-center rounded-full p-1">
                <DeleteOutlineRounded
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => removeImage(image)}
                />
              </div>
            </div>
          ))}
        <label
          htmlFor="images"
          className=" flex items-center justify-center gap-x-2 p-5 rounded-md bg-slate-300 cursor-pointer h-28 lg:h-32"
        >
          <CloudUploadOutlined />
          <input
            type="file"
            name="images"
            id="images"
            className=" hidden"
            multiple
            onChange={uploadImage}
          />
          <span>Upload</span>
        </label>
      </div>
    </>
  );
};

export default ImagesUploader;
