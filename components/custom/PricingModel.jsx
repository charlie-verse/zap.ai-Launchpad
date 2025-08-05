import Lookup from "@/data/Lookup";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { PayPalButtons } from "@paypal/react-paypal-js";
import { UserDetailContext } from "@/context/UserDetailContext";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [selectedOption, setSelectedOption] = useState();
  const [processingPayment, setProcessingPayment] = useState(false);

  const UpdateToken = useMutation(api.users.UpdateToken);

  useEffect(() => {
    console.log(userDetail);
  }, [userDetail]);

  const onPaymentSuccess = async (price, usr) => {
    setProcessingPayment(true);
    try {
      console.log(selectedOption);
      console.log(price);
      console.log(usr);
      const token = Number(usr?.token) + Number(price?.value);
      console.log(token);
      await UpdateToken({
        token: token,
        userId: userDetail?._id,
      });
    } finally {
      setProcessingPayment(false);
    }
  };

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Lookup.PRICING_OPTIONS.map((pricing, index) => (
        <div
          className="flex flex-col gap-6 border border-gray-700 rounded-2xl p-8 justify-between hover:shadow-lg transition-all duration-300 hover:border-gray-600 bg-[#151515] relative overflow-hidden"
          key={index}
        >
          <div className="flex flex-col gap-4">
            <h2 className="font-bold text-2xl text-white break-words">
              {pricing.name}
            </h2>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-gray-300 font-medium">
                {pricing.tokens}
              </span>
              <span className="text-sm text-gray-400">Tokens</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {pricing.desc}
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <div className="text-center">
              <h2 className="font-bold text-4xl text-white">
                <span className="text-2xl">$</span>
                {pricing.price}
              </h2>
            </div>

            {userDetail ? (
              <div className="space-y-3">
                {/* PayPal Button */}
                <div
                  className="relative"
                  onClick={() => {
                    setSelectedOption(pricing);
                    console.log(pricing);
                  }}
                >
                  <div className="paypal-button-container rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <PayPalButtons
                      style={{
                        layout: "vertical",
                        color: "gold",
                        shape: "rect",
                        label: "pay",
                        height: 45,
                        tagline: false,
                      }}
                      fundingSource="paypal"
                      disabled={!userDetail || processingPayment}
                      onCancel={() => {
                        console.log("payment cancel");
                        setProcessingPayment(false);
                      }}
                      onClick={() => {
                        setSelectedOption(pricing);
                        console.log(pricing);
                      }}
                      onApprove={() => {
                        setSelectedOption(pricing);
                        console.log(pricing);
                        let price = pricing;
                        let usr = userDetail;
                        onPaymentSuccess(price, usr);
                      }}
                      onError={() => {
                        setProcessingPayment(false);
                      }}
                      createOrder={(data, actions) => {
                        setProcessingPayment(true);
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: pricing.price,
                                currency_code: "USD",
                              },
                            },
                          ],
                        });
                      }}
                    />
                  </div>

                  {/* Processing overlay */}
                  {processingPayment &&
                    selectedOption?.name === pricing.name && (
                      <div className="absolute inset-0 bg-gray-800 bg-opacity-90 rounded-lg flex items-center justify-center">
                        <div className="flex items-center gap-2 text-gray-300">
                          <div className="w-4 h-4 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin"></div>
                          <span className="text-sm font-medium">
                            Processing...
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secure payment powered by PayPal
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-400 mb-3">
                  Sign in to purchase
                </p>
                <Button
                  variant="outline"
                  className="w-full rounded-lg border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300 hover:text-white"
                  disabled
                >
                  Login Required
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PricingModel;
