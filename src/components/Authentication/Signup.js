import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useHistory } from "react-router";
import Swal from 'sweetalert2';

const Signup = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const history = useHistory();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    if (password.length < 6) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: "Password must be at least 6 characters long",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: "Password must contain at least one uppercase letter",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: "Password must contain at least one lowercase letter",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    // Check for at least one digit
    if (!/\d/.test(password)) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: "Password must contain at least one digit",
        showConfirmButton: false,
        timer: 2000,
      });
      return false;
    }

    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      Swal.fire({
        position: "top-center",
        icon: "error",
        title: "Please Fill all the Feilds",
        showConfirmButton: false,
        timer: 2000
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: "Confirm Passwords Do Not Match",
        showConfirmButton: false,
        timer: 2000
      });
      setPicLoading(false);
      return;
    }
    console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      console.log(data);
      Swal.fire({
        position: "top-center",
        icon: "success",
        title: "Registration Successful",
        showConfirmButton: false,
        timer: 2000
      });
      // setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false)
      history.push("/chats");
      window.location.reload()

    } catch (error) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: error.response.data.message,
        showConfirmButton: false,
        timer: 2000
      });

      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      Swal.fire({
        position: "top-center",
        icon: "warning",
        title: 'Please select an image',
        showConfirmButton: false,
        timer: 2000
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "mern-chat");
      data.append("cloud_name", "di9rmuavn");
      fetch("https://api.cloudinary.com/v1_1/di9rmuavn/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default Signup;
