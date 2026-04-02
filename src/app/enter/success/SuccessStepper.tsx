"use client";

import { useState } from "react";
import { WIZARD_STEPS } from "../constants";

export default function SuccessStepper() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <div className="mb-10">
        <div className="flex items-start justify-between relative">
          {[1, 2, 3].map((connectorAfterStep) => (
            <div
              key={connectorAfterStep}
              className="absolute top-[46px] md:top-[50px] border-t-2 border-solid border-[#23100A]"
              style={{
                left: `calc(${(connectorAfterStep - 1) * 25 + 12.5}% + 20px)`,
                right: `calc(${(4 - connectorAfterStep) * 25 - 12.5}% + 20px)`,
              }}
            />
          ))}

          {WIZARD_STEPS.map((step, index) => {
            const stepNum = index + 1;
            const isActive = stepNum === 4;
            return (
              <div key={index} className="flex flex-col items-center flex-1 relative z-10">
                <p className="text-base text-slate-400 font-medium mb-1.5">
                  Step {stepNum}
                </p>
                {isActive ? (
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base font-bold border-2 bg-[#23100A] border-[#23100A] text-[#FFE169]">
                    {stepNum}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setModalVisible(true)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-base font-bold border-2 bg-slate-100 border-[#23100A] text-[#23100A] hover:bg-slate-200 transition-colors"
                  >
                    {stepNum}
                  </button>
                )}
                <p className="text-center mt-1.5 leading-tight">
                  <span className="hidden md:block text-base text-slate-500">
                    {step.label}
                    <br />
                    {step.sublabel}
                  </span>
                  <span className="md:hidden text-base text-slate-500">
                    {step.mobileLabel}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {modalVisible && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setModalVisible(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base text-slate-700 leading-relaxed">
              The competition entry process is now complete. You can no longer change any details.
            </p>
            <button
              type="button"
              onClick={() => setModalVisible(false)}
              className="mt-4 w-full border-2 border-[#23100A] bg-[#FFE169] hover:bg-[#23100A] hover:text-[#FFE169] text-[#23100A] font-bold py-2.5 px-4 rounded-lg text-base transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
}
