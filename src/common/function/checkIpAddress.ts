export default function checkIpAddress(
  location: string,
  room: any,
): Promise<boolean> {
  const ipAddress = room.ipAddress.some(
    (element: string) => element == location,
  );
  return ipAddress;
}
