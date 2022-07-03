import { useEffect, useState } from "react";
import {Row, Col} from "react-bootstrap";

import { useCreatorSBT } from "../../hooks/CreatorSBT";
import { CreatorSBTCard } from "../CreatorSBTCard";
import { Empty } from "../Empty";

import { MusicNFTCard } from "../MusicNFTCard";

export function CreatorsListing(){
    const {getProfiles} = useCreatorSBT();

    //Holds all fetched music nfts
    const [creatorsCollection, setNFTCollection] = useState([]);

    useEffect(() => {
        (async () => {
            const creators = await getProfiles();
            if(!creators){
                setNFTCollection([]);
            }

            setNFTCollection(creators);
            
        })();
    }, [getProfiles]);

    return (
        <Row className="mt-5 mb-5">
            <Col xs={12}>
                <h3>Creators</h3>
            </Col>
            <Col xs={12}>
                <Row className="g-3 align-items-stretch">
                    {/* Render music nft cards */}
                    {creatorsCollection && creatorsCollection?.length ?
                        creatorsCollection?.map((nft, idx) => (
                            <Col key={idx} sm={6} md={3} lg={2}>
                                <CreatorSBTCard creatorMetadata={nft} />
                            </Col>
                        )) : <Empty title={"No creator data"}/>
                        }
                </Row>
            </Col>
        </Row>
    )
}