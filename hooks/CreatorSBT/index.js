import {
    createContext,
    useEffect,
    useState,
    useCallback,
    useContext,
} from "react";
import { useCelo } from "@celo/react-celo";

import contractArtifat from "../../abis/CreatorSBT.json";
import {
    burnProfile,
    getProfileURI,
    mintProfile,
    updateProfileURI,
} from "../../services/createSBT";
import { fetchMetaData, uploadToIpfs } from "../../utils";

const CreateSBTContext = createContext();

//CreateSBT contract context provider for handling contract data
export function CreateSBTProvider({ children }) {
    const [creator, setCreator] = useState(null);

    return (
        <CreateSBTContext.Provider
            value={{
                creator,
                setCreator,
            }}
        >
            {children}
        </CreateSBTContext.Provider>
    );
}

//CreateSBT contract hook for interacting with contract
export function useCreateSBT() {
    const { getConnectedKit, address } = useCelo();
    const { creator, setCreator } = useContext(CreateSBTContext);

    //get contract instance for CreatorSBT contract
    const getContract = async () => {
        const kit = await getConnectedKit();

        const contract = new kit.connection.web3.eth.Contract(
            contractArtifat.abi,
            contractArtifat.address
        );

        return contract;
    };

    //get profile nft metadata for address
    const getProfile = async () => {
        const contract = await getContract();

        const profileURI = await getProfileURI(contract, address);

        if (!profileURI) {
            setCreator(null);
            return;
        }

        const profileMetadata = await fetchMetaData(profileURI);

        setCreator(profileMetadata);
    };

    useEffect(() => {
      if(!address){
        return ;
      }
        getProfile();
    }, [address]);

    //create/mint profile nft on CreatorSBT contract
    const createProfile = async ({ username, description, file }) => {
        const contract = await getContract();

        let ipfsImage =
            "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png";

        // upload profile image to ipfs
        if (file) {
            ipfsImage = await uploadToIpfs(file);
        }

        //construct sbt metadata to JSON format
        const data = JSON.stringify({
            name: username,
            description,
            image: ipfsImage,
        });

        const uri = await uploadToIpfs(data);

        await mintProfile(contract, address, uri);
    };

    //updating minted profile nft on CreatorSBT contract
    const updateProfile = async ({ username, description, file }) => {
        const contract = await getContract();

        let ipfsImage = "defaultImage_uri";

        //upload profile image to ipfs
        if (file) {
            ipfsImage = await uploadToIpfs(file);
        }

        //construct sbt metadata to JSON format
        const data = JSON.stringify({
            name: username,
            description,
            image: ipfsImage,
        });

        //upload metadata to ipfs
        const uri = await uploadToIpfs(data);

        await updateProfileURI(contract, address, uri);
    };

    //burn profile nft on CreatorSBT contract
    const removeProfile = async () => {
        const contract = await getContract();

        await burnProfile(contract, address);
    };

    return Object.freeze({
        getProfile,
        removeProfile,
        createProfile,
        updateProfile,
        creator,
    });
}
