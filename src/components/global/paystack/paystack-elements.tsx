import React, { ChangeEvent, useState } from "react"
import { PaystackButton } from "react-paystack"

const App: React.FC = () => {
  const publicKey = "pk_your_public_key_here"
  const amount = 1000000
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  const componentProps = {
    email: formData.email,
    amount,
    publicKey,
    text: "Pay Now",
    metadata: {
      custom_fields: [
        {
          display_name: "Name",
          variable_name: "name",
          value: formData.name,
        },
        {
          display_name: "Phone",
          variable_name: "phone",
          value: formData.phone,
        },
      ],
    },
    onSuccess: () =>
      alert("Thanks for doing business with us! Come back soon!!"),
    onClose: () => alert("Wait! Don't leave :("),
  }

  return (
    <div className="text-center font-roboto tracking-wider">
      <div className="flex flex-row w-[635px] h-[430px] mx-auto my-20 bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="relative w-1/2">
          <img src="" alt="Product" className="w-full h-[430px] object-cover" />
          <div className="absolute inset-0 bg-[#303030] opacity-20 z-10" />
          <div className="absolute bottom-5 left-5 text-left text-[#84a17d]">
            <p className="text-lg">Dancing Shoes</p>
            <p className="font-bold">{amount / 100} NGN</p>
          </div>
        </div>

        <div className="flex flex-col justify-center w-1/2 bg-[#84a17d]">
          <form className="p-5">
            <div className="flex flex-col mb-5">
              <label
                className="text-xs text-left uppercase tracking-wider text-[#e0eafc] mb-1"
                htmlFor="name"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="h-9 bg-transparent border border-gray-300 rounded px-2 text-[#e0eafc]"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col mb-5">
              <label
                className="text-xs text-left uppercase tracking-wider text-[#e0eafc] mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="h-9 bg-transparent border border-gray-300 rounded px-2 text-[#e0eafc]"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col mb-5">
              <label
                className="text-xs text-left uppercase tracking-wider text-[#e0eafc] mb-1"
                htmlFor="phone"
              >
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                className="h-9 bg-transparent border border-gray-300 rounded px-2 text-[#e0eafc]"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <PaystackButton
              {...componentProps}
              className="cursor-pointer text-center text-xs tracking-wider uppercase bg-[#bfbfbf] font-bold text-[#e0eafc] rounded w-full h-12 mt-10"
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
