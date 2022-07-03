import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";

import { useMusicNFT } from "../../hooks/MusicNFT";
import { Empty } from "../Empty";
import { MusicNFTCard } from "../MusicNFTCard";

export function SongListings() {
    const { getMusicNFTs } = useMusicNFT();

    //Holds all fetched music nfts
    const [nftCollection, setNFTCollection] = useState(null);

    useEffect(() => {
        (async () => {
            setNFTCollection(await getMusicNFTs());
        })();
    }, [getMusicNFTs]);

    return (
        <Row className="mt-5 mb-5">
            <Col xs={12}>
                <h3>Songs</h3>
            </Col>
            <Col xs={12}>
                <Row className="g-3 align-items-stretch">
                    {/* Render music nft cards */}
                    {nftCollection && nftCollection?.length ? (
                        nftCollection?.map((nft, idx) => (
                            <Col key={idx} sm={6} md={3} lg={2}>
                                <MusicNFTCard key={idx} musicMetadata={nft} />
                            </Col>
                        ))
                    ) : (
                        <Empty title="No music data" />
                    )}
                </Row>
            </Col>
        </Row>
    );
}
