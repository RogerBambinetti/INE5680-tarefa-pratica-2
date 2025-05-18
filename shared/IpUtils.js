import fetch from 'node-fetch';

const TOKEN = 'SEU_TOKEN_IPINFO_AQUI';

export async function getCountryFromIP() {
    const res = await fetch(`https://ipinfo.io/json?token=${TOKEN}`);
    const data = await res.json();
    return data.country;
}