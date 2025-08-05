'use client';
import PricingModel from '@/components/custom/PricingModel';
import { UserDetailContext } from '@/context/UserDetailContext';
import Lookup from '@/data/Lookup';
import React, { useContext } from 'react';
import Colors from '@/data/Colors';

function Pricing() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="mt-15 flex flex-col items-center p-10 md:px-32 lg:px-48 w-full ">
      <h2 className="font-bold text-5xl">Pricing</h2>
      <p className="text-gray-400 max-w-xl text-center my-5">
        {Lookup.PRICING_DESC}
      </p>
    <div className="p-5 border rounded-xl w-full flex justify-between" style ={{backgroundColor: Colors.BACKGROUND}}>
        <h2 className="text-lg mx-5 mt-1 p-2 rounded-md bg-gray-600">
          <span className="font-bold">Tokens Left : {userDetail?.token}</span> 
        </h2>
        <div>
          <h2 className="font-bold">Need more tokens?</h2>
          <p>Upgrade your plan below</p>
        </div>
      </div>
    <PricingModel />
    </div>
  );
}

export default Pricing;
