import {
    createContext,
    useState,
    useCallback,
} from "react";
import { useCelo } from "@celo/react-celo";

import contractArtifat from "../../abis/MusicNFT.json";
import { fetchMetaData, uploadToIpfs } from "../../utils";
import {
    getMusicNFT,
    getOwnerMusicNFT,
    mintMusic,
    ownersTotalMusicNFT,
} from "../../services/musicNFT";
import { DEFAULT_MUSIC_COVER } from "../../constants";

const MusicNFTContext = createContext();

//MusicNFT contract context provider handling contract data
export function MusicNFTProvider({ children }) {
    const [collection, setCollection] = useState([]);

    return (
        <MusicNFTContext.Provider
            value={{
                collection,
                setCollection,
            }}
        >
            {children}
        </MusicNFTContext.Provider>
    );
}


//MusicNFT contract hook to interact with contract
export function useMusicNFT() {
    const { getConnectedKit, address } = useCelo();

    const getContract = useCallback(async () => {
        const kit = await getConnectedKit();

        const contract = new kit.connection.web3.eth.Contract(
            contractArtifat.abi,
            contractArtifat.address
        );

        return contract
    },[getConnectedKit])

    const mintMusicNFT = useCallback(async ({
		artist,
        title,
        coverFile,
        musicFile,
        description,
        language,
        copyright,
        encoding,
        date,
        publisher,
		feature
    }) => {

       const contract = await getContract();

        if (!musicFile) {
            toast.error("Can mint without a music file");
            return;
        }

        //upload music file to ipfs
        const musicURI = await uploadToIpfs(musicFile);

        let ipfsCoverImage = DEFAULT_MUSIC_COVER;

        if (coverFile) {
            //upload cover image to ipfs
            ipfsCoverImage = await uploadToIpfs(coverFile);
        }

        //prepare meta data
        const data = JSON.stringify({
            name: title,
            description,
            image: ipfsCoverImage,
            attributes: [
				{
					trait_type: "artist",
					value: artist
				},
				{
					trait_type: "feature",
					value: feature
				},
                {
                    trait_type: "language",
                    value: language,
                },
                {
                    trait_type: "encoding",
                    value: encoding,
                },
                {
                    trait_type: "date",
                    value: date,
                },
                {
                    trait_type: "copyright",
                    value: copyright,
                },
                {
                    trait_type: "publisher",
                    value: publisher,
                },
                {
                    trait_type: "musicURI",
                    value: musicURI,
                },
            ],
        });

        const metadataURI = await uploadToIpfs(data);

        await mintMusic(contract, address, metadataURI);
    },[address,getContract])

    const getMusicNFTs = useCallback(async () => {
		const contract = await getContract();

        const ownersNFTLength = await ownersTotalMusicNFT(contract, address);

        const nfts = [];
        for (let i = 0; i < ownersNFTLength; i++) {
            const nft = new Promise(async (resolve) => {
				try {
					const tokenId = await getOwnerMusicNFT(contract, address, i);
					const uri = await getMusicNFT(contract, tokenId);
					const metadata = await fetchMetaData(uri);
					resolve({ ...metadata, owner: address });
				} catch (error) {
					resolve(null);
				}
            });

            nfts.push(nft);
        }

		const results = await Promise.all(nfts);

        return results;
    },[getContract, address])

    return Object.freeze({
        mintMusicNFT,
		getMusicNFTs
    });
}
