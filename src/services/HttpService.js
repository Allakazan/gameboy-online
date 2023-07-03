
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

const GetFile = async (fileID) => {
    const response = await fetch(`${baseUrl}/api/file/${fileID}`);
    return await response.blob();
}

export { GetRomFiles, GetFile };