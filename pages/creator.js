import {
  Container,
  Row,
  Col,
  Modal,
  Form,
  InputGroup,
  FormControl,
  Button,
  Image,
} from "react-bootstrap";
import { useCelo } from "@celo/react-celo";
import { useState } from "react";

import { useCreateSBT } from "../hooks/CreatorSBT";
import { toast } from "react-toastify";
import { Banner } from "../Components/Creator/Banner";
import { DEFAULT_PROFILE_IMAGE } from "../constants";
import { MusicList } from "../Components/Creator/MusicList";

function RegistrationModal({ show = false }) {
  const { createProfile, creator, getProfile } = useCreateSBT();
  const [profileImage, setProfileImage] = useState(
    creator?.image || DEFAULT_PROFILE_IMAGE
  );
  const [username, setUsername] = useState(creator?.name);
  const [description, setDescription] = useState(creator?.description);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {};

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (!username || !description) {
        toast.error("Username and bio are required");
      }
      
      await createProfile({ username, description, file: imageFile });

      toast.success("Profile successfully minted");

      getProfile();
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleUserDescriptionChange = (event) => {
    setDescription(event.target.value);
  };
  const handleImageChange = (event) => {
    const file = event.target.files[0];

    setImageFile(file);
    setProfileImage(window.URL.createObjectURL(file));
  };

  toast.success("Profile successfully minted");

  return (
    <Modal className="text-dark" centered show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create A Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form  onSubmit={handleSubmit}>
          <Form.Group className="mb-4 text-center" controlId="username.Input">
            <Form.Label>
              <Image
                roundedCircle
                fluid
                alt="profile picture"
                src={profileImage}
                style={{ maxWidth: "120px" }}
              />
            </Form.Label>
            <Form.Control disabled={loading} type="file" onChange={handleImageChange} />
          </Form.Group>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
            <FormControl
            disabled={loading}
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
              onChange={handleUsernameChange}
              value={username}
            />
          </InputGroup>

          <Form.Group className="mb-3" controlId="bio.textarea">
            <Form.Label>Bio</Form.Label>
            <Form.Control
            disabled={loading}
              as="textarea"
              rows={3}
              value={description}
              onChange={handleUserDescriptionChange}
            />
          </Form.Group>
          <Form.Group>
            <Row className="justify-content-between">
              <Col className="auto flex-grow-1">
                <Button disabled={loading} type="reset" variant="warning">
                  Reset
                </Button>
              </Col>
              <Col>
                <Button type="submit" disabled={loading} variant="info">
                  {creator ? "Update" : "Mint"} Profile
                  {loading && (
                    <div className="spinner-border text-light spinner-border-sm" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  )}
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default function Creator() {
  const { address } = useCelo();
  const { getProfile, creator } = useCreateSBT();

  if (!creator) {
    return <RegistrationModal show={true} />;
  }

  return (
    <Container className="pb-5">
      <Banner />
      <MusicList />
    </Container>
  );
}
