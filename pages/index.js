import { useState, useCallback, useRef, useEffect } from "react";
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
import { useMusicNFT } from "../hooks/MusicNFT";
import debounce from "lodash.debounce";

function useDebounce(callback, delay) {
  const debouncedFn = useCallback(
    debounce((...args) => callback(...args), delay),
    [delay] // will recreate if delay changes
  );
  return debouncedFn;
}

function useDebounceAlt(callback, delay) {
  const memoizedCallback = useCallback(callback, []);
  const debouncedFn = useRef(debounce(memoizedCallback, delay));

  useEffect(() => {
    debouncedFn.current = debounce(memoizedCallback, delay);
  }, [memoizedCallback, debouncedFn, delay]);

  return debouncedFn.current;
}

function SearchBar({ handleSearch, searchLoading = true }) {
    const [searchWord, setSearchWord] = useState("");
    
    const debouncedSave = useDebounce((nextValue) => handleSearch(searchWord), 1000);

    const handleChange = (value) => {
      setSearchWord(value);
      debouncedSave(value);
    };

    return (
        <Row>
            <Col xs={12} md={8} lg={6}>
                <InputGroup className="mb-3">
                    <FormControl
                        aria-label="Example text with button addon"
                        aria-describedby="basic-addon1"
                        placeholder="Artists, albums, or songs"
                        value={searchWord}
                        onChange={(event) => handleChange(event.target.value)}
                    />
                    <Button
                        variant="outline-secondary"
                        id="button-addon1"
                        disabled={searchLoading}
                        onClick={(event) => {
                            handleChange(searchWord);
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
    const {searchCreators, creatorsQueryResults, queryLoading: creatorsqueryloading} = useCreatorSBT();
    const {searchMusic, musicQueryResults, queryLoading: musicqueryloading} = useMusicNFT();
    
    const handleSearch = (searchKey) => {
        try {
            searchCreators(searchKey);
            searchMusic(searchKey);
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Container className="py-5">
            <SearchBar handleSearch={handleSearch} searchLoading={creatorsqueryloading || musicqueryloading}/>
            <SongListings queryList={musicQueryResults} />
            <CreatorsListing key="creatorlist" queryList={creatorsQueryResults}/>
        </Container>
    );
}
