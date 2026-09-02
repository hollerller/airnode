import { instance } from "./axios";

export const patchDeviceSettings = async (
  deviceId: string,
  samplingInterval: number,
) => {
  const samplingIntervalSec = samplingInterval * 60;

  try {
    const response = await instance.patch(`devices/${deviceId}/settings`, {
      samplingIntervalSec: samplingIntervalSec,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
