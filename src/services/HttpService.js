
const baseUrl = 'https://gameboy-online-backend.vercel.app';

const GetRomFiles = async () => {

    const romData = window.localStorage.getItem("@GB/romData");

    if (!romData) {
        const response = await fetch(`${baseUrl}/api/file`);
        let jsonData = await response.json();

        jsonData = jsonData.map((data, index) => ({...data, romIndex: index}))

        window.localStorage.setItem("@GB/romData", JSON.stringify(jsonData))

        return jsonData;
    }

    return JSON.parse(romData);
}

export {GetRomFiles};