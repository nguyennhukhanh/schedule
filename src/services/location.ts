import fetch from 'node-fetch';

export default async function getLocationFromIpAddress(ipAddress?: string) {
  // const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.API_KEY_ADDRESS}&ip=${ipAddress}`;
  const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.API_KEY_ADDRESS}`;

  const response = await fetch(url);
  const data: any = await response.json();

  return {
    ip: data.ip,
    country: data.country_name,
    region: data.region,
    city: data.city,
    latitude: data.latitude,
    longitude: data.longitude,
  };
}
