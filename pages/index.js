import { useState } from "react";
import {
    Button,
    Col,
    Container,
    FormControl,
    InputGroup,
    Row,
} from "react-bootstrap";
import { CreatorsListing } from "../Components/Home/CreatorsListing";
import { SongListings } from "../Components/Home/SongListing";
import { useCreatorSBT } from "../hooks/CreatorSBT";

function SearchBar({ handleSearch, searchLoading }) {
    const [searchWord, setSearchWord] = useState("");

    return (
        <Row>
            <Col xs={12} md={8} lg={6}>
                <InputGroup className="mb-3">
                    <FormControl
                        aria-label="Example text with button addon"
                        aria-describedby="basic-addon1"
                        placeholder="Artists, albums, or songs"
                        value={searchWord}
                        onChange={(event) => setSearchWord(event.target.value)}
                    />
                    <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        disabled={searchLoading}
                        onClick={(event) => {
                            if(!searchWord){
                                return;
                            }
                            handleSearch(searchWord);
                        }}
                    >
                        {searchLoading ? (
                            <div
                                className="spinner-border text-light spinner-border-sm"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        ) : (
                            <i className="bi bi-search"></i>
                        )}
                    </Button>
                </InputGroup>
            </Col>
        </Row>
    );
}

export default function Home() {
    const {searchCreators, searchLoading} = useCreatorSBT();
    return (
        <Container className="py-5">
            <SearchBar handleSearch={searchCreators} searchLoading={searchLoading}/>
            <SongListings />
            <CreatorsListing />
        </Container>
    );
}
