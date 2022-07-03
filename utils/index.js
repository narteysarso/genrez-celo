import { IPFS_NODE } from "../constants";

//upload data to ipfs
export const uploadToIpfs = async (file) => {
    const ipfs = await import("ipfs-http-client");

    const client = ipfs.create("https://ipfs.infura.io:5001/api/v0");
    if (!file) return;
    try {
        const added = await client.add(file, {
            progress: (prog) => console.log(`received: ${prog}`),
        });
        return `${IPFS_NODE}/${added.path}`;
    } catch (error) {
        throw error;
    }
};

//fetch data from ipfs
export const fetchMetaData = async (ipfsUrl) => {
    if (!ipfsUrl) {
        return null;
    }

    const response = await fetch(ipfsUrl, {
        method: "GET",
    });

    if (!response) {
        return null;
    }

    return await response.json();
};

//converts music metadata to frozen object
export const makeMusic = (musicMetadata = null) => {
    if (typeof musicMetadata !== "object") {
        return null;
    }
    const { name, description, image, attributes, owner } = musicMetadata;
    const [
        artist,
        feature,
        language,
        encoding,
        date,
        copyright,
        publisher,
        musicURI,
    ] = attributes;

    return Object.freeze({
        name,
        description,
        image,
        artist: artist.value,
        feature: feature.value,
        uri: musicURI.value,
        language: language.value,
        econding: encoding.value,
        date: date.value,
        copyright: copyright.value,
        publisher: publisher.value,
        owner
    });
};

//convert artist metadata to frozen object
export const makeCreator = (artistMusicMetadata = null) => {
    if (typeof artistMusicMetadata !== "object") {
        return null;
    }

    const { name, description, image, owner } = artistMusicMetadata;

    return Object.freeze({
        name,
        description,
        image,
        owner
    });
};

//capitalize some a word
export const capitalize = (word ="") => {
    if(!word){
        return word;
    }

    const wordArray =  word.split("")

    return `${wordArray[0].toUpperCase()}${wordArray.slice(1).join("")}`;
}
