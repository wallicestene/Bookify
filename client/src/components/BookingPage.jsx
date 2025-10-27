/* eslint-disable react/prop-types */
import { Close } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "sonner";
// import { Zoom } from "react-awesome-reveal";
import AOS from "aos";
import "aos/dist/aos.css"; // You can also use <link> for styles
// ..
AOS.init();
const BookingPage = ({ setShowDetails, handleBooking }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    name: "",
    email: "",
    cardNumber: "",
    cvv: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => {
      return {
        ...prevDetails,
        [name]: value,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPaymentDetails((prevDetails) => {
      return {
        ...prevDetails,
        name: "",
        email: "",
        cardNumber: "",
        cvv: "",
      };
    });
  };
  return (
    <section
      data-aos="fade-up"
      data-aos-duration="500"
      data-aos-easing="ease-out"
      data-aos-offset="300"
      className="fixed inset-0 z-50 grid place-content-center bg-black/40 backdrop-blur-sm p-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white max-w-lg w-full shadow-2xl py-6 px-6 md:px-8 flex flex-col gap-6 rounded-2xl"
      >
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-semibold text-xl text-gray-900">Payment Details</h1>
            <p className="text-sm text-gray-600 mt-1">
              Complete your booking with payment information
            </p>
          </div>
          <button
            type="button"
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => setShowDetails(false)}
          >
            <Close fontSize="small" />
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={paymentDetails.name}
              onChange={handleChange}
              className="border border-gray-300 hover:border-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 w-full rounded-lg text-sm transition-colors"
              placeholder="John Doe"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={paymentDetails.email}
              id="email"
              onChange={handleChange}
              className="border border-gray-300 hover:border-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 w-full rounded-lg text-sm transition-colors"
              placeholder="john@example.com"
            />
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-700 mb-3">Card Information</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="number"
                  value={paymentDetails.cardNumber}
                  name="cardNumber"
                  required
                  onChange={handleChange}
                  className="border border-gray-300 hover:border-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 w-full rounded-lg text-sm transition-colors"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="cvv"
                  required
                  onChange={handleChange}
                  value={paymentDetails.cvv}
                  maxLength={3}
                  className="border border-gray-300 hover:border-gray-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none px-3 py-2.5 w-full rounded-lg text-sm transition-colors"
                  placeholder="CVV"
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (
                paymentDetails.email &&
                paymentDetails.name &&
                paymentDetails.cardNumber &&
                paymentDetails.cvv
              ) {
                handleBooking();
              } else {
                toast.error("Please enter all payment details!");
              }
            }}
            className="bg-orange-500 hover:bg-orange-600 py-3 w-full rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg mt-2"
          >
            Complete Booking
          </button>
        </div>
      </form>
    </section>
  );
};

export default BookingPage;
