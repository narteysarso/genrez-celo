import { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Button, Stack } from "react-bootstrap";
import { DEFAULT_MUSIC_COVER } from "../../constants";
import { useMusicNFT } from "../../hooks/MusicNFT";
import { usePlayer } from "../../hooks/Player";
import { makeMusic } from "../../utils";

/**
 * Generates MusicNFT Card from nft metadata
 * @param {Object} musicMetadata MusicNFT metadata 
 * @returns 
 */
function MusicNFT({musicMetadata}) {

    const music = useMemo( () => makeMusic(musicMetadata), [musicMetadata]);

    const { togglePlay, currentSong, paused } = usePlayer({ source: music});

    const isCurrentSong = useMemo(() => {
        return currentSong?.uri !== music?.uri || (currentSong?.uri === music?.uri && paused);
    },[currentSong, music.uri , paused])

    if(!music){
        return null;
    }

    const {name, description, image, artist, feature, uri} = music;

    return (
        <Card className="bg-dark text-white">
            <Card.Img
                src={image || DEFAULT_MUSIC_COVER}
                alt="Card image"
                className="fluid"
            />
            <Card.ImgOverlay className="nft-card-overlay">
                <Stack gap={1}>
                    <span><b>Title: {name}</b></span>
                    <span>{description}</span>
                    <span>Artist: {artist}</span>
                    <span>Feature: {feature}</span>
                    <Button
                        block={false}
                        title={uri}
                        variant="outline-light"
                        active={!isCurrentSong}
                        onClick={togglePlay.bind(this)}
                    >
                        { isCurrentSong ? (
                            <i className="bi bi-play-circle-fill"></i>
                        ) : (
                            <i className="bi bi-pause-circle-fill"></i>
                        )}
                    </Button>
                </Stack>
            </Card.ImgOverlay>
        </Card>
    );
}


/**
 * display music cards
 */
export function MusicList() {
    //Music nft contract hook
    const { getMusicNFTs } = useMusicNFT();

    //Holds all fetched music nfts
    const [nftCollection, setNFTCollection] = useState([]);

    useEffect(() => {
        (async () => {
            setNFTCollection(await getMusicNFTs());
        })();
    }, [getMusicNFTs]);

    return (
        <Row className="mt-5 mb-5">
            <Col xs={12}>
                <h3>Music Lists</h3>
            </Col>
            <Col xs={12}>
                <Row className="g-3 align-items-stretch">
                    {/* Render music nft cards */}
                    {nftCollection &&
                        nftCollection?.map((nft, idx) => (
                            <Col key={idx} sm={6} md={3} lg={2}>
                                <MusicNFT key={idx} musicMetadata={nft} />
                            </Col>
                        ))}
                </Row>
            </Col>
        </Row>
    );
}
