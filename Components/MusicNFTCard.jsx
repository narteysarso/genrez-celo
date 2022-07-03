import { useMemo } from "react";
import { Button, Card, Stack } from "react-bootstrap";
import { usePlayer } from "../hooks/Player";
import { capitalize, makeMusic } from "../utils";

/**
 * Generates MusicNFT Card from nft metadata
 * @param {Object} musicMetadata MusicNFT metadata 
 * @returns 
 */
 export function MusicNFTCard({musicMetadata}) {

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
                    <span><b>Title: {capitalize(name)}</b></span>
                    <span>{description}</span>
                    <span>Artist: {artist}</span>
                    <span>Feature: {feature}</span>
                    <Stack direction="horizontal" gap={5}>
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
                        <Button variant="success" block={false} title={`Tip ${artist} & ${feature}`}>
                        <i className="bi bi-cash-coin"></i>
                        </Button>
                    </Stack>
                </Stack>
            </Card.ImgOverlay>
        </Card>
    );
}
