import React from "react";
import { DeviceFrameset } from "react-device-frameset";
import "react-device-frameset/styles/marvel-devices.min.css";

interface DeviceFrameProps {
  children: React.ReactNode;
  zoom?: number;
}

/**
 * DeviceFrame - Wraps content in a realistic iPhone X device frame
 * Uses react-device-frameset for professional device mockups
 */
export function DeviceFrame({ 
  children, 
  zoom = 0.8
}: DeviceFrameProps) {
  return (
    <div className="flex justify-center items-center py-8">
      <DeviceFrameset
        device="iPhone X"
        color="black"
        landscape={false}
        zoom={zoom}
      >
        <div className="w-full h-full overflow-auto">
          {children}
        </div>
      </DeviceFrameset>
    </div>
  );
}
